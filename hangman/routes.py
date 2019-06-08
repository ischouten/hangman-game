#!/usr/bin/env python3
import logquicky
from hangman import app
from hangman.game import HangmanGame
from hangman.models import Highscore
from flask import session, request, render_template, jsonify

log = logquicky.load("hangman-log")


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


@app.route("/status", methods=["GET"])
def game_status():
    """ Read game status """

    game_state = session.get("game", {})

    game = HangmanGame(game_state)

    return game_status_safe(game), 200, {"Content-Type": "application/json"}


@app.route("/guess/<string:character>", methods=["POST"])
def guess_character(character):
    """ Make a guess for a character """

    # Whatever the length is, pick the first character as the guess for now.
    character = str(character)
    game_state = session.get("game", {})

    log.debug(f"Game before checking guess: {game_state}")

    game = HangmanGame(game_state)
    game.guess(character)

    # Update game progress to session
    write_game_state_to_session(game)

    return game_status_safe(game), 200, {"Content-Type": "application/json"}


@app.route("/highscores", methods=["GET"])
def highscores():
    """ Load top 5 high scores """

    # Respond with the new list of highscores.
    game = HangmanGame({})
    highscores = game.get_highscores()

    return jsonify(highscores)


@app.route("/highscore", methods=["POST"])
def post_highscore():
    """ Save highscore to database. """

    player_name = str(request.json.get("player_name"))

    if session.get("game").get("status") != "HIGHSCORE":
        return jsonify({"msg": "Sorry... this is no highscore."}), 401, {"Content-Type": "application/json"}

    game_state = session.get("game")
    game = HangmanGame(game_state)
    game.save_as_highscore(player_name)

    # Game state was highscore, but will change now..
    write_game_state_to_session(game)

    # Respond with the new list of highscores.
    game = HangmanGame({})
    highscores = game.get_highscores()

    return jsonify(highscores)


def write_game_state_to_session(game):
    """ Serializes the game state so that it can be stored. """

    session["game"] = game.as_dict()

    log.debug(f"Wrote session data: {session}")


def game_status_safe(game) -> dict:
    """ Takes the game dict and removes unwanted properties from it """

    game_dict = game.as_dict()
    del game_dict["solution"]

    return jsonify(game_dict)
