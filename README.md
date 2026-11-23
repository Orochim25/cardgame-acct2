[![make.fun](https://make.fun/badge/best-card-game-20261122-1826.svg)](https://make.fun/bounty/best-card-game-20261122-1826)
[![rank](https://make.fun/badge/best-card-game-20261122-1826/Orochim25/cardgame-acct2/rank.svg)](https://make.fun/bounty/best-card-game-20261122-1826)
[![reward](https://make.fun/badge/best-card-game-20261122-1826/Orochim25/cardgame-acct2/reward.svg)](https://make.fun/bounty/best-card-game-20261122-1826)

# Ember Lanes

A three-lane card duel against the Ember Warden. Three lanes. One spark. Burn the Warden down.

## Concept

You are the Sparkkeeper. The Ember Warden holds three burning lanes — Ash, Cinder and Smoke — and so do you. Each turn you gain ember and draw a card, then play cards into the lanes. A card's power is shaped by the lane it stands in, so every play is a decision about *where*, not just *what*.

- **ASH lane**: Flame cards +2 power.
- **CINDER lane**: +1 power per friendly card already there.
- **SMOKE lane**: playing a card here draws a card.

At the end of your turn the lanes resolve: the stronger side in a lane deals the difference as damage. Hold two lanes and you break through for +2 more. Both sides have 20 life. First to 0 loses.

30 distinct cards in three archetypes: **Flame** (raw power), **Ember** (lane buffs), **Ash** (draw, heal, tricks). The Warden is a heuristic opponent — it scores every (card, lane) play by damage, lane swing and effect value, never at random.

## How to run

Serve `game/` with any static server (for example `node serve.ts`, then open http://localhost:8080) and play in desktop Chrome. No build step, no network requests, no files outside `game/`.

- Mouse: hover a card to enlarge it, click a card then click a lane to play it.
- Keyboard: `1-7` select a hand card, `Enter` plays it to its best lane, `Esc` menu, `R` restart, `M` mute.
- Sounds are synthesized in code with WebAudio — no audio files. The mute toggle is on the table.

## Rules (short)

1. Turn starts: +1 ember (max 10), draw 1 card (hand max 7).
2. Play as many cards as your ember allows, into any lanes.
3. End turn: the Warden plays, then lanes resolve — lane winner deals the power difference; winning 2+ lanes adds +2 breakthrough damage.
4. Reduce the Warden to 0 life to win. If your life hits 0, the embers die.

## Files

- `game/index.html` — the page; `game/css/style.css` — the whole look.
- `game/js/main.js` — game flow and turn loop; `game/js/state.js` — state, deck, turns.
- `game/js/cards.js` — the 30 cards; `game/js/rules.js` — lane power, play, resolve.
- `game/js/ai.js` — the Warden's heuristic; `game/js/render.js` — all DOM rendering.
- `game/js/input.js` — mouse + keyboard; `game/js/audio.js` — synthesized sounds.
- `main.ts` — copies `game/` + `screenshots/` to the output and writes `dossier.json`.
