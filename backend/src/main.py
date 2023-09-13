from dotenv import load_dotenv
from quart import Quart
from quart_cors import cors

from routes.chat import page as chat_route
from routes.generate import page as generate_oute
from routes.index import page as index_route
from routes.query_sql import page as sql_route
from routes.stream import page as stream_route

# Load environment variables
load_dotenv(
    dotenv_path=".env",  # Relative to where the script gets executed
)

app = Quart(__name__)
# See https://github.com/corydolphin/flask-cors/issues/257
app.url_map.strict_slashes = False

cors(app)

app.register_blueprint(index_route, url_prefix="/api")
app.register_blueprint(generate_oute, url_prefix="/api/generate")
app.register_blueprint(chat_route, url_prefix="/api/chat")
app.register_blueprint(sql_route, url_prefix="/api/sql")
app.register_blueprint(stream_route, url_prefix="/api/stream")

# Execute only if run as a script
if __name__ == "__main__":
    app.run()
