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

        self.finished = False

        if game_info:
            log.debug("Loading game info from session.")
            self.solution = game_info.get("solution")
            self.guess_result = game_info.get("guess_result")
        else:
            log.info("Starting game...")
            self.solution = self.select_word()
            log.debug(f"Solution: {self.solution}")
            self.guess_result = "".join("_" for i in range(len(self.solution)))

            # Keep time so we can use the game duration for calculating the high score.
            self.start_time = int(time.time())
            # To store wrongly guessed characters here.
            self.guessed_chars = set()
            log.info(f"Start guessing what {self.guess_result} is.")

        # This will be the representation of the guessed solution so far.

    def attempts_remaining(self) -> int:
        # Checks set of invalidly guessed characters and returns max_guesses - length
        return max_guesses - len(self.guessed_chars)

    def guess(self, character) -> bool:
        """ Make a guess for the solution.  """

        log.debug(f"Incoming guesss for {self.solution}: {character}")
        if not bool(re.match(r"^[a-z0-9]$", character)):
            log.info("Please pick a valid character (a-z or 0-9)")
            return False

        # If the character is not in the solution, then it costs an attempt.
        if not character.lower() in self.solution:
            self.guessed_chars.add(character)
            log.info(f"Uh oh... you have {self.attempts_remaining()} attempts left.")
            return False

        # The character is in the guess result.
        log.info(f"Nice guess!")

        # Convert the string to a list so the characters become mutable.
        character_list = list(self.guess_result)

        # Update the character_list by 'uncovering' the character at the matching positions.
        for match in re.finditer(character, self.solution.lower()):

            # First item in the regex span is the character position.
            match_pos = match.span()[0]
            character_list[int(match_pos)] = character

        # Save the character list back to a string for better readability.
        self.guess_result = "".join(character_list)

        if self.guess_result == self.solution:
            # Game is finished! Check for high scores and if it should be saved etc.
            self.finished = True
            # Score is calculated so that it is higher if you have finished in less attempts and time.
            time_taken = int(time.time()) - int(self.start_time)
            self.score = int(self.attempts_remaining() * 1000 / time_taken)

            highscores = ds.load_highscores()
            log.debug(highscores)
            if len(highscores) < 5 or self.score > highscores[-1].get("score"):
                # This is in the top 5 high scores so lets allow the player to save his score.
                # TODO: This does not work with web app.
                player_name = str(input("Player name?"))
                ds.save_highscore(self.solution, self.score, player_name)

            log.info(f"Yup! The word is: {self.solution}")
            log.info(f"Great! You won with {self.attempts_remaining()} attempts remaining. Score: {self.score}")
        else:
            log.info(f"So far, you discovered: {self.guess_result} and {self.attempts_remaining()} guesses left.")

        return True

    def select_word(self) -> str:

        """ Picks one of the words in the wordlist, which will be the solution to the game. """
        word_int = random.randint(1, len(word_pool))
        word = word_pool[word_int - 1].lower()

        return word
