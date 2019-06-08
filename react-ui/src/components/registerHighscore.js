import React from "react";

// const inputField = document.getElementById("playerName");

export default (props) => {
  return (
    <div>
      <h2>New highscore!</h2>
      <div>Score: {props.score}</div>
      <input
        id="playerName"
        type="text"
        value={props.player_name}
        onChange={props.playerNameHandle}
        autoFocus
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            return props.postHandler();
          }
        }}
        placeholder="Enter your name"
      />
      <button onClick={props.postHandler}>Send</button>
    </div>
  );
};
