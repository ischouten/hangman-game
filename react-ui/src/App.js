import React from "react";
import styled from "styled-components";

const HangmanApp = styled.div`
  min-width: 600px;
  width: 50vw;
  height: 70vh;
  transform: translateY(15%);
  margin: auto;
  border: solid 1px #ff00ff;
`;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { guess_result: "?" };

    if (process.env.NODE_ENV === "development") {
      this.base_url = "http://" + window.location.hostname + ":5000/";
    } else {
      this.base_url = "/";
    }
  }

  checkInput = async (e) => {
    const char = e.key;

    const isValidInput = char.match(/[a-z0-9]/gi);
    console.log(isValidInput);
    if (isValidInput) {
      const request = await fetch(this.base_url + "guess/" + char, {
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
    await fetch(this.base_url + "new", { method: "POST" })
      .then((response) => response.json())
      .then((message) => {
        // If the game is in progress, then add the eventListener to catch keyboard presses.
        document.addEventListener("keyup", this.checkInput);
        console.log(message.status);
      })
      .then(() => this.updateStatus());
  };

  updateStatus = async () => {
    // Function loads the game status
    console.log("Loading status data");
    await fetch(this.base_url + "status", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then((response) => response.json())
      .then((message) => {
        console.log(message.guess_result);
        this.setState({ guess_result: message.guess_result });
      });
  };

  finishGame = async () => {
    document.removeEventListener("keyup", this.checkInput);
  };

  render() {
    return (
      <HangmanApp>
        <div>Result: {this.state.guess_result}</div>
        <div onClick={this.startGame}>New game</div>
      </HangmanApp>
    );
  }
}
