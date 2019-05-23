#!/usr/bin/env python3
import os
import logquicky
from hangman.game import HangmanGame
from flask import Flask, session, redirect, url_for, escape, request, render_template, jsonify

app = Flask(__name__)

log = logquicky.create("hangman-log", level=os.environ.get("LOG_LVL", "INFO"))

# Set the secret key to some random bytes. Keep this really secret!
app.secret_key = os.environ.get("SESSION_SECRET", "ShouldBeSecret")

# The game info is stored in session object.
game = HangmanGame(game_info=session)


@app.route("/", methods=["GET"])
def load_ui():
    # Index page of the game.

    log.debug(f"Solution: {session.get('solution')}")
    log.info(f"Guessed result: {session.get('guess_result')}")

    # TODO: Render nices GUI
    return render_template("index.html", game_data=session)


@app.route("/status", methods=["GET"])
def game_status():
    # Index page of the game.

    log.debug(f"Testword: {session.get('solution')}")
    log.info(f"Guessed result: {session.get('guess_result')}")

    guessed_chars = ",".join(game.guessed_chars)

    return (
        jsonify({"guess_result": session.get("guess_result"), "guessed_chars": guessed_chars}),
        200,
        {"Content-Type": "application/json"},
    )


@app.route("/new", methods=["POST"])
def create_game():
    """ Start a new game """

    # Make sure session is clean.
    session.clear()

    # Store info from this game into sessino object.
    session["guess_result"] = game.guess_result
    session["solution"] = game.solution
    session["guessed_chars"] = ""

    # TODO: Return game status
    return "", 200, {"Content-Type": "application/json"}


@app.route("/guess/<string:character>", methods=["POST"])
def guess_character(character):
    """ Make a guess for a character """

    # Whatever the length is, pick the first character as the guess for now.
    character = str(character)
    log.debug(f"Guess character {character}")
    game.guess(character)

    # Update session
    session["guess_result"] = game.guess_result
    session["guessed_chars"] = ",".join(game.guessed_chars)

    # TODO: Return game status
    return "", 200, {"Content-Type": "application/json"}


if __name__ == "__main__":

    app.run(host="0.0.0.0", debug=True)
