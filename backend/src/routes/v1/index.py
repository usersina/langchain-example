import os

from quart import Blueprint

page = Blueprint(
    f"{os.path.dirname(__file__).replace(os.path.sep, '-')}-{os.path.splitext(os.path.basename(__file__))[0]}",
    __name__,
)


@page.route("/")
async def home():
    return {
        "message": "This is the version 1 endpoint!",
    }
