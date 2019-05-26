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
    };

    // Add the eventListener to catch keyboard presses.
    // Add a little bit of timeout to prevent triggering while loading document.
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

  // Make a guess by capturing keyboard input
  checkInput = async (e) => {
    const char = e.key;

    if (char.match(/[ ]/gi)) {
      this.startGame();
      return;
    }

    if (this.state.status !== "ACTIVE") {
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
            this.setState({ registerHighscore: true });
          }
        });
    } else {
      this.setState({ game_hint: "Press key a-z or 0-9" });
      console.log("invalid key", char);
    }
  };

  // // Call game status
  // checkStatus = async () => {
  //   console.log("Loading status data");
  //   await fetch(this.base_url + "status", {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json"
  //     }
  //   })
  //     .then((response) => response.json())
  //     .then((json) => {
  //       console.log("Json data ", json);
  //       this.setState(json);
  //     });
  // };

  componentWillMount = () => {
    this.loadHighscores();
  };

  finishGame = async () => {
    document.removeEventListener("keyup", this.checkInput);
  };

  render() {
    const guesses_left = this.state.guessed_chars
      ? 5 - this.state.guessed_chars.length
      : 5;

    return (
      <HangmanApp>
        <Header>Hangman</Header>
        <GameHint>{this.state.game_hint}</GameHint>
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

        {this.state.status === "GAME_OVER" && <div>Game over :(</div>}

        {this.state.showScores && (
          <ScoreBoard highscores={this.state.highscores} />
        )}

        {this.state.status === "HIGHSCORE" && (
          <div>
            <h2>Highscore!</h2>
            <div>Score: {this.state.score}</div>
          </div>
        )}

        {(this.state.status === "FINISHED" ||
          this.state.status === "HIGHSCORE") && (
          <div>Game score: {this.state.score}</div>
        )}

        {/* <div onClick={this.startGame}>New game</div> */}
      </HangmanApp>
    );
  }
}
