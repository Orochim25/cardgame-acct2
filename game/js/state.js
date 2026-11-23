// state.js — the whole game state and the deck / turn machinery.
// One state object; every mutation goes through the small helpers here.

import { CARDS, LANES } from './cards.js';

export const MAX_LIFE = 20;
export const MAX_HAND = 7;
export const MAX_EMBER = 10;

// Tiny seeded RNG (mulberry32) so screenshot states are reproducible.
export function makeRng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(deck, rng) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

let uid = 0;

export function newSide() {
  return { life: MAX_LIFE, deck: [], hand: [], discard: [] };
}

export function newGame(seed) {
  const rng = makeRng(seed ?? ((Date.now() % 100000) + 1));
  const mkDeck = () => shuffle(CARDS.map((c) => ({ ...c, uid: ++uid, bonus: 0 })), rng);
  const state = {
    phase: 'title', // title | play | ai | resolve | won | lost
    turn: 1,
    ember: 1,
    emberMax: 1,
    rng,
    player: newSide(),
    ai: newSide(),
    lanes: LANES.map((l) => ({ ...l, player: [], ai: [] })),
    selected: null, // uid of the selected hand card
    log: [],
    floaters: [], // { text, side, lane, id }
    winners: [null, null, null], // per-lane winner after resolve: 'player' | 'ai' | null
    stats: { played: 0, damageDealt: 0, turns: 0 },
    muted: false,
  };
  state.player.deck = mkDeck();
  state.ai.deck = mkDeck();
  for (let i = 0; i < 5; i++) { drawCard(state, state.player); drawCard(state, state.ai); }
  return state;
}

export function drawCard(state, side) {
  if (side.deck.length === 0) {
    if (side.discard.length === 0) return null;
    side.deck = shuffle(side.discard.splice(0), state.rng);
  }
  if (side.hand.length >= MAX_HAND) { side.discard.push(side.deck.pop()); return null; }
  const card = side.deck.pop();
  side.hand.push(card);
  return card;
}

export function startTurn(state) {
  state.emberMax = Math.min(MAX_EMBER, state.emberMax + 1);
  state.ember = state.emberMax;
  drawCard(state, state.player);
  state.stats.turns = state.turn;
}

export function log(state, text) {
  state.log.unshift(text);
  if (state.log.length > 5) state.log.length = 5;
}
