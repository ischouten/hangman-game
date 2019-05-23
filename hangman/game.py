import random
import re
import logquicky

log = logquicky.load("hangman-log")

word_pool = ["testword"]
max_guesses = 5


class HangmanGame:

    """ Game of hangman """

    def __init__(self):
        """ Instantiate a game """

        self.solution = self.select_word()
        self.finished = False

        # This will be the representation of the guessed solution so far.
        self.guess_result = "".join("_" for i in range(len(self.solution)))

        # Keep the guessed characters that were wrong here.
        self.guessed_chars = set()

        log.info("Starting game...")
        log.info(f"Start guessing what {self.guess_result} is.")

    def attempts_remaining(self) -> int:
        # Checks set of invalidly guessed characters and returns max_guesses - length
        return max_guesses - len(self.guessed_chars)

    def guess(self, character) -> bool:
        """ Make a guess for the solution.  """

        if not bool(re.match(r"^[a-z]$", character)):
            log.info("Please pick a valid character (a-z)")
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
            self.finished = True
            log.info(f"Yup! The word is: {self.solution}")
            log.info(f"Great! You won with {self.attempts_remaining()} attempts remaining.")
        else:
            log.info(f"So far, you discovered: {self.guess_result} and {self.attempts_remaining()} guesses left.")

        return True

    def select_word(self) -> str:

        """ Picks one of the words in the wordlist, which will be the solution to the game. """
        word_int = random.randint(1, len(word_pool))
        word = word_pool[word_int - 1].lower()

        return word
