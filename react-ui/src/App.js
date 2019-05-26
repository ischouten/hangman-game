import React from "react";
import styled from "styled-components";

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
    await fetch(this.base_url + "new", { method: "POST" })
      .then((response) => response.json())
      .then((json) => {
        // Update state so that the UI updates.
        this.setState(json);
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
      await fetch(this.base_url + "guess/" + char, {
        method: "POST"
      })
        .then((response) => response.json())
        .then((json) => this.setState(json));
    } else {
      this.setState({ game_hint: "Press key a-z or 0-9" });
      console.log("invalid key", char);
    }
    console.log("Current game state:", this.state);
  };

  // Call game status
  checkStatus = async () => {
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

  finishGame = async () => {
    document.removeEventListener("keyup", this.checkInput);
  };

  render() {
    const guesses_left = this.state.guessed_chars
      ? 5 - this.state.guessed_chars.length
      : 5;

    return (
      <HangmanApp>
        <div>Result: {this.state.guess_result}</div>
        <div>{this.state.game_hint}</div>
        <div>
          <p>Tried characters:</p>
          <p>{this.state.guessed_chars}</p>
        </div>
        <div>
          <p>Game status:</p>
          <p>{this.state.status}</p>
        </div>

        {(this.state.status === "FINISHED" ||
          this.state.status === "HIGHSCORE") && (
          <div>Game score: {this.state.score}</div>
        )}

        <div>Guesses left: {guesses_left}</div>
        {/* <div onClick={this.startGame}>New game</div> */}
      </HangmanApp>
    );
  }
}
