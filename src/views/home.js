import { h } from 'hyperapp';
import { Link } from '@hyperapp/router';
import trackUrl from '../assets/looperman-l-0265632-0120176-weazelbeats-fire-arcade-stylized-trap-drums.wav';
import './home.styl';

const debug = (...text) => value => {
  console.log(...text, value);
  return value;
};

export const initialState = {
  menu: [
    { name: 'New Game', linkTo: '/play' },
    { name: 'View Scores', linkTo: '/scores' },
    { name: 'Credits', linkTo: '/credits' },
  ],
  activeMenuIndex: 0,
  go: () => {},
};

export const actions = {
  create: ({ go, loadTrack, startTrack }) => (state, actions) => {
    loadTrack(trackUrl)
      .then(() => {
        startTrack(trackUrl);
      });

    document.body.addEventListener('keydown', actions.keypress, false);

    return { go };
  },

  destroy: ({ stopTrack }) => (_, actions) => {
    stopTrack(trackUrl);
    document.body.removeEventListener('keydown', actions.keypress);
  },

  keypress: e => state => {
    if (e.key === 'Enter') {
      state.go(state.menu[state.activeMenuIndex].linkTo);
      return;
    }

    const clampIndex = idx => Math.max(Math.min(idx, state.menu.length - 1), 0)
    const indexChange = e.key === 'ArrowUp'
      ? -1
      : e.key === 'ArrowDown'
      ? 1
      : 0;

    const activeMenuIndex = clampIndex(state.activeMenuIndex + indexChange);

    return { activeMenuIndex };
  },

  setActiveMenuIndex: activeMenuIndex => ({ activeMenuIndex }),
};

export const Root = ({ state, actions, go, loadTrack, startTrack, stopTrack }) => 
  <ol
    class="home-menu"
    oncreate={() => actions.create({ go, loadTrack, startTrack })}
    ondestroy={() => actions.destroy({ stopTrack })}
  >
    {state.menu.map((item, idx) => (
      <li
        key={item.name}
        class={
          ["home-menu__item"]
          .concat(state.activeMenuIndex === idx ? 'home-menu__item--active' : [])
          .join(' ')
        }
      >
        <Link
          class="home-menu__item-link"
          to={item.linkTo}
          onfocus={() => actions.setActiveMenuIndex(idx)}
          onmousemove={() => actions.setActiveMenuIndex(idx)}
        >
          {item.name}
        </Link>
      </li>
    ))}
  </ol>;
