import asyncio
import os
from typing import Any, AsyncGenerator, TypedDict

from langchain import ConversationChain, OpenAI
from langchain.callbacks import get_openai_callback
from langchain.callbacks.streaming_aiter import AsyncIteratorCallbackHandler
from langchain.memory import ConversationSummaryBufferMemory
from quart import Blueprint, request

from atypes.error import AppError
from atypes.message import Message
from utils.memory import get_chat_memory

page = Blueprint(
    f"{os.path.dirname(__file__).replace(os.path.sep, '-')}-{os.path.splitext(os.path.basename(__file__))[0]}",
    __name__,
)


# Define the expected input type
class Input(TypedDict):
    prompt: str
    messages: list[Message]


@page.route("/", methods=["POST"])
async def chat() -> Any | tuple[AppError, int]:
    """
    Given a prompt and a list of messages, predict the next message. Or in other words, chat.
    """
    try:
        data: Input = await request.get_json()

        prompt = data["prompt"]
        memory = ConversationSummaryBufferMemory(
            llm=OpenAI(), chat_memory=get_chat_memory(data.get("messages", []))
        )

        handler = AsyncIteratorCallbackHandler()
        conversation = ConversationChain(
            llm=OpenAI(streaming=True, callbacks=[handler]), memory=memory
        )

        async def ask_question_async():
            # Counting tokens is not yet available with streaming=True
            # See https://github.com/langchain-ai/langchain/pull/9249
            #
            # with get_openai_callback() as cb:
            asyncio.create_task(conversation.apredict(input=prompt))
            async for i in handler.aiter():
                yield i
            yield "[END]"
            # yield str(cb.total_tokens)

        return ask_question_async(), {"Content-Type": "text/event-stream"}

    except Exception as e:
        return {"error": "{}: {}".format(type(e).__name__, str(e))}, 500
