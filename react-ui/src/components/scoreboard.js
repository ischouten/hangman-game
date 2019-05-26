import React from "react";
import styled from "styled-components";

const ScoreBoard = styled.div``;

export default (props) => {
  return (
    <ScoreBoard>
      <h2>Highscores</h2>
      {props.highscores &&
        props.highscores.map((entry, index) => {
          return (
            <div key={index}>
              {entry.player_name} - {entry.score}
            </div>
          );
        })}
    </ScoreBoard>
  );
};
