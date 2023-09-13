from quart import Quart

from .chat import page as chat_route
from .generate import page as generate_route
from .index import page as index_route
from .query_sql import page as sql_route
from .stream import page as stream_route


class DebugRoutes:
    """
    Initialize the application debug routes.
    """

    app: Quart
    """
    The Quart application instance.
    """

    prefix: str

    def __init__(self, app: Quart, prefix: str = "/api/debug") -> None:
        self.app = app
        self.prefix = prefix

        self.app.register_blueprint(index_route, url_prefix=f"{self.prefix}")
        self.app.register_blueprint(chat_route, url_prefix=f"{self.prefix}/chat")
        self.app.register_blueprint(
            generate_route, url_prefix=f"{self.prefix}/generate"
        )
        self.app.register_blueprint(sql_route, url_prefix=f"{self.prefix}/sql")
        self.app.register_blueprint(stream_route, url_prefix=f"{self.prefix}/stream")
