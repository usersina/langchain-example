import os
from typing import TypedDict

from flask import Blueprint, current_app, request
from langchain.callbacks import get_openai_callback
from langchain.chains import ConversationChain
from langchain.llms import OpenAI
from langchain.memory import ChatMessageHistory, ConversationSummaryBufferMemory

from atypes.error import AppError
from atypes.message import Message

page = Blueprint(os.path.splitext(os.path.basename(__file__))[0], __name__)


# Define the expected input type
class Input(TypedDict):
    prompt: str
    messages: list[Message]


# Define the expected output type
class Output(TypedDict):
    output: str
    tokens: int


@page.route("/", methods=["POST"])
def chat() -> Output | tuple[AppError, int]:
    """
    Given a prompt and a list of messages, predict the next message. Or in other words, chat.
    """
    try:
        data: Input = request.get_json()
        temp_arg = request.args.get("temperature")
        top_p_arg = request.args.get("top_p")
        max_tokens_arg = request.args.get("max_tokens")

        # Process the input
        prompt = data["prompt"]
        existing_messages = data.get("messages", [])
        temperature: float = float(temp_arg) if temp_arg else 0.7
        top_p: float = float(top_p_arg) if top_p_arg else 1
        max_tokens: int = int(max_tokens_arg) if max_tokens_arg else 256

        # Create the memory out of the provided messages if any
        history = ChatMessageHistory()
        for message in existing_messages:
            if message["role"] == "user":
                history.add_user_message(message["content"])
            elif message["role"] == "assistant":
                history.add_ai_message(message["content"])
            else:
                current_app.logger.warning("Unknown message role: %s", message["role"])
        # See possible memory types
        # https://python.langchain.com/docs/modules/memory/types/
        current_app.logger.info("Loaded this many messages: %s", len(history.messages))
        memory = ConversationSummaryBufferMemory(llm=OpenAI(), chat_memory=history)

        # Create the conversation chain and generate the output
        with get_openai_callback() as cb:
            llm = OpenAI(temperature=temperature, top_p=top_p, max_tokens=max_tokens)
            conversation = ConversationChain(llm=llm, memory=memory)
            result = conversation.predict(input=prompt)
            return {"output": result.strip(), "tokens": cb.total_tokens}
    except Exception as e:
        return {"error": "{}: {}".format(type(e).__name__, str(e))}, 500
