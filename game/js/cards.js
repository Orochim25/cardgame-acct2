// cards.js — the 30 distinct cards of Ember Lanes.
// Three archetypes: flame (raw power), ember (lane buffs), ash (draw / heal / tricks).
// effect: { type: 'draw' | 'damage' | 'heal' | 'buffLane', value } — applied on play.

export const ARCHETYPES = {
  flame: { name: 'Flame', color: '#ff6b35', desc: 'Raw power. Hits hard.' },
  ember: { name: 'Ember', color: '#ffb347', desc: 'Buffs the lane it joins.' },
  ash: { name: 'Ash', color: '#b8b0a8', desc: 'Draw, heal and tricks.' },
};

export const LANES = [
  { id: 'ash', name: 'ASH', bonus: 'Flame cards +2 power here' },
  { id: 'cinder', name: 'CINDER', bonus: '+1 power per friendly card here' },
  { id: 'smoke', name: 'SMOKE', bonus: 'Playing here draws a card' },
];

// cost = ember, power = base lane power, rarity drives the card frame border.
export const CARDS = [
  // ---- Flame (10) ----
  { id: 'spark-sprite', name: 'Spark Sprite', cost: 1, power: 1, arch: 'flame', rarity: 'common', effect: null, text: 'A first flicker.' },
  { id: 'cinder-imp', name: 'Cinder Imp', cost: 1, power: 2, arch: 'flame', rarity: 'common', effect: null, text: 'Small. Spiteful. Hot.' },
  { id: 'flame-lash', name: 'Flame Lash', cost: 2, power: 4, arch: 'flame', rarity: 'common', effect: null, text: 'A whip of white fire.' },
  { id: 'pyre-hound', name: 'Pyre Hound', cost: 2, power: 3, arch: 'flame', rarity: 'common', effect: { type: 'damage', value: 1 }, text: 'Deal 1 damage.' },
  { id: 'ignite', name: 'Ignite', cost: 2, power: 3, arch: 'flame', rarity: 'rare', effect: { type: 'damage', value: 2 }, text: 'Deal 2 damage.' },
  { id: 'ember-volley', name: 'Ember Volley', cost: 3, power: 5, arch: 'flame', rarity: 'common', effect: null, text: 'A rain of live coals.' },
  { id: 'blaze-knight', name: 'Blaze Knight', cost: 3, power: 5, arch: 'flame', rarity: 'rare', effect: { type: 'damage', value: 1 }, text: 'Deal 1 damage.' },
  { id: 'magma-serpent', name: 'Magma Serpent', cost: 4, power: 7, arch: 'flame', rarity: 'rare', effect: null, text: 'It swims in the deep heat.' },
  { id: 'wildfire', name: 'Wildfire', cost: 5, power: 9, arch: 'flame', rarity: 'epic', effect: null, text: 'Nothing stops it. Nothing.' },
  { id: 'inferno-drake', name: 'Inferno Drake', cost: 6, power: 10, arch: 'flame', rarity: 'epic', effect: { type: 'damage', value: 2 }, text: 'Deal 2 damage.' },
  // ---- Ember (10) ----
  { id: 'kindle-monk', name: 'Kindle Monk', cost: 1, power: 1, arch: 'ember', rarity: 'common', effect: { type: 'buffLane', value: 1 }, text: 'Friendly lane +1 power.' },
  { id: 'coal-keeper', name: 'Coal Keeper', cost: 2, power: 2, arch: 'ember', rarity: 'common', effect: { type: 'buffLane', value: 1 }, text: 'Friendly lane +1 power.' },
  { id: 'ember-smith', name: 'Ember Smith', cost: 2, power: 2, arch: 'ember', rarity: 'rare', effect: { type: 'buffLane', value: 2 }, text: 'Friendly lane +2 power.' },
  { id: 'bellows-twins', name: 'Bellows Twins', cost: 2, power: 3, arch: 'ember', rarity: 'common', effect: { type: 'buffLane', value: 1 }, text: 'Friendly lane +1 power.' },
  { id: 'forge-guard', name: 'Forge Guard', cost: 3, power: 4, arch: 'ember', rarity: 'common', effect: { type: 'buffLane', value: 1 }, text: 'Friendly lane +1 power.' },
  { id: 'hearth-warden', name: 'Hearth Warden', cost: 3, power: 3, arch: 'ember', rarity: 'rare', effect: { type: 'heal', value: 2 }, text: 'Restore 2 life.' },
  { id: 'banked-flame', name: 'Banked Flame', cost: 3, power: 4, arch: 'ember', rarity: 'common', effect: { type: 'heal', value: 2 }, text: 'Restore 2 life.' },
  { id: 'anvil-priest', name: 'Anvil Priest', cost: 4, power: 5, arch: 'ember', rarity: 'rare', effect: { type: 'buffLane', value: 2 }, text: 'Friendly lane +2 power.' },
  { id: 'glow-mother', name: 'Glow Mother', cost: 4, power: 6, arch: 'ember', rarity: 'rare', effect: { type: 'buffLane', value: 2 }, text: 'Friendly lane +2 power.' },
  { id: 'ember-titan', name: 'Ember Titan', cost: 6, power: 8, arch: 'ember', rarity: 'epic', effect: { type: 'buffLane', value: 2 }, text: 'Friendly lane +2 power.' },
  // ---- Ash (10) ----
  { id: 'ash-wisp', name: 'Ash Wisp', cost: 1, power: 1, arch: 'ash', rarity: 'common', effect: { type: 'draw', value: 1 }, text: 'Draw a card.' },
  { id: 'grave-spark', name: 'Grave Spark', cost: 1, power: 2, arch: 'ash', rarity: 'common', effect: null, text: 'It remembers the fire.' },
  { id: 'cinder-sage', name: 'Cinder Sage', cost: 2, power: 2, arch: 'ash', rarity: 'common', effect: { type: 'draw', value: 1 }, text: 'Draw a card.' },
  { id: 'smoke-veil', name: 'Smoke Veil', cost: 2, power: 3, arch: 'ash', rarity: 'common', effect: null, text: 'Hard to see. Harder to hit.' },
  { id: 'mournful-owl', name: 'Mournful Owl', cost: 2, power: 2, arch: 'ash', rarity: 'common', effect: { type: 'heal', value: 3 }, text: 'Restore 3 life.' },
  { id: 'dust-devil', name: 'Dust Devil', cost: 3, power: 4, arch: 'ash', rarity: 'common', effect: { type: 'draw', value: 1 }, text: 'Draw a card.' },
  { id: 'silent-cinder', name: 'Silent Cinder', cost: 3, power: 4, arch: 'ash', rarity: 'common', effect: null, text: 'It burns without a sound.' },
  { id: 'pale-herald', name: 'Pale Herald', cost: 4, power: 5, arch: 'ash', rarity: 'rare', effect: { type: 'draw', value: 1 }, text: 'Draw a card.' },
  { id: 'ashen-phoenix', name: 'Ashen Phoenix', cost: 5, power: 7, arch: 'ash', rarity: 'epic', effect: { type: 'draw', value: 1 }, text: 'Draw a card.' },
  { id: 'last-ember', name: 'Last Ember', cost: 6, power: 8, arch: 'ash', rarity: 'epic', effect: { type: 'heal', value: 4 }, text: 'Restore 4 life.' },
];

export const CARD_BY_ID = Object.fromEntries(CARDS.map((c) => [c.id, c]));
