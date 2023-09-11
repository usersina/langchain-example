from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from routes.chat import page as chatRoute
from routes.generate import page as generateRoute
from routes.index import page as indexRoute
from routes.querySql import page as querySqlRoute

# Load environment variables
load_dotenv(
    dotenv_path=".env",  # Relative to where the script gets executed
)

app = Flask(__name__)
# See https://github.com/corydolphin/flask-cors/issues/257
app.url_map.strict_slashes = False

CORS(app)

app.register_blueprint(indexRoute, url_prefix="/api")
app.register_blueprint(generateRoute, url_prefix="/api/generate")
app.register_blueprint(chatRoute, url_prefix="/api/chat")
app.register_blueprint(querySqlRoute, url_prefix="/api/sql")

# Execute only if run as a script
if __name__ == "__main__":
    app.run()
