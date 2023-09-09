from flask import Flask
from flask_cors import CORS

from routes.index import page as indexRoute

app = Flask(__name__)
# See https://github.com/corydolphin/flask-cors/issues/257
app.url_map.strict_slashes = False

CORS(app)

app.register_blueprint(indexRoute, url_prefix="/api")

# Execute only if run as a script
if __name__ == "__main__":
    app.run()
