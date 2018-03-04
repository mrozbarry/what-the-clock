const GUESS_TIME_VALIDATOR = /^([1-2]?[0-9]):([0-5][0-9])$/

export const handleInput = (guessInput, e) => {
  if (e.which >= 48 && e.which <= 57) {
    return guessInput + String.fromCharCode(e.which);
  } else if (e.key === ':') {
    return guessInput + e.key;
  } else if (e.key === 'Backspace') {
    return guessInput.slice(0, -1);
  }

  return guessInput;
}

export const guessInputToTime = (guessInput) => {
  const match = guessInput.match(GUESS_TIME_VALIDATOR);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  return { hour, minute };
}

export const getScoreFromGuess = (correctTime, guessTime) => {
  if (!guessTime) return 0;
  const toMinutes = time => (time.hour * 60) + time.minute;
  const diff = Math.abs(toMinutes(guessTime) - toMinutes(correctTime));
  
  return Math.max(10 - diff, 0);
}
