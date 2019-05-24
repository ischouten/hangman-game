window.onload = () => {
  startButton = document.getElementById("status-btn");
  startButton.addEventListener("click", startGame);

  gameStatus = document.getElementById("game-status");
  guessedChars = document.getElementById("guessed-chars");
  guessResult = document.getElementById("guess-result");
  attempts = document.getElementById("attempts");
};

const checkInput = async (e) => {
  const char = e.key;

  const isValidInput = char.match(/[a-z0-9]/gi);
  console.log(isValidInput);
  if (isValidInput) {
    const request = await fetch("guess/" + char, { method: "POST" });

    const json_response = await request.status;
    updateStatus();
    console.log(json_response);
  } else {
    console.log("invalid key");
  }
};

const startGame = async () => {
  console.log("Starting new game");
  try {
    const request = await fetch("new", { method: "POST" });
    const json_response = await request.status;
    console.log(json_response);

    // If the game is in progress, then add the eventListener to catch keyboard presses.
    document.addEventListener("keyup", checkInput);

    // Hide the start button
    startButton.style.visibility = "hidden";
    await updateStatus();
  } catch (err) {
    console.log(err);
  }
};

const updateStatus = async () => {
  // Function loads the game status
  console.log("Loading status data");
  const request = await fetch("status");
  const json_response = await request.json();

  // gameStatus.innerHTML = json_response.game_status;
  // console.log("game status", json_response.status);
  guessResult.innerHTML = json_response.guess_result;
  guessedChars.innerHTML = json_response.guessed_chars.split("");
  attempts.innerHTML = json_response.guessed_chars.length;

  console.log("Response:", json_response.guess_result);
};

const finishGame = async () => {
  document.removeEventListener("keyup", checkInput);
};
