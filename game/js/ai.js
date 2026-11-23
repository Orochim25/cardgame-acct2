// ai.js — the Ember Warden. A heuristic opponent, never random:
// every (card, lane) play is scored by damage, lane swing and effect value.

import { cardPower, laneTotal } from './rules.js';

function effectValue(card) {
  const e = card.effect;
  if (!e) return 0;
  if (e.type === 'draw') return 1.6 * e.value;
  if (e.type === 'damage') return 1.5 * e.value;
  if (e.type === 'heal') return 1.0 * e.value;
  if (e.type === 'buffLane') return 1.4 * e.value;
  return 0;
}

// Score one candidate play from the AI's point of view.
export function scorePlay(state, card, laneIdx) {
  const lane = state.lanes[laneIdx];
  const beforeP = laneTotal(state, laneIdx, 'player');
  const beforeA = laneTotal(state, laneIdx, 'ai');
  const myCount = lane.ai.length + 1;
  const power = cardPower(card, laneIdx, myCount);
  let score = power * 1.0 + effectValue(card) - card.cost * 0.2;
  const afterA = beforeA + power + (card.effect && card.effect.type === 'buffLane' ? card.effect.value * lane.ai.length : 0);
  if (beforeA <= beforeP && afterA > beforeP) score += 3.0; // flips the lane
  else if (afterA > beforeA && beforeA > beforeP) score += 1.0; // extends a win
  if (laneIdx === 2) score += 0.8; // Smoke draws a card
  return score;
}

// Pick the AI's plays for its turn: greedy best-first, at most 3 cards.
export function choosePlays(state) {
  const plays = [];
  let ember = state.ember;
  const hand = [...state.ai.hand];
  for (let n = 0; n < 3; n++) {
    let best = null, bestScore = 1.5; // below this, the AI holds its cards
    for (const card of hand) {
      if (card.cost > ember) continue;
      for (let lane = 0; lane < 3; lane++) {
        const s = scorePlay(state, card, lane);
        if (s > bestScore) { bestScore = s; best = { card, lane }; }
      }
    }
    if (!best) break;
    plays.push(best);
    hand.splice(hand.indexOf(best.card), 1);
    ember -= best.card.cost;
  }
  return plays;
}
