export const load = () => {
  const scores = localStorage.getItem('scores')
  return scores
    ? JSON.parse(scores).sort((a, b) => Math.sign(b.score - a.score))
    : [];
}

export const save = (score, name) => {
  const scores = load()
    .concat({ name, score });

  localStorage.setItem('scores', JSON.stringify(scores));
}
