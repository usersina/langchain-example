import os
from typing import TypedDict

from langchain.callbacks import get_openai_callback
from langchain.llms import OpenAI
from quart import Blueprint, request

from atypes.error import AppError

page = Blueprint(
    f"{os.path.dirname(__file__).replace(os.path.sep, '-')}-{os.path.splitext(os.path.basename(__file__))[0]}",
    __name__,
)


# Define the expected input type
class Input(TypedDict):
    prompt: str


# Define the expected output type
class Output(TypedDict):
    output: str
    tokens: int


@page.route("/", methods=["POST"])
async def generate() -> Output | tuple[AppError, int]:
    """
    Given a prompt, generate some text.
    """
    try:
        data: Input = await request.get_json()
        temp_arg = request.args.get("temperature")
        top_p_arg = request.args.get("top_p")
        max_tokens_arg = request.args.get("max_tokens")

        prompt = data["prompt"]
        temperature: float = float(temp_arg) if temp_arg else 0.7
        top_p: float = float(top_p_arg) if top_p_arg else 1
        max_tokens: int = int(max_tokens_arg) if max_tokens_arg else 256

        with get_openai_callback() as cb:
            llm = OpenAI(temperature=temperature, top_p=top_p, max_tokens=max_tokens)
            return {"output": llm(prompt).strip(), "tokens": cb.total_tokens}
    except Exception as e:
        return {"error": str(e)}, 500


# To stream the response, see
# https://github.com/langchain-ai/langchain/issues/4945
# https://stackoverflow.com/questions/76284412/stream-a-response-from-langchains-openai-with-pyton-flask-api
# https://stackoverflow.com/questions/75826303/is-there-any-way-to-stream-response-word-by-word-of-chatgpt-api-directly-in-reac
#
