import os

from flask import Blueprint

page = Blueprint(os.path.splitext(os.path.basename(__file__))[0], __name__)


@page.route("/")
def home():
    return {
        "message": "Welcome to the LangChain backend API!",
    }
