from langchain.memory import ChatMessageHistory
from quart import current_app

from atypes.message import Message


def get_chat_memory(existing_messages: list[Message]):
    """
    Create the memory out of the provided messages list.
    """
    history = ChatMessageHistory()
    for message in existing_messages:
        if message["role"] == "user":
            history.add_user_message(message["content"])
        elif message["role"] == "assistant":
            history.add_ai_message(message["content"])
        else:
            current_app.logger.warning("Unknown message role: %s", message["role"])
    current_app.logger.debug("Loaded this many messages: %s", len(history.messages))
    return history
