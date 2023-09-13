import asyncio
import os
from typing import Any, AsyncGenerator, TypedDict

from langchain.callbacks.streaming_aiter import AsyncIteratorCallbackHandler
from langchain.llms import OpenAI
from quart import Blueprint, request

page = Blueprint(os.path.splitext(os.path.basename(__file__))[0], __name__)


# Define the expected input type
class Input(TypedDict):
    prompt: str


@page.route("/", methods=["POST"])
async def stream_text() -> tuple[AsyncGenerator[str, Any], dict[str, str]]:
    data: Input = await request.get_json()

    prompt = data["prompt"]

    async def ask_question_async():
        handler = AsyncIteratorCallbackHandler()
        llm = OpenAI(streaming=True, callbacks=[handler])
        asyncio.create_task(llm.agenerate([prompt]))
        async for i in handler.aiter():
            yield i

    return ask_question_async(), {"Content-Type": "text/event-stream"}
