from typing import Literal, TypedDict


class Message(TypedDict):
    """
    Represents a message between the user and the assistant.
    """

    role: Literal["user", "assistant"]
    content: str
