#!/usr/bin/env python3
import os
import logquicky
from hangman.game import HangmanGame
from hangman.datastore import DataStore
from flask_cors import CORS

from flask import Flask, session, redirect, url_for, escape, request, render_template, jsonify, url_for

ds = DataStore.get_instance()

serve_dir = "react-ui/build"

app = Flask(__name__, static_folder=f"{serve_dir}/static", template_folder=f"{serve_dir}")


# Allow cors for now in development to let frontend talk from development dir
CORS(app)

log = logquicky.create("hangman-log", level=os.environ.get("LOG_LVL", "INFO"))

# Set the secret key to some random bytes. Keep this really secret!
app.secret_key = os.environ.get("SESSION_SECRET", "ShouldBeSecret")


@app.route("/", methods=["GET"])
def load_ui():
    # Index page of the game.
    return render_template("index.html")


@app.route("/new", methods=["POST"])
def create_game():

    """ Start a new game """

    # Make sure session is clean.
    session.clear()
    game = HangmanGame(game_state={})
    game.start()
    write_game_state_to_session(game)

    return game_status_safe(game), 200, {"Content-Type": "application/json"}


def game_status_safe(game) -> dict:
    """ Takes the game dict and removes unwanted properties from it """

    game_dict = game.as_dict()
    return jsonify(game_dict)


@app.route("/status", methods=["GET"])
def game_status():
    """ Read game status """

    game_state = session.get("game")

    game = HangmanGame(game_state)

    return game_status_safe(game), 200, {"Content-Type": "application/json"}


@app.route("/guess/<string:character>", methods=["POST"])
def guess_character(character):
    """ Make a guess for a character """

    # Whatever the length is, pick the first character as the guess for now.
    character = str(character)
    game_state = session.get("game")

    game = HangmanGame(game_state)
    game.guess(character)

    # Update game progress to session
    write_game_state_to_session(game)

    return game_status_safe(game), 200, {"Content-Type": "application/json"}


@app.route("/highscores", methods=["GET"])
def highscores():
    """ Load top 5 high scores """
    highscores = ds.load_highscores()
    log.debug(highscores)
    return jsonify(highscores)


@app.route("/highscore", methods=["POST"])
def post_highscore():
    """ Save highscore to database. """

    player_name = str(request.json.get("player_name"))

    if session.get("game").status != "HIGHSCORE":
        return jsonify({"msg": "Sorry... this is no highscore."}), 401, {"Content-Type": "application/json"}
    session.get("game").save_as_highscore(player_name)

    # Respond with the new list of highscores.
    highscores = ds.load_highscores()
    return jsonify(highscores)


def write_game_state_to_session(game):
    """ Serializes the game state so that it can be stored. """

    session["game"] = game.as_dict()

    log.debug(f"Wrote session data: {session}")


if __name__ == "__main__":

    app.run(host="0.0.0.0", debug=True)
