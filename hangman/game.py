import random
import re
import logquicky
import time
from hangman.datastore import DataStore

log = logquicky.load("hangman-log")

word_pool = ["3dhubs", "marvin", "print", "filament", "order", "layer"]
max_guesses = 5

ds = DataStore.get_instance()


class HangmanGame:

    """ Game of hangman """

    def __init__(self, game_info=None):
        """ Instantiate a game """

        # Game status info
        self.status: str = "ACTIVE"
        self.solution: str = ""
        self.guess_result: str = ""
        self.guessed_chars = set()

        self.score: int = 0

        # Variables used for calculating highscore
        self.start_time = 0
        self.is_highscore: bool = False

        self.game_hint = ""

    def start(self):
        # New game
        self.game_hint = "Press key to make a guess..."
        self.status = "ACTIVE"
        self.solution = self.select_word()
        self.guess_result = "".join("_" for i in range(len(self.solution)))
        self.guessed_chars = set()
        self.score = 0
        self.start_time = int(time.time())

    def update_game(self, game_info):

        log.debug("Updating game info")
        # Update existing game
        self.solution = game_info.get("solution")
        self.guess_result = game_info.get("guess_result")
        self.guessed_chars = {char for char in game_info.get("guessed_chars", {})}
        self.start_time = game_info.get("start_time")
        self.status = game_info.get("status")
        self.score = game_info.get("score", 0)

    def check_status(self) -> str:

        if self.solution == self.guess_result and self.attempts_remaining():
            # Game is finished! Check for high scores and if it should be saved etc.
            # Score is calculated so that it is higher if you have finished in less attempts and time.

            self.calculate_score()

            self.status = "FINISHED"

            log.info(f"Yup! The word is: {self.solution}")
            log.info(f"Great! You won with {self.attempts_remaining()} attempts remaining. Score: {self.score}")

            highscores = ds.load_highscores()
            if len(highscores) < 5 or self.score > highscores[-1].get("score"):
                # Allows the game to be saved.
                self.status = "HIGHSCORE"

        if len(self.guessed_chars) >= max_guesses:
            self.status = "GAME_OVER"
            self.game_hint = "Press space to start a new game."

        else:
            log.info(f"So far, you discovered: {self.guess_result} and {self.attempts_remaining()} guesses left.")

        return self.status

    def calculate_score(self):
        time_taken = int(time.time()) - int(self.start_time)
        self.score = int(self.attempts_remaining() * 1000 / time_taken)

    def attempts_remaining(self) -> int:
        """ Checks set of invalidly guessed characters and returns max_guesses - length """
        return max_guesses - len(self.guessed_chars)

    def guess(self, character) -> bool:
        """ Make a guess for the solution.  """

        log.debug(f"Incoming guesss for {self.solution}: {character}")

        # Check if the game is still active.
        self.check_status()

        if not self.status == "ACTIVE":
            return False

        if not bool(re.match(r"^[a-z0-9]$", character)):
            self.game_hint = "Please pick a valid character (a-z or 0-9)"
            log.info(self.game_hint)
            return

        if character.lower() in self.guess_result:
            self.game_hint = f"You already tried that one..."
            log.info(self.game_hint)
            return

        # If the character is not in the solution, then it costs an attempt.
        if not character.lower() in self.solution:
            self.guessed_chars.add(character)
            self.game_hint = f"Nope... that's not right."

        elif character.lower() in self.solution:
            # There is a match!

            self.game_hint = f"Nice!"
            # Convert the string to a list so the characters become mutable.
            character_list = list(self.guess_result)

            # Update the character_list by 'uncovering' the character at the matching positions.
            for match in re.finditer(character, self.solution.lower()):

                # First item in the regex span is the character position.
                match_pos = match.span()[0]
                character_list[int(match_pos)] = character

            # Save the character list back to a string for better readability.
            self.guess_result = "".join(character_list)

        log.info(self.game_hint)
        self.check_status()

    def save_as_highscore(self, player_name) -> bool:
        """ Save this game as highscore."""

        if not self.status == "HIGHSCORE":
            return False

        ds.save_highscore(self.solution, self.score, player_name)
        self.game_hint = "Highscore saved!"
        return True

    def select_word(self) -> str:

        """ Picks one of the words in the wordlist, which will be the solution to the game. """
        word_int = random.randint(1, len(word_pool))
        word = word_pool[word_int - 1].lower()

        return word
