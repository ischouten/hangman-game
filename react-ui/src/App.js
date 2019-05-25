import React from "react";
import logo from "./logo.svg";
import "./App.css";

const base_url = "http://" + window.location.hostname + ":5000/";

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  checkInput = async (e) => {
    const char = e.key;

    const isValidInput = char.match(/[a-z0-9]/gi);
    console.log(isValidInput);
    if (isValidInput) {
      const request = await fetch(base_url + "guess/" + char, {
        method: "POST"
      });

      const json_response = await request.status;
      this.updateStatus();
      console.log(json_response);
    } else {
      console.log("invalid key");
    }
  };

  startGame = async () => {
    console.log("Starting new game");
    await fetch(base_url + "new", { method: "POST" })
      .then((response) => response.json())
      .then((message) => {
        document.addEventListener("keyup", this.checkInput);
        console.log(message.status);
      })
      .then(() => this.updateStatus());

    // If the game is in progress, then add the eventListener to catch keyboard presses.
  };

  updateStatus = async () => {
    // Function loads the game status
    console.log("Loading status data");
    await fetch(base_url + "status", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then((response) => response.json())
      .then((message) => console.log(message));

    // gameStatus.innerHTML = json_response.game_status;
    // console.log("game status", json_response.status);
    // guessResult.innerHTML = json_response.guess_result;
    // guessedChars.innerHTML = json_response.guessed_chars.split("");
    // attempts.innerHTML = json_response.guessed_chars.length;

    // console.log("Response:", json_response.guess_result);
  };

  finishGame = async () => {
    document.removeEventListener("keyup", this.checkInput);
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Check</p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <div onClick={this.startGame}>StartGame</div>
        </header>
      </div>
    );
  }
}
