import React from "react";

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
        placeholder="Enter your name"
      />
      <button onClick={props.postHandler}>Send</button>
    </div>
  );
};
