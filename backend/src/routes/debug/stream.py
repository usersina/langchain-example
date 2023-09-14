import asyncio
import os
from typing import Any, AsyncGenerator, TypedDict

from langchain.callbacks.streaming_aiter import AsyncIteratorCallbackHandler
from langchain.llms import OpenAI
from quart import Blueprint, request

from utils.generate import generate_random_string

page = Blueprint(
    f"{os.path.dirname(__file__).replace(os.path.sep, '-')}-{os.path.splitext(os.path.basename(__file__))[0]}",
    __name__,
)


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


@page.route("/dummy", methods=["GET"])
def stream_dummy():
    chunks_amount_arg = request.args.get("chunks_amount")
    chunks_amount = int(chunks_amount_arg) if chunks_amount_arg else 5000

    def generate_output():
        for _ in range(chunks_amount):
            yield generate_random_string(100)
            yield "\n===============================================\n"

    return generate_output(), {"Content-Type": "text/event-stream"}


# POC on the importance of streaming
@page.route("/dummy/none", methods=["GET"])
def streamTextNone() -> str:
    def generate_output():
        a = "qwq"
        for i in range(10000):
            print(i)
            a = (
                a
                + generate_random_string(100)
                + "\n===============================================\n"
            )
        return a

    output = generate_output()
    return output
