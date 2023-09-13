from quart import Quart

from .chat import page as chat_route
from .index import page as index_route


class Version1Routes:
    """
    Initialize the application's actual API routes.
    """

    app: Quart
    """
    The Quart application instance.
    """

    prefix: str

    def __init__(self, app: Quart, prefix: str = "/api/v1") -> None:
        self.app = app
        self.prefix = prefix

        self.app.register_blueprint(index_route, url_prefix=f"{self.prefix}")
        self.app.register_blueprint(chat_route, url_prefix=f"{self.prefix}/chat")
