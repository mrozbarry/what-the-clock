import { h } from 'hyperapp';
import { Link } from '@hyperapp/router';

import Clock from '../components/clock';
import Modal from '../components/modal';

import { handleInput, guessInputToTime, getScoreFromGuess } from '../lib/game';
import { save } from '../lib/scores';

const MS = 1000;
const GAME_PHASES = {
  before: 'before',
  during: 'during',
  after: 'after',
};

const calculateScoreFromHistory = history =>
  history.reduce((score, hist) => score + hist.score, 0);

export const initialState = {
  lastUpdate: null,
  accumulator: (30 * MS),
  correctTime: { hour: 12, minute: 0 },
  guessInput: "",
  history: [],
  handler: null,
  phase: GAME_PHASES.before,
  name: '',
  go: (url) => console.log('TODO:go', url),
  transitioning: false,
};

const generateRandomTime = () => ({
  hour: 1 + Math.floor(Math.random() * 11),
  minute: Math.floor(Math.random() * 59),
});

export const actions = {
  startGame: () => (_, actions) => {
    document.body.addEventListener('keydown', actions.addToGuess, false);

    actions.update(performance.now());

    return {
      phase: 'during',
      correctTime: generateRandomTime(),
    }
  },

  endGame: () => (state, actions) => {
    if (state.handler) {
      cancelAnimationFrame(state.handler);
    }
    document.body.removeEventListener('keydown', actions.addToGuess, false);

    return {
      accumulator: 0,
      handler: null,
      phase: 'after',
    }
  },

  onNameInput: (e) => ({
    name: e.target.value,
  }),

  submitScore: score => state => {
    save(score, state.name);

    setTimeout(() => {
      state.go('/scores');
    }, 1000);

    return {
      transitioning: true,
    }
  },

  addToGuess: e => (state, actions) => {
    if (state.accumulator <= 0) return;

    const guessInput = handleInput(state.guessInput, e);

    if (e.key === 'Enter') {
      const score = getScoreFromGuess(
        state.correctTime,
        guessInputToTime(guessInput),
      );

      return {
        correctTime: generateRandomTime(),
        guessInput: '',
        history: state.history.concat({
          correctTime: state.correctTime,
          guessInput: guessInput,
          score,
        })
      }
    }

    return { guessInput }
  },

  update: now => (state, actions) => {
    const delta = state.lastUpdate === null ? 0 : now - state.lastUpdate;
    const accumulator = state.accumulator - delta;
    let handler = null;

    if (accumulator >= 0) {
      handler = requestAnimationFrame(actions.update);
    } else {
      actions.endGame();
    }

    return {
      accumulator,
      handler,
      lastUpdate: now,
    };
  },

  setup: go => (state, actions) => {
    return { ...initialState, go, correctTime: generateRandomTime() };
  },

  cleanup: () => state => {
    if (state.handler) {
      cancelAnimationFrame(state.handler);
    }

    document.body.removeEventListener('keydown', actions.addToGuess, false);

    return initialState;
  }
};

const timeLeft = accumulator => {
  return Math.max(
    0,
    accumulator
  ).toFixed(2);
}

const NewGameModal = ({ startGame }) => (
  <Modal title="Do you know what time it is?">
    <p>
      You have 30 seconds to beat the clock! Type in the times and press enter to score big or go home.
    </p>
    <button type="button" onclick={startGame}>Go!</button>
  </Modal>
);

const EndGameModal = ({ score, name, onNameInput, submitScore, transitioning }) => (
  <Modal title="Times up!">
    <p>
      You scored {score} points. I've seen better. But if you think it was good, you could submit your score
    </p>
    <form
      action="/scores"
      method="get"
      onsubmit={(e) => {
        e.preventDefault();
        submitScore(score);
        return false;
      }}
      disabled={transitioning}
    >
      <label for="score-name">Enter your name:</label>
      <input id="score-name" type="text" value={name} oninput={onNameInput} required />
      <button type="submit">Submit score</button>
      <br />
      {transitioning
        ? 'Submitting scores...'
        : <Link to="/scores">I'm too ashamed of my score to submit it.</Link>
      }
    </form>
  </Modal>
);

export const Root = ({ state, actions, go }) => {
  const score = calculateScoreFromHistory(state.history);

  return (
    <div
      oncreate={() => actions.setup(go)}
      ondestroy={actions.cleanup}
    >
      <Link to="/">I give up</Link>
      <h2>{timeLeft(state.accumulator)}</h2>
      <h3>
        Score: {score}
      </h3>
      <Clock time={state.correctTime} />
      <h4>{state.guessInput}</h4>
      {state.phase === GAME_PHASES.before && <NewGameModal startGame={actions.startGame} />}
      {state.phase === GAME_PHASES.after &&
        <EndGameModal
          name={state.name}
          score={score}
          onNameInput={actions.onNameInput}
          submitScore={actions.submitScore}
          transitioning={state.transitioning}
        />
      }
    </div>
  );
};
