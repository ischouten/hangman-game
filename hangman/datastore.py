import sqlite3
import os
import logquicky

log = logquicky.load("hangman-logger")


class DataStore(object):
    __instance = None

    @staticmethod
    def get_instance():
        """ Static access method"""
        if DataStore.__instance is None:
            DataStore()
        return DataStore.__instance

    def __init__(self):
        """ Virtually private constructor. """
        if DataStore.__instance is not None:
            raise Exception("This class is a singleton!")
        else:
            DataStore.__instance = self

            # Creates an empty database if it does not yet exist, or connects to an existing one.
            self.connection = None
            self.cursor = None

            self.db_name = os.path.join("hangman.db")

            if not os.path.isfile(self.db_name):
                log.info(f"Created new database: {self.db_name}")
            else:
                log.info(f"Loading existing database: {self.db_name}")

            try:
                self.connection = sqlite3.connect(self.db_name)
            except sqlite3.OperationalError:
                log.warning(f"Could not create or open a database in {self.db_name}")

            if self.connection:
                self.cursor = self.connection.cursor()

            self.create_new_db()
            log.info(f"Loaded database.")

            self.cursor.execute("PRAGMA table_info(games)")
            self.games_pragma = self.cursor.fetchall()

    def save_highscore(self, solution, score, player_name="Anonymous") -> None:

        log.debug(f"Saving highscore")
        c = self.cursor

        c.execute("INSERT INTO games (solution, score, player_name) VALUES (?, ?, ?)", (solution, score, player_name))
        c.connection.commit()

    def load_highscores(self):
        """ Load the 5 highest scores """
        c = self.cursor

        c.execute("SELECT player_name, score FROM games ORDER BY score DESC LIMIT 5")
        rows = c.fetchall()

        highscores = [{"player_name": row[0], "score": row[1]} for row in rows]

        log.info(f"Loaded highscores: {highscores}")
        return highscores

    ######################
    # HELPERS
    ######################

    def __create_row_dict(self, row: tuple, pragma) -> dict:
        result = {}
        for i, column in enumerate(pragma):
            column_name = column[1]
            result[column_name] = row[i]
        return result

    ######################
    # SETUP
    ######################

    def create_new_db(self) -> None:

        c = self.cursor

        # Create devices table if not exists.
        c.execute(
            "CREATE TABLE IF NOT EXISTS games ("
            "id INTEGER PRIMARY KEY AUTOINCREMENT,"
            "solution TEXT,"
            "score INTEGER,"
            "player_name TEXT"
            ");"
        )
