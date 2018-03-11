import { app, h } from 'hyperapp';
import { Route, location } from '@hyperapp/router';

import * as Home from './views/home';
import * as Play from './views/play';
import * as Scores from './views/scores';
import * as Credits from './views/credits';

const newAudioContext = (params) => new (window.AudioContext || window.webkitAudioContext)(params);

const initialState = {
  home: Home.initialState,
  play: Play.initialState,
  scores: Scores.initialState,
  credits: Credits.initialState,
  location: location.state,
  audio: newAudioContext({
    latencyHint: 'balanced',
  }),
  tracks: {},
};

const loadTrackFromUrl = audio => url => {
  const source = audio.createBufferSource();

  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(data => {
      return new Promise((resolve, reject) => {
        audio.decodeAudioData(data, resolve, reject);
      });
    })
    .then(buffer => {
      source.buffer = buffer;
      source.connect(audio.destination);
      source.loop = true;

      return {
        source,
        isPlaying: false,
      };
    });
}

const actions = {
  home: Home.actions,
  play: Play.actions,
  scores: Scores.actions,
  credits: Credits.actions,
  location: location.actions,
  loadTrack: url => (state, actions) => {
    if (state.tracks[url]) {
      return Promise.resolve(state.tracks[url]);
    }

    return loadTrackFromUrl(state.audio)(url)
      .then(track => {
        track.source.start(0);
        actions.addTrack({ url, track });
        return track;
      });
  },
  addTrack: ({ url, track }) => state => ({
    tracks: { ...state.tracks, [url]: track },
  }),
  startTrack: url => (state, actions) => {
    actions.loadTrack(url)
      .then(track => {
        if (track.isPlaying) return;
        actions.updateTrack({ url, isPlaying: true });
        track.source.connect(state.audio.destination);
      });
  },
  stopTrack: url => (state, actions) => {
    const track = state.tracks[url];
    if (track && track.isPlaying) {
      actions.updateTrack({ url, isPlaying: false });
      track.source.disconnect(state.audio.destination);
    }
  },
  updateTrack: ({ url, isPlaying }) => state => ({
    tracks: { ...state.tracks, [url]: { ...state.tracks[url], isPlaying } },
  }),
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
          loadTrack={actions.loadTrack}
          startTrack={actions.startTrack}
          stopTrack={actions.stopTrack}
        />
      }
    />
    <Route
      path="/scores"
      render={() =>
        <Scores.Root
          state={state.scores}
          actions={actions.scores}
          loadTrack={actions.loadTrack}
          startTrack={actions.startTrack}
          stopTrack={actions.stopTrack}
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
          loadTrack={actions.loadTrack}
          startTrack={actions.startTrack}
          stopTrack={actions.stopTrack}
        />
      }
    />
    <Route
      path="/credits"
      render={() =>
        <Credits.Root
          state={state.credits}
          actions={actions.credits}
          go={actions.location.go}
          loadTrack={actions.loadTrack}
          startTrack={actions.startTrack}
          stopTrack={actions.stopTrack}
        />
      }
    />
  </div>
);

const interop = app(initialState, actions, view, document.getElementById('root'));
const unsubscribe = location.subscribe(interop.location);
