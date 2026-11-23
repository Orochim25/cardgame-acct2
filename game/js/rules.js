// rules.js — lane power, card play, lane resolution. No DOM here.

import { drawCard } from './state.js';

// Power of one card instance in a lane, with the lane's bonus applied.
export function cardPower(card, laneIdx, friendlyCount) {
  let p = card.power + (card.bonus || 0);
  if (laneIdx === 0 && card.arch === 'flame') p += 2; // Ash lane: Flame +2
  if (laneIdx === 1) p += Math.max(0, friendlyCount - 1); // Cinder: +1 per other friendly card
  return p;
}

export function laneTotal(state, laneIdx, who) {
  const lane = state.lanes[laneIdx];
  const cards = lane[who];
  return cards.reduce((s, c) => s + cardPower(c, laneIdx, cards.length), 0);
}

// Can this card be played right now?
export function canPlay(state, card) {
  return state.phase === 'play' && state.ember >= card.cost;
}

// Apply a card's on-play effect. Returns a short description for the log.
export function applyEffect(state, who, card, laneIdx) {
  const e = card.effect;
  const me = state[who];
  const foe = state[who === 'player' ? 'ai' : 'player'];
  if (!e) return '';
  if (e.type === 'draw') {
    for (let i = 0; i < e.value; i++) draw1(state, me);
    return `draws ${e.value}`;
  }
  if (e.type === 'damage') {
    foe.life = Math.max(0, foe.life - e.value);
    return `deals ${e.value} damage`;
  }
  if (e.type === 'heal') {
    me.life = Math.min(20, me.life + e.value);
    return `restores ${e.value} life`;
  }
  if (e.type === 'buffLane') {
    for (const c of state.lanes[laneIdx][who]) c.bonus = (c.bonus || 0) + e.value;
    return `lane +${e.value} power`;
  }
  return '';
}

function draw1(state, side) { drawCard(state, side); }

// Play a hand card into a lane. Returns true on success.
export function playCard(state, who, cardUid, laneIdx) {
  const me = state[who];
  const idx = me.hand.findIndex((c) => c.uid === cardUid);
  if (idx < 0) return false;
  const card = me.hand[idx];
  if (who === 'player' && !canPlay(state, card)) return false;
  if (who === 'ai' && state.ember < card.cost) return false;
  me.hand.splice(idx, 1);
  me.discard.push(card);
  state.ember -= card.cost;
  state.lanes[laneIdx][who].push(card);
  if (laneIdx === 2) draw1(state, me); // Smoke lane: playing here draws a card
  const note = applyEffect(state, who, card, laneIdx);
  if (who === 'player') state.stats.played++;
  return { card, note };
}

// Resolve all three lanes at end of turn. Returns { damageToAi, damageToPlayer, wins }.
export function resolveLanes(state) {
  let toAi = 0, toPlayer = 0, winsP = 0, winsA = 0;
  state.winners = [null, null, null];
  for (let i = 0; i < 3; i++) {
    const p = laneTotal(state, i, 'player');
    const a = laneTotal(state, i, 'ai');
    if (p > a) { toAi += p - a; winsP++; state.winners[i] = 'player'; }
    else if (a > p) { toPlayer += a - p; winsA++; state.winners[i] = 'ai'; }
  }
  if (winsP >= 2) toAi += 2; // breakthrough: hold two lanes, +2
  if (winsA >= 2) toPlayer += 2;
  state.ai.life = Math.max(0, state.ai.life - toAi);
  state.player.life = Math.max(0, state.player.life - toPlayer);
  state.stats.damageDealt += toAi;
  return { damageToAi: toAi, damageToPlayer: toPlayer, winsP, winsA };
}

export function checkEnd(state) {
  if (state.ai.life <= 0) { state.phase = 'won'; return 'won'; }
  if (state.player.life <= 0) { state.phase = 'lost'; return 'lost'; }
  return null;
}
