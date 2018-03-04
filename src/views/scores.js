import { h } from 'hyperapp';
import { Link } from '@hyperapp/router';
import { load, save } from '../lib/scores';

export const initialState = {
  scores: [],
};

export const actions = {
  loadScores: () => ({ scores: load() }),
};

export const Root = ({ state, actions, setView }) => (
  <div>
    <Link to="/">Back to Main</Link>

    <ol oncreate={actions.loadScores}>
      {state.scores.map(({ name, score }, idx) => (
        <li key={[idx, name, score].join('.')}>
          {score} - {name}
        </li>
      ))}
    </ol>
  </div>
);
