from flask import Blueprint

page = Blueprint("index", __name__)


@page.route("/")
def home():
    return {
        "message": "Welcome to the LangChain backend API!",
    }
