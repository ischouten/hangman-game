import React from "react";
import styled from "styled-components";
import ScoreBoard from "./components/scoreboard";

const HangmanApp = styled.div`
  display: absolute;
  align-content: center;
  max-width: 600px;
  width: 90vw;
  height: 70vh;
  transform: translateY(15%);
  margin: auto;
  border: solid 1px #cccccc;

  div {
    margin: auto;
    padding: 5px;
    text-align: center;
  }

  input,
  button {
    font-family: inherit;
    font-size: 1em;
  }
`;

const GameHint = styled.div`
  position: absolute;
  bottom: 5%;
  margin: auto;
  width: 100%;
`;

const Header = styled.h1`
  text-align: center;
`;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      game_hint: "Press spacebar to start new game",
      showScores: false,
      showRegisterScore: false,
      player_name: ""
    };

    // Add the eventListener to catch keyboard presses.
    document.addEventListener("keyup", this.checkInput);

    if (process.env.NODE_ENV === "development") {
      this.base_url = "http://" + window.location.hostname + ":5000/";
    } else {
      this.base_url = "/";
    }
  }

  // Start a new game
  startGame = async () => {
    console.log("Starting new game");
    this.setState({ showScores: false });
    await fetch(this.base_url + "new", { method: "POST" })
      .then((response) => response.json())
      .then((json) => {
        // Update state so that the UI updates.
        this.setState(json);
      });
  };

  // Load highscores
  loadHighscores = async () => {
    console.log("Loading highscores");
    await fetch(this.base_url + "highscores")
      .then((response) => response.json())
      .then((json) => {
        this.setState({ highscores: json });
        console.log("Highscores:", json);
      });
  };

  postHighscore = async () => {
    console.log("Posting highscore");
    await fetch(this.base_url + "highscore", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        player_name: this.state.player_name
      })
    })
      .then((response) => response.json())
      .then((json) => {
        // Update state so that the UI updates.
        this.setState({
          highscores: json,
          showScores: true,
          postHighscore: false,
          showRegisterScore: false
        });

        // Re-enable the event listener for accepting space bar for new game.
        document.addEventListener("keyup", this.checkInput);
      });
  };

  // Make a guess by capturing keyboard input
  checkInput = async (e) => {
    const char = e.key;
    console.log(char);

    if (char.match(/[ ]/gi)) {
      this.startGame();
      return;
    }

    if (this.state.status !== "ACTIVE") {
      return;
    }

    if (this.state.status === "ACTIVE" && char === "Escape") {
      // Restart the game while it is running from keyboard.
      this.startGame();
      return;
    }

    const isValidInput = char.match(/[a-z0-9]/gi);
    if (isValidInput) {
      this.setState({
        ...this.state,
        status: "PENDING",
        game_hint: "Checking..."
      });
      await fetch(this.base_url + "guess/" + char, {
        method: "POST"
      })
        .then((response) => response.json())
        .then((json) => {
          this.setState(json);
          console.log(this.state);
          if (json.status === "GAME_OVER" || json.status === "FINISHED") {
            this.setState({ showScores: true });
            console.log(this.state);
          } else if (json.status === "HIGHSCORE") {
            // Clear event listener so that the score can be inputted..
            document.removeEventListener("keyup", this.checkInput);
            this.setState({ showRegisterScore: true });
          }
        });
    } else {
      this.setState({ game_hint: "Press key a-z or 0-9" });
      console.log("invalid key", char);
    }
  };

  //Call game status
  loadStatus = async () => {
    console.log("Loading status data");
    await fetch(this.base_url + "status", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("Json data ", json);
        this.setState(json);
      });
  };

  componentWillMount = () => {
    this.loadStatus();
    this.loadHighscores();
  };

  handlePlayerNameChange = (e) => {
    console.log("Key", e.key);
    if (e.key === "Enter") {
      this.postHighscore();
    }

    this.setState({ player_name: e.target.value });
  };

  render() {
    const guesses_left = this.state.guessed_chars
      ? 5 - this.state.guessed_chars.length
      : 5;

    return (
      <HangmanApp>
        <Header>Hangman</Header>
        {(this.state.status === "ACTIVE" ||
          this.state.status === "PENDING") && (
          <div>
            <h1>{this.state.guess_result}</h1>
            <div>Guesses left: {guesses_left}</div>
            <div>
              <p>Tried characters:</p>
              <p>{this.state.guessed_chars}</p>
            </div>
          </div>
        )}

        {this.state.status === "GAME_OVER" && (
          <div>
            <p>Game over</p>
            <h1>:(</h1>
          </div>
        )}

        {this.state.showScores && (
          <ScoreBoard highscores={this.state.highscores} />
        )}

        {this.state.showRegisterScore && (
          <div>
            <h2>New highscore!</h2>
            <div>Score: {this.state.score}</div>
            <input
              id="playerName"
              type="text"
              value={this.state.player_name}
              onChange={this.handlePlayerNameChange}
              autoFocus
              placeholder="Enter your name"
            />
            <button onClick={this.postHighscore}>Send</button>
          </div>
        )}

        {this.state.status === "FINISHED" && (
          <div>Game score: {this.state.score}</div>
        )}
        <GameHint onClick={this.startGame} autoFocus>
          {this.state.game_hint}
        </GameHint>
      </HangmanApp>
    );
  }
}
