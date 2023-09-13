from dotenv import load_dotenv
from quart import Quart
from quart_cors import cors

from routes.debug import DebugRoutes
from routes.index import page as index_route
from routes.v1 import Version1Routes

# Load environment variables
load_dotenv(
    dotenv_path=".env",  # Relative to where the script gets executed
)

app = Quart(__name__)
# See https://github.com/corydolphin/flask-cors/issues/257
app.url_map.strict_slashes = False

cors(app)

# Setup routes
app.register_blueprint(index_route, url_prefix="/api")
DebugRoutes(app)
Version1Routes(app)

# Execute only if run as a script
if __name__ == "__main__":
    app.run()
