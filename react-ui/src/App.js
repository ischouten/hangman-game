import React from "react";
import styled from "styled-components";
import ScoreBoard from "./components/scoreboard";
import Gallow1 from "./static/1.png";
import Gallow2 from "./static/2.png";
import Gallow3 from "./static/3.png";
import Gallow4 from "./static/4.png";

const HangmanApp = styled.div`
  display: absolute;
  align-content: center;
  max-width: 600px;
  width: 90vw;
  height: 70vh;
  transform: translateY(15%);
  margin: auto;
  border: solid 1px #cccccc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

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
  position: absolute;
  bottom: -5%;
  margin: auto;
  width: 100%;
  font-size: 0.5em;
`;

const Gallow = styled.img`
  max-width: 50%;
  height: auto;
`;

const Header = styled.h1`
  text-align: center;
`;

const StartButton = styled.button`
  font-family: inherit;
  font-size: 1em;
  align: center;
`;

const InputField = styled.input`
  border: solid 1px #cccccc;
  padding: 10px;
  font-size: 1em;
  font-family: inherit;
  z-index: 1;
`;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      game_hint: "Press spacebar to start new game",
      showScores: false,
      showRegisterScore: false,
      player_name: "",
      char: "",
      lastChar: ""
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
    const char = e ? e.key : this.state.char;

    if (char.match(/[ ]/gi) || char === "Escape") {
      // Space and escape should start a new game
      this.setState({ char: "", lastChar: char });
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

  handleMobileInput = (e) => {
    e.preventDefault();

    let char = e.key;

    const keycode = e.which || e.code;
    if (!char) {
      char = String.fromCharCode(keycode);
    }

    this.setState({ char });
    this.checkInput();
  };

  render() {
    const guesses_left = this.state.guessed_chars
      ? 5 - this.state.guessed_chars.length
      : 5;

    const GallowImage = () => {
      if (this.state.guessed_chars.length == 1) {
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
      <HangmanApp>
        <Header>Hangman</Header>
        {(this.state.status === "ACTIVE" ||
          this.state.status === "PENDING") && (
          <div>
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
        <GameHint onClick={this.startGame} autoFocus>
          {this.state.game_hint}
        </GameHint>
        <Credits>
          By Igor Schouten - Check it out on{" "}
          <a href="https://github.com/ischouten/hangman-game">Github</a>
        </Credits>
        {/* <InputField
          type="text"
          value={this.state.char}
          autoFocus
          onChange={this.checkInput}
        /> */}

        {/* <div>{this.state.lastChar}</div> */}
        {/* <StartButton onClick={this.startGame}>New game</StartButton> */}
      </HangmanApp>
    );
  }
}
