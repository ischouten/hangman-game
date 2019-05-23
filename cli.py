#!/usr/bin/env python3
import os
import logquicky
from hangman.game import HangmanGame

log = logquicky.create("hangman-log", level=os.environ.get("LOG_LVL", "INFO"))

game = HangmanGame()

while game.attempts_remaining() > 0 and not game.finished:
    character = input("Pick a character (a-z): ")
    game.guess(character)

log.info(f"Game finished")
