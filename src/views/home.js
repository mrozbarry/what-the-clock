import { h } from 'hyperapp';
import { Link } from '@hyperapp/router';
import trackUrl from '../assets/looperman-l-0265632-0120176-weazelbeats-fire-arcade-stylized-trap-drums.wav';

export const initialState = {};

export const actions = {};

export const Root = ({ loadTrack, startTrack, stopTrack }) => 
  <ol
    oncreate={() => {
      loadTrack(trackUrl)
        .then(() => {
          startTrack(trackUrl);
        });
    }}
    ondestroy={() => {
      stopTrack(trackUrl);
    }}
  >
    <li>
      <Link to="/play">New Game</Link>
    </li>
    <li>
      <Link to="/scores">View Scores</Link>
    </li>
    <li>
      <Link to="/credits">Credits</Link>
    </li>
  </ol>;
