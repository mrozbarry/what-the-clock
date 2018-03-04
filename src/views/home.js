import { h } from 'hyperapp';
import { Link } from '@hyperapp/router';

export const initialState = {};

export const actions = {};

export const Root = () => 
  <ol>
    <li>
      <Link to="/play">New Game</Link>
    </li>
    <li>
      <Link to="/scores">View Scores</Link>
    </li>
  </ol>;
