import React from "react";
import styled from "styled-components";
import ScoreBoard from "./components/scoreboard";
import PlayField from "./components/playfield";
import GameOver from "./components/gameover";
import RegisterHighscore from "./components/registerHighscore";

const Screen = styled.div`
  width: 100vw;
  height: calc(var(--vh, 1vh) * 100);
  min-height: -webkit-fill-available;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Game = styled.div`
  max-width: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;

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

const Header = styled.h1`
  text-align: center;

  @media screen and (max-height: 400px) {
    display: none;
  }
`;

const GameHint = styled.div`
  margin: auto;
  width: 100%;
  cursor: pointer;
  font-size: 1em;
`;

const Credits = styled.div`
  width: 100%;
  text-align: center;
  font-size: 0.5em;
  position: absolute;
  margin: auto;
  bottom: 5px;

  @media screen and (max-height: 400px) {
    display: none;
  }
`;

const DirectInputField = styled.input`
  color: transparent;
  z-index: 1;
  outline: none;
  border: none;
`;

// Listens for resizing of the viewport triggers a repaint of the screen. (i.e. showing/hiding the mobile keyboard.)
window.addEventListener("resize", () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      game_hint: "Click to start new game",
      showScores: false,
      showRegisterScore: false,
      player_name: ""
    };

    // Add the eventListener to catch keyboard presses.
    document.addEventListener("keyup", this.checkInput);

    // Append the port to base_url if this is running in development mode.
    if (process.env.NODE_ENV === "development") {
      this.base_url = "http://" + window.location.hostname + ":5000/";
    } else {
      this.base_url = "/";
    }
  }

  changeFocus = () => {
    // Reset focus to open the mobile keyboard.
    try {
      document.getElementById("directInputField").focus();
    } catch (err) {
      console.log("No direct input field");
    }
  };

  startGame = async () => {
    console.log("Starting new game");

    // Set focus to the input field (necessary for mobile keyboards.)
    this.changeFocus();

    this.setState({ showScores: false });
    await fetch(this.base_url + "new", {
      method: "POST",
      credentials: "include"
    })
      .then((response) => response.json())
      .then((json) => {
        // Update state so that the UI updates.
        this.setState(json);
      });
  };

  loadHighscores = async () => {
    console.log("Loading highscores");
    await fetch(this.base_url + "highscores", { credentials: "include" })
      .then((response) => response.json())
      .then((json) => {
        this.setState({ highscores: json });
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
      }),
      credentials: "include"
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
      })
      .then(() => {
        // Re-enable the event listener for accepting space bar for new game.
        document.addEventListener("keyup", this.checkInput);

        // Refresh status of the game.
        this.loadStatus();
      });
  };

  // Make a guess by capturing keyboard input
  checkInput = async (e) => {
    let char = e ? e.key : null;

    if (char === "Unidentified") {
      // Mobile keyboards send 'Unidentified' keyboard events.
      // Ignore these and use the simulated event sent from the checkDirectInput method.
      return;
    }

    // Space and escape should start a new game
    if (char.match(/[ ]/gi) || char === "Escape") {
      this.startGame();
      return;
    }

    if (this.state.status !== "ACTIVE") {
      // If we're not restarting the game, but enter keys, don't do anything.
      return;
    }

    // Allow only characters a-z and 0-9, and in that case, check if they are a match for the word we are looking for.
    if (char.match(/[a-zA-Z0-9]/gi)) {
      this.setState({
        ...this.state,
        status: "PENDING",
        game_hint: "Checking..."
      });
      await fetch(this.base_url + "guess/" + char.toLowerCase(), {
        method: "POST",
        credentials: "include"
      })
        .then((response) => response.json())
        .then((json) => {
          this.setState(json);
          // TODO: This is not pretty.

          if (json.status !== "ACTIVE") {
            this.setState({ showScores: true });

            if (json.status === "HIGHSCORE") {
              // Clear event listener so that the score can be inputted..
              document.removeEventListener("keyup", this.checkInput);
              this.setState({ showRegisterScore: true, showScores: false });
            }
          }
        });
    } else {
      this.setState({ game_hint: "Press key a-z or 0-9" });
      console.log("invalid key", char);
    }
  };

  //Call game status
  loadStatus = async () => {
    await fetch(this.base_url + "status", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      credentials: "include"
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState(json);
      });
  };

  componentWillMount = () => {
    this.loadStatus();
    this.loadHighscores();
  };

  handlePlayerNameChange = (e) => {
    this.setState({ player_name: e.target.value });
  };

  checkDirectInput = (e) => {
    e.preventDefault();

    console.log("Event from direct input", e.target.value);
    const char = { key: e.target.value };

    // Reset the formfield so that it is empty again.
    e.target.value = "";
    this.checkInput(char);
  };

  render() {
    return (
      <Screen>
        <Header>Hangman</Header>
        <Game>
          <GameHint onClick={this.startGame}>{this.state.game_hint}</GameHint>
          {(this.state.status === "ACTIVE" ||
            this.state.status === "PENDING") && (
            <div>
              <DirectInputField
                id="directInputField"
                type="text"
                autoFocus
                defaultValue=""
                onChange={this.checkDirectInput}
              />
              <PlayField
                onClick={this.changeFocus}
                result={this.state.guess_result}
                guessed={this.state.guessed_chars}
              />
            </div>
          )}

          {this.state.status === "GAME_OVER" && <GameOver />}

          {this.state.showRegisterScore && (
            <RegisterHighscore
              score={this.state.score}
              playerNameHandle={this.handlePlayerNameChange}
              postHandler={this.postHighscore}
            />
          )}

          {this.state.showScores && (
            <ScoreBoard highscores={this.state.highscores} />
          )}

          {this.state.status === "FINISHED" && (
            <div>Game score: {this.state.score}</div>
          )}
        </Game>
        <Credits>
          By Igor Schouten - Check it out on{" "}
          <a href="https://github.com/ischouten/hangman-game">Github</a>
        </Credits>
      </Screen>
    );
  }
}
