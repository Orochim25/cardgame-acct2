// input.js — mouse and keyboard. Click a card, then click a lane. Keys: 1-7 select,
// Enter plays to the best lane, Esc menu, R restart, M mute.

import { scorePlay } from './ai.js';

export function bindTable(root, state, actions) {
  root.querySelectorAll('.hand .card').forEach((el) => {
    el.addEventListener('click', () => actions.selectCard(Number(el.dataset.uid)));
  });
  root.querySelectorAll('.lane').forEach((el) => {
    el.addEventListener('click', () => actions.playToLane(Number(el.dataset.lane)));
  });
  const end = root.querySelector('#btn-end');
  if (end) end.addEventListener('click', () => actions.endTurn());
  const mute = root.querySelector('#btn-mute');
  if (mute) mute.addEventListener('click', () => actions.toggleMute());
  const help = root.querySelector('#btn-help');
  if (help) help.addEventListener('click', () => actions.showHelp());
  const menu = root.querySelector('#btn-menu');
  if (menu) menu.addEventListener('click', () => actions.toTitle());
  const close = root.querySelector('#btn-how-close');
  if (close) close.addEventListener('click', () => actions.hideHelp());
}

export function bindTitle(root, actions) {
  const s = root.querySelector('#btn-start');
  if (s) s.addEventListener('click', () => actions.start());
  const h = root.querySelector('#btn-how');
  if (h) h.addEventListener('click', () => actions.showHelp());
  const c = root.querySelector('#btn-how-close');
  if (c) c.addEventListener('click', () => actions.hideHelp());
}

export function bindEnd(root, actions) {
  const a = root.querySelector('#btn-again');
  if (a) a.addEventListener('click', () => actions.start());
  const t = root.querySelector('#btn-title');
  if (t) t.addEventListener('click', () => actions.toTitle());
}

export function bindKeys(actions, getState) {
  document.addEventListener('keydown', (e) => {
    const state = getState();
    if (!state) return;
    if (e.key === 'm' || e.key === 'M') { actions.toggleMute(); return; }
    if (e.key === 'r' || e.key === 'R') { actions.start(); return; }
    if (e.key === 'Escape') {
      if (state.phase === 'title') { actions.hideHelp(); return; }
      actions.toTitle(); return;
    }
    if (state.phase !== 'play') return;
    if (e.key >= '1' && e.key <= '7') {
      const card = state.player.hand[Number(e.key) - 1];
      if (card) actions.selectCard(card.uid);
      return;
    }
    if (e.key === 'Enter' && state.selected !== null) {
      const card = state.player.hand.find((c) => c.uid === state.selected);
      if (!card) return;
      let best = 0, bestScore = -1e9;
      for (let lane = 0; lane < 3; lane++) {
        const s = scorePlay(state, card, lane);
        if (s > bestScore) { bestScore = s; best = lane; }
      }
      actions.playToLane(best);
    }
  });
}
