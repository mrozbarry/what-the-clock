import test from 'ava';
import { getScoreFromGuess } from './game';

test('when correct and guess time are equal, 10pts', ava => {
  const time = { hour: 1, minute: 20 };
  ava.is(getScoreFromGuess(time, time), 10);
});

test('when guess is one minute early, 9pts', ava => {
  const correct = { hour: 1, minute: 20 };
  const guess = { hour: 1, minute: 19 };
  ava.is(getScoreFromGuess(correct, guess), 9);
});

test('when guess is one minute late, 9pts', ava => {
  const correct = { hour: 1, minute: 20 };
  const guess = { hour: 1, minute: 21 };
  ava.is(getScoreFromGuess(correct, guess), 9);
});

test('when guess is eleven minutes late, 0pts', ava => {
  const correct = { hour: 1, minute: 20 };
  const guess = { hour: 1, minute: 31 };
  ava.is(getScoreFromGuess(correct, guess), 0);
});


test('when guess is null, 0pts', ava => {
  const correct = { hour: 1, minute: 20 };
  ava.is(getScoreFromGuess(correct, null), 0);
});
