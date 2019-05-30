import React from "react";
import styled from "styled-components";

import Gallow0 from "../static/0.png";
import Gallow1 from "../static/1.png";
import Gallow2 from "../static/2.png";
import Gallow3 from "../static/3.png";
import Gallow4 from "../static/4.png";

const Gallow = styled.img`
  display: visible;
  max-width: 50%;
  height: auto;

  @media screen and (max-height: 400px) {
    display: none;
  }
`;

const Playfield = styled.div`
  h1 {
    max-font-size: 3em;
    font-size: 7vmin;
  }

  div {
    max-font-size: 2em;
    font-size: 4vmin;
  }
`;

const GallowImage = (props) => {
  let gallow_image = Gallow;
  const guesses_left = props.guesses_left;

  switch (guesses_left) {
    case 4:
      gallow_image = Gallow1;
      break;
    case 3:
      gallow_image = Gallow2;
      break;
    case 2:
      gallow_image = Gallow3;
      break;
    case 1:
      gallow_image = Gallow4;
      break;
    default:
      gallow_image = Gallow0;
      break;
  }

  return <Gallow src={gallow_image} alt="Gallow" />;
};

export default (props) => {
  const guesses_left = props.guessed ? 5 - props.guessed.length : 5;

  return (
    <Playfield>
      <h1>{props.result}</h1>
      <div>
        <GallowImage guesses_left={guesses_left} />
        <div>Guesses left: {guesses_left}</div>
        <div>
          <p>Tried: {props.guessed}</p>
        </div>
      </div>
    </Playfield>
  );
};
