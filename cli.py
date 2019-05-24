#!/usr/bin/env python3
import os
import logquicky
from hangman.game import HangmanGame

log = logquicky.create("hangman-log", level=os.environ.get("LOG_LVL", "INFO"))

game = HangmanGame()

while game.attempts_remaining() > 0 and game.status == "ACTIVE":
    log.debug(game.status)
    character = input("Pick a character (a-z): ")
    game.guess(character)

if game.is_highscore:
    player_name = input("Type your name to register your score: ")
    game.save_as_highscore(player_name)

log.info(f"Game finished")
