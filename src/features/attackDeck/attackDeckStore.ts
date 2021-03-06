import { random, shuffle } from 'lodash-es';
import { decorate, observable } from 'mobx';
import { Perks } from '../perks/models';
import perksSchemas from '../perks/perksSchemas';

interface DeckCounts {
  [key: string]: number;
}

const DEFAULT_DECK: DeckCounts = {
  crit: 1,
  minusOne: 5,
  minusTwo: 1,
  miss: 1,
  plusOne: 5,
  plusTwo: 1,
  zero: 6,
};

export default class AttackDeckStore {
  public blessings = 0;

  public curses = 0;

  public deck: string[] = [];

  public shouldShuffle = false;

  public used: string[] = [];

  private perks: DeckCounts = {};

  public constructor() {
    const savedDeckItem = localStorage.getItem('attackDeck');
    if (savedDeckItem) {
      const savedDeck = JSON.parse(savedDeckItem);

      this.blessings = savedDeck.blessings ?? 0;
      this.curses = savedDeck.curses ?? 0;
      this.deck = savedDeck.deck ?? [];
      this.shouldShuffle = savedDeck.shouldShuffle ?? false;
      this.used = savedDeck.used ?? [];
    }

    const perksItem = localStorage.getItem('perks');
    if (perksItem) {
      const perks = JSON.parse(perksItem);
      this.buildPerks(perks);
    }

    if (this.deck.length === 0) {
      this.buildDeck();
    }
  }

  public addBless = (): void => {
    this.addScenarioEffect('bless');

    this.blessings += 1;

    this.saveDeck();
  };

  public addCurse = (): void => {
    this.addScenarioEffect('curse');

    this.curses += 1;

    this.saveDeck();
  };

  public draw = (): string => {
    if (this.deck.length === 0) {
      this.deck = shuffle([...this.used]);
      this.used = [];
    }

    const cardKey = this.deck.shift();

    if (!cardKey) {
      throw new Error('Unable to get card key');
    }

    if (cardKey === 'scenario-bless') {
      this.blessings -= 1;
    } else if (cardKey === 'scenario-curse') {
      this.curses -= 1;
    } else {
      this.used.push(cardKey);
    }

    if (!this.shouldShuffle) {
      this.shouldShuffle = ['crit', 'miss'].includes(cardKey);
    }

    this.saveDeck();

    return cardKey;
  };

  public reset = (): void => {
    this.buildDeck();

    this.blessings = 0;
    this.curses = 0;

    this.shouldShuffle = false;

    this.saveDeck();
  };

  public shuffle = (): void => {
    this.deck = shuffle([...this.deck, ...this.used]);
    this.used = [];

    this.shouldShuffle = false;

    this.saveDeck();
  };

  private addScenarioEffect = (effect: string): void => {
    const index = random(0, this.deck.length - 1);

    this.deck.splice(index, 0, `scenario-${effect}`);
  };

  private buildDeck = (): void => {
    const deck: string[] = [];

    const deckCounts = { ...DEFAULT_DECK };

    for (const [key, count] of Object.entries(this.perks)) {
      const prevCount = deckCounts[key] ?? 0;

      deckCounts[key] = Math.max(0, prevCount + count);
    }

    for (const [key, count] of Object.entries(deckCounts)) {
      // Turns plusOne: 2 into ['plusOne', 'plusOne']
      const keys = [...Array(count)].map(() => key);

      deck.push(...keys);
    }

    this.deck = shuffle(deck);
    this.used = [];

    this.saveDeck();
  };

  private buildPerks = (perks: Perks): void => {
    const perksSchema = perksSchemas[perks.class];

    for (const [id, checks] of Object.entries(perks.perks)) {
      const perksSet = perksSchema.find(set => set.id === id);

      if (!perksSet) {
        throw new Error(`Unable to to find perks matching ${id}`);
      }

      // Repeat for however many checks we have
      for (let index = 0; index < checks; index++) {
        for (const [card, count] of Object.entries(perksSet.perks)) {
          if (!this.perks[card]) {
            this.perks[card] = 0;
          }

          this.perks[card] += count;
        }
      }
    }
  };

  private saveDeck = () => {
    localStorage.setItem(
      'attackDeck',
      JSON.stringify({
        blessings: this.blessings,
        curses: this.curses,
        deck: this.deck,
        shouldShuffle: this.shouldShuffle,
        used: this.used,
      })
    );
  };
}

decorate(AttackDeckStore, {
  blessings: observable,
  curses: observable,
  deck: observable,
  shouldShuffle: observable,
  used: observable,
});
