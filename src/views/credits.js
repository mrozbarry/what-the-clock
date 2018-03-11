import { h } from 'hyperapp';
import { Link } from '@hyperapp/router';
import trackUrl from '../assets/looperman-l-0265632-0120176-weazelbeats-fire-arcade-stylized-trap-drums.wav';


export const initialState = {
  credits: [
    {
      name: 'Alex Barry',
      job: 'Developer',
      link: 'https://mrbarry.com/',
    },
    {
      name: 'WeazelBeats',
      job: 'Author of Fire Arcade - Stylized Trap Drums',
      link: 'https://www.looperman.com/loops/detail/120176/fire-arcade-stylized-trap-drums-by-weazelbeats-free-150bpm-trap-drum-loop',
    },
    {
      name: 'Bluecollar',
      job: 'Author of Drumstepping',
      link: 'https://www.looperman.com/loops/detail/87468/drumstepping-by-bluecollar-free-170bpm-drum-and-bass-drum-loop',
    },
  ],
};

export const actions = {};

export const Root = ({ loadTrack, startTrack, stopTrack, state }) => (
  <div
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
    <Link to="/">Back to Main</Link>

    <ul>
      {state.credits.map(credit => (
        <li key={[credit.name, credit.job].join(' ').replace(/ /g, '-')}>
          <a href={credit.link} target="_blank" rel="nofollow">{credit.name}</a> - {credit.job}.
        </li>
      ))}
    </ul>
  </div>
);
