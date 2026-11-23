// render.js — every pixel of Ember Lanes. Builds the DOM from state, no game logic.
// Screens: title, table, end (win / loss variants). Cards are DOM elements with
// inline-SVG archetype icons, rarity borders and hover enlargement.

import { ARCHETYPES, LANES } from './cards.js';
import { cardPower, laneTotal } from './rules.js';
import { MAX_LIFE } from './state.js';

const ARCH_ICON = {
  flame: '<svg viewBox="0 0 24 24"><path d="M12 2C12 2 5 9 5 14a7 7 0 0 0 14 0C19 9 12 2 12 2Z" fill="#ff6b35"/><path d="M12 8c-2 2.4-3.5 4.2-3.5 6.5a3.5 3.5 0 0 0 7 0C15.5 12.2 14 10.4 12 8Z" fill="#ffd23f"/></svg>',
  ember: '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="6" fill="#ffb347"/><path d="M12 2v4M4 6l3 3M20 6l-3 3" stroke="#ffb347" stroke-width="2" stroke-linecap="round"/></svg>',
  ash: '<svg viewBox="0 0 24 24"><circle cx="8" cy="14" r="3.2" fill="#b8b0a8"/><circle cx="15" cy="10" r="3.8" fill="#d8d0c8"/><circle cx="17" cy="17" r="2.4" fill="#8a8178"/></svg>',
};

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

export function cardHtml(card, opts = {}) {
  const arch = ARCHETYPES[card.arch];
  const laneBonus = opts.laneIdx !== undefined ? cardPower(card, opts.laneIdx, opts.count || 1) : card.power + (card.bonus || 0);
  return `<div class="card arch-${card.arch} rar-${card.rarity}${opts.mini ? ' mini' : ''}${opts.playable ? ' playable' : ''}${opts.selected ? ' selected' : ''}" data-uid="${card.uid}">
    <div class="card-cost">${card.cost}</div>
    <div class="card-icon">${ARCH_ICON[card.arch]}</div>
    <div class="card-name">${esc(card.name)}</div>
    <div class="card-arch">${arch.name}</div>
    <div class="card-text">${esc(card.text)}</div>
    <div class="card-power">${laneBonus}</div>
  </div>`;
}

function lifeBar(life) {
  const pct = Math.max(0, (life / MAX_LIFE) * 100);
  const cls = life <= 6 ? ' low' : life <= 12 ? ' mid' : '';
  return `<div class="lifebar${cls}"><div class="lifefill" style="width:${pct}%"></div><span>${life} / ${MAX_LIFE}</span></div>`;
}

function cardBack(n) {
  let s = '';
  for (let i = 0; i < Math.min(n, 7); i++) s += '<div class="cardback"></div>';
  return `<div class="hand-backs">${s}<span class="backs-count">&times;${n}</span></div>`;
}

export function renderTitle(root) {
  root.innerHTML = `<div class="screen title-screen">
    <div class="ember-glow"></div>
    <div class="wordmark"><span class="wm-ember">EMBER</span> <span class="wm-lanes">LANES</span></div>
    <p class="tagline">Three lanes. One spark. Burn the Warden down.</p>
    <div class="title-cards">${['flame', 'ember', 'ash'].map((a) => `<div class="title-card arch-${a}">${ARCH_ICON[a]}<span>${ARCHETYPES[a].name}</span></div>`).join('')}</div>
    <div class="title-btns">
      <button id="btn-start" class="btn big">START DUEL</button>
      <button id="btn-how" class="btn">HOW TO PLAY</button>
    </div>
    <p class="title-foot">30 cards &middot; 3 lanes &middot; 20 life &middot; best of one spark</p>
  </div>
  <div id="howto" class="overlay hidden"><div class="panel">
    <h2>HOW TO PLAY</h2>
    <ul>
      <li>Each turn you gain ember and draw a card. Play cards with ember.</li>
      <li>Click a card, then click a lane to play it there.</li>
      <li><b>ASH</b>: Flame cards +2 power. <b>CINDER</b>: +1 per friendly card here. <b>SMOKE</b>: playing here draws a card.</li>
      <li>End your turn: each lane's stronger side deals the difference as damage. Hold 2 lanes for +2 breakthrough.</li>
      <li>Reduce the Warden to 0 life to win. Keys: 1-7 select, Enter plays, R restarts, Esc menu, M mute.</li>
    </ul>
    <button id="btn-how-close" class="btn big">GOT IT</button>
  </div></div>`;
}

