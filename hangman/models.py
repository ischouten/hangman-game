from hangman import db


class Highscore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_name = db.Column(db.String(64))
    score = db.Column(db.Integer, index=True)
    solution = db.Column(db.String(64))

    def __repr__(self):
        return f"<Highscore {self.player_name} - {self.score}>"

    def serialize(self):
        return {"player_name": self.player_name, "score": self.score}
