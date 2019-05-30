import React from "react";
import styled from "styled-components";
import ScoreBoard from "./components/scoreboard";
import Gallow1 from "./static/1.png";
import Gallow2 from "./static/2.png";
import Gallow3 from "./static/3.png";
import Gallow4 from "./static/4.png";

const Screen = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Game = styled.div`
  border: solid 1px #cccccc;
  max-width: 700px;
  height: 600px;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

const GameHint = styled.div`
  margin: auto;
  width: 100%;
`;

const Credits = styled.div`
  width: 100%;
  text-align: center;
  font-size: 0.5em;
`;

const Gallow = styled.img`
  max-width: 50%;
  height: auto;
`;

const Header = styled.h1`
  text-align: center;
`;

const DirectInputField = styled.input`
  color: transparent;
  z-index: 1;
  outline: none;
  border: none;
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

  changeFocus = () => {
    // Reset focus to open the mobile keyboard.
    document.getElementById("directInputField").focus();
  };

  // Start a new game
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

  // Load highscores
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

        // Re-enable the event listener for accepting space bar for new game.
        document.addEventListener("keyup", this.checkInput);
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

    console.log("Char in checkInput:", char);

    if (char.match(/[ ]/gi) || char === "Escape") {
      // Space and escape should start a new game
      this.startGame();
      return;
    }

    if (this.state.status !== "ACTIVE") {
      // If we're not restarting the game, but enter keys, don't do anything.
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
        method: "POST",
        credentials: "include"
      })
        .then((response) => response.json())
        .then((json) => {
          this.setState(json);
          if (json.status === "GAME_OVER" || json.status === "FINISHED") {
            this.setState({ showScores: true });
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
    if (e.key === "Enter") {
      this.postHighscore();
    }

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
    const guesses_left = this.state.guessed_chars
      ? 5 - this.state.guessed_chars.length
      : 5;

    const GallowImage = () => {
      if (this.state.guessed_chars.length === 1) {
        return <Gallow src={Gallow1} alt="Gallow" />;
      } else if (this.state.guessed_chars.length === 2) {
        return <Gallow src={Gallow2} alt="Gallow" />;
      } else if (this.state.guessed_chars.length === 3) {
        return <Gallow src={Gallow3} alt="Gallow" />;
      } else if (this.state.guessed_chars.length === 4) {
        return <Gallow src={Gallow4} alt="Gallow" />;
      }
      return null;
    };

    return (
      <Screen>
        <Game>
          <Header>Hangman</Header>
          <GameHint onClick={this.startGame}>{this.state.game_hint}</GameHint>
          <DirectInputField
            id="directInputField"
            type="text"
            autoFocus
            defaultValue=""
            onChange={this.checkDirectInput}
          />
          {(this.state.status === "ACTIVE" ||
            this.state.status === "PENDING") && (
            <div onClick={this.changeFocus}>
              <h1>{this.state.guess_result}</h1>
              <GallowImage />
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
        </Game>
        <Credits>
          By Igor Schouten - Check it out on{" "}
          <a href="https://github.com/ischouten/hangman-game">Github</a>
        </Credits>
      </Screen>
    );
  }
}