export function renderTable(root, state) {
  const p = state.player, a = state.ai;
  const turnLabel = state.phase === 'play' ? 'YOUR TURN' : state.phase === 'ai' ? "WARDEN'S TURN" : state.phase === 'resolve' ? 'LANES RESOLVE' : '';
  const lanesHtml = state.lanes.map((lane, i) => {
    const pt = laneTotal(state, i, 'player');
    const at = laneTotal(state, i, 'ai');
    const win = state.winners[i];
    return `<div class="lane${state.selected !== null ? ' picking' : ''}" data-lane="${i}">
      <div class="lane-label"><span class="lane-name">${lane.name}</span><span class="lane-bonus">${lane.bonus}</span></div>
      <div class="lane-board">
        <div class="lane-row ai-row">${lane.ai.map((c) => cardHtml(c, { mini: true, laneIdx: i, count: lane.ai.length })).join('') || '<span class="lane-empty">—</span>'}</div>
        <div class="lane-mid"><span class="lane-total ai-tot${win === 'ai' ? ' won' : ''}">${at}</span><span class="lane-vs">VS</span><span class="lane-total p-tot${win === 'player' ? ' won' : ''}">${pt}</span></div>
        <div class="lane-row p-row">${lane.player.map((c) => cardHtml(c, { mini: true, laneIdx: i, count: lane.player.length })).join('') || '<span class="lane-empty">—</span>'}</div>
      </div>
    </div>`;
  }).join('');

  root.innerHTML = `<div class="screen table-screen">
    <header class="topbar">
      <div class="side-info ai-info">
        <div class="avatar warden">W</div>
        <div><div class="side-name">EMBER WARDEN</div>${lifeBar(a.life)}</div>
        ${cardBack(a.hand.length)}
      </div>
      <div class="turn-box"><div class="turn-label">${turnLabel}</div><div class="turn-num">TURN ${state.turn}</div></div>
      <div class="top-btns">
        <button id="btn-mute" class="btn small">${state.muted ? 'SOUND OFF' : 'SOUND ON'}</button>
        <button id="btn-help" class="btn small">HELP</button>
        <button id="btn-menu" class="btn small">MENU</button>
      </div>
    </header>
    <div class="lanes">${lanesHtml}</div>
    <div class="gamelog">${state.log.length ? esc(state.log[0]) : ''}</div>
    <footer class="bottombar">
      <div class="piles">
        <div class="pile"><span class="pile-num">${p.deck.length}</span><span class="pile-label">DECK</span></div>
        <div class="pile discard"><span class="pile-num">${p.discard.length}</span><span class="pile-label">DISCARD</span></div>
        <div class="ember-box"><span class="ember-label">EMBER</span><span class="ember-pips">${'●'.repeat(state.ember)}<span class="dim">${'○'.repeat(Math.max(0, state.emberMax - state.ember))}</span></span><span class="ember-num">${state.ember}/${state.emberMax}</span></div>
      </div>
      <div class="hand">${p.hand.map((c) => cardHtml(c, { playable: state.phase === 'play' && state.ember >= c.cost, selected: state.selected === c.uid })).join('')}</div>
      <div class="side-info player-info">
        <div class="avatar player-av">YOU</div>
        <div><div class="side-name">SPARKKEEPER</div>${lifeBar(p.life)}</div>
        <button id="btn-end" class="btn big end-turn"${state.phase === 'play' ? '' : ' disabled'}>END TURN</button>
      </div>
    </footer>
    <div id="floaters"></div>
  </div>
  <div id="howto" class="overlay hidden"><div class="panel">
    <h2>HOW TO PLAY</h2>
    <ul>
      <li>Each turn you gain ember and draw a card. Play cards with ember.</li>
      <li>Click a card, then click a lane to play it there.</li>
      <li><b>ASH</b>: Flame cards +2 power. <b>CINDER</b>: +1 per friendly card here. <b>SMOKE</b>: playing here draws a card.</li>
      <li>End your turn: each lane's stronger side deals the difference as damage. Hold 2 lanes for +2 breakthrough.</li>
      <li>Reduce the Warden to 0 life to win. Keys: 1-7 select, Enter plays, R restarts, Esc menu, M mute.</li>
    </ul>
    <button id="btn-how-close" class="btn big">GOT IT</button>
  </div></div>`;
}

export function renderEnd(root, state) {
  const won = state.phase === 'won';
  root.innerHTML = `<div class="screen end-screen ${won ? 'win' : 'loss'}">
    <div class="end-glow"></div>
    <div class="end-title">${won ? 'THE WARDEN FALLS' : 'THE EMBERS DIE'}</div>
    <p class="end-sub">${won ? 'Every lane burns your name. The Sparkkeeper takes the duel.' : 'The Warden keeps the last spark. Your lanes go dark.'}</p>
    <div class="end-stats">
      <div><span>${state.stats.turns}</span><label>TURNS</label></div>
      <div><span>${state.stats.played}</span><label>CARDS PLAYED</label></div>
      <div><span>${state.stats.damageDealt}</span><label>DAMAGE DEALT</label></div>
      <div><span>${state.player.life} — ${state.ai.life}</span><label>LIFE</label></div>
    </div>
    <div class="title-btns">
      <button id="btn-again" class="btn big">${won ? 'PLAY AGAIN' : 'TRY AGAIN'}</button>
      <button id="btn-title" class="btn">TITLE SCREEN</button>
    </div>
  </div>`;
}

export function floater(root, text, who) {
  const box = root.querySelector('#floaters');
  if (!box) return;
  const el = document.createElement('div');
  el.className = 'floater ' + (who === 'ai' ? 'hurt-ai' : 'hurt-player');
  el.textContent = text;
  box.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}

export function shake(root) {
  root.classList.remove('shake');
  void root.offsetWidth;
  root.classList.add('shake');
}
