from hangman import app, db
from hangman.models import Highscore


# Create a shell context so that whenever we run `flask shell` we immediately get access to application relevant options.


@app.shell_context_processor
def make_shell_context():
    return {"db": db, "Highscore": Highscore}


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
