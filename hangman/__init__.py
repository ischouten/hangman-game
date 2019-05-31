import os
import logquicky
from flask import Flask
from flask_cors import CORS

from config import Config

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

log = logquicky.create("hangman-log", level=os.environ.get("LOG_LVL", "INFO"))
serve_dir = "../react-ui/build"

app = Flask(__name__, static_folder=f"{serve_dir}/static", template_folder=f"{serve_dir}")

# Allow cors for now in development to let frontend talk from development dir
CORS(app, supports_credentials=True, resources={r"/*": {"origins": ["http://localhost:3000"]}})

# Set the secret key to some random bytes. Keep this really secret!
app.secret_key = os.environ.get("SESSION_SECRET", "ShouldBeSecret")

app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)


# Load in the routes as defined in routes.py
from . import routes, models
