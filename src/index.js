import { app } from 'hyperapp';
import * as Game from './views/game';

const initialState = {
  game: Game.initialState,
  view: "game",
};

const actions = {
  game: Game.actions,
  setView: view => ({ view }),
  newGame: () => {
    return {
      game: game.initialState,
      view: "game",
    }
  },
};

const view = (state, actions) => {
  switch (state.view) {
  default:
    return Game.view({ ...state.game }, { ...actions.game, setView: actions.setView });
  }
};

const interop = app(initialState, actions, view, document.getElementById('root'));


