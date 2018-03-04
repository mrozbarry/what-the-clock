import { app, h } from 'hyperapp';
import { Route, location } from '@hyperapp/router';

import * as Home from './views/home';
import * as Play from './views/play';
import * as Scores from './views/scores';


const initialState = {
  home: Home.initialState,
  play: Play.initialState,
  scores: Scores.initialState,
  location: location.state,
};

const actions = {
  home: Home.actions,
  play: Play.actions,
  scores: Scores.actions,
  location: location.actions,
};

const view = (state, actions) => (
  <div>
    <h1>What the clock?!?</h1>
    <Route
      path="/"
      render={() =>
        <Home.Root
          state={state.home}
          actions={actions.home}
        />
      }
    />
    <Route
      path="/scores"
      render={() =>
        <Scores.Root
          state={state.scores}
          actions={actions.scores}
        />
      }
    />
    <Route
      path="/play"
      render={() =>
        <Play.Root
          state={state.play}
          actions={actions.play}
          go={actions.location.go}
        />
      }
    />
  </div>
);

const interop = app(initialState, actions, view, document.getElementById('root'));
const unsubscribe = location.subscribe(interop.location);
