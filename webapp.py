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

# The game info is stored in session object.

game = HangmanGame()


@app.route("/", methods=["GET"])
def load_ui():
    # Index page of the game.
    return render_template("index.html")


@app.route("/new", methods=["POST"])
def create_game():
    """ Start a new game """

    # Make sure session is clean.
    global game
    game.start()
    session.clear()

    # Store info from this game into sessino object.
    write_game_state_to_session()

    return (serialize_status(), 200, {"Content-Type": "application/json"})


@app.route("/status", methods=["GET"])
def game_status():
    # Index page of the game.
    write_game_state_to_session()
    return (serialize_status(), 200, {"Content-Type": "application/json"})


@app.route("/highscores", methods=["GET"])
def highscores():
    """ Load top 5 high scores """
    highscores = ds.load_highscores()

    return jsonify(highscores)


@app.route("/highscore", methods=["POST"])
def post_highscore():
    """ Save highscore to database. """

    player_name = str(request.json.get("player_name"))

    if game.status != "HIGHSCORE":
        return jsonify({"msg": "Sorry... this is no highscore."}), 401, {"Content-Type": "application/json"}
    game.save_as_highscore(player_name)

    # Respond with the new list of highscores.
    highscores = ds.load_highscores()
    return jsonify(highscores)


@app.route("/guess/<string:character>", methods=["POST"])
def guess_character(character):
    """ Make a guess for a character """

    log.debug(f"App secret {app.secret_key}")
    # Whatever the length is, pick the first character as the guess for now.
    character = str(character)

    game.guess(character)

    # Update session
    write_game_state_to_session()

    return serialize_status(), 200, {"Content-Type": "application/json"}


def write_game_state_to_session():

    log.debug("Updating session information")
    session["status"] = game.status
    session["guess_result"] = game.guess_result
    session["guessed_chars"] = "".join(game.guessed_chars)
    session["score"] = game.score
    session["start_time"] = game.start_time
    session["game_hint"] = game.game_hint


def serialize_status():
    status = jsonify(
        {
            "status": session.get("status"),
            "guess_result": session.get("guess_result"),
            "guessed_chars": session.get("guessed_chars"),
            "score": session.get("score", 0),
            "start_time": session.get("start_time"),
            "game_hint": session.get("game_hint"),
        }
    )

    return status


if __name__ == "__main__":

    app.run(host="0.0.0.0", debug=True)
