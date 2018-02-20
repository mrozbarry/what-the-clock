import { h } from 'hyperapp';

/*
 * 15 seconds
 * Guess as many clock-times as possible
 * Awarded 10 points for exact time, and minus 1 point for every minute off
 *
 *
 *   /-----------\
 *   |     |     |
 *   |     |/    |
 *   |     .     |
 *   |           |
 *   |           |
 *   \-----------/
 */

const MS = 1000;

export const initialState = {
  lastUpdate: null,
  accumulator: (30 * MS),
  correctTime: { hour: 4, minute: 15 },
  guessInput: "",
  history: [],
  handler: null,
};

export const actions = {
  generateTime: () => ({
    correctTime: {
      hour: 1 + Math.floor(Math.random() * 11),
      minute: Math.floor(Math.random() * 59),
    },
    guessInput: "",
  }),

  addToGuess: e => (state, actions) => {
    if (state.accumulator <= 0) return;

    let { guessInput } = state;

    if (e.which >= 48 && e.which <= 57) {
      guessInput = state.guessInput + String.fromCharCode(e.which);
    } else if (e.key === ':') {
      guessInput = state.guessInput + ':';
    } else if (e.key === 'Backspace') {
      guessInput = guessInput.slice(0, -1);
    } else if (e.key === 'Enter') {
      const parser = /^([1-2]?[0-9]):([0-5][0-9])$/
      const match = guessInput.match(parser);
      let score = 0;
      if (match) {
        const hour = Number(match[1]);
        const minute = match[2] === '00' ? 0 : Number(match[2].replace(/^0/g, ''));

        const correctTime = (state.correctTime.hour * 60) + state.correctTime.minute;
        const guessTime = (hour * 60) + minute

        score = Math.max(10 - (correctTime - guessTime), 0);
      }

      actions.generateTime();

      return {
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
    const delta = state.lastUpdate === null ? 0 : now - state.lastUpdate
    const accumulator = state.accumulator - delta;
    let handler = null;

    if (accumulator >= 0) {
      handler = requestAnimationFrame(actions.update);
    }

    return {
      accumulator,
      handler,
      lastUpdate: now,
    };
  },

  setup: () => (state, actions) => {
    actions.generateTime();
    actions.update(0);

    document.body.addEventListener('keydown', actions.addToGuess, false);

    return {
      guessInput: "",
    }
  },

  cleanup: () => state => {
    if (state.handler) {
      cancelAnimationFrame(state.handler);
    }

    document.body.removeEventListener('keydown', actions.addToGuess, false);

    return { handler: null };
  }
};

const timeLeft = accumulator => {
  return Math.max(
    0,
    accumulator
  ).toFixed(2);
}

export const view = (state, actions) => (
  <div
    oncreate={() => actions.setup()}
    ondestroy={() => actions.cleanup()}
  >
    <h1>{timeLeft(state.accumulator)}</h1>
    <h2>
      Score: {state.history.reduce((score, hist) => score + hist.score, 0)}
    </h2>
    <svg width="400" height="400">
      <circle
        cx="200"
        cy="200"
        r="195"
        style={{
          stroke: 'black',
          strokeWidth: '5px',
          fill: 'white',
        }}
      />
      {'x'.repeat(12).split('').map((_, idx) => {
        return (
          <line
            x1="200"
            y1="20"
            x2="200"
            y2="30"
            transform={`rotate(${idx * 360 / 12} 200 200)`}
            style={{ stroke: 'black', strokeWidth: '1px' }}
          />
        );
      })}
      <line
        x1="200"
        y1="200"
        x2="200"
        y2="20"
        transform={`rotate(${state.correctTime.minute * 360 / 60} 200 200)`}
        style={{ stroke: 'black', strokeWidth: '10px' }}
      />
      <line
        x1="200"
        y1="200"
        x2="200"
        y2="100"
        transform={`rotate(${state.correctTime.hour * 360 / 12} 200 200)`}
        style={{ stroke: 'red', strokeWidth: '5px' }}
      />

    </svg>
    <h1>{state.guessInput}</h1>
  </div>
);
