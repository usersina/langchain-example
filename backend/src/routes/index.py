import os

from quart import Blueprint

page = Blueprint(os.path.splitext(os.path.basename(__file__))[0], __name__)


@page.route("/")
async def home():
    return {
        "message": "Welcome to the LangChain backend API!",
    }
