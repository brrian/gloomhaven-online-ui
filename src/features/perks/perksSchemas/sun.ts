import { PerksSchema } from '../models';

const sunPerks: PerksSchema = [
  {
    id: 'sun-0',
    text: 'Remove two -1 cards',
    perks: {
      minusOne: -2,
    },
    checks: 2,
  },
  {
    id: 'sun-1',
    text: 'Remove four +0 cards',
    perks: {
      zero: -4,
    },
    checks: 1,
  },
  {
    id: 'sun-2',
    text: 'Replace one -2 card with one +0 card',
    perks: {
      minusTwo: -1,
      zero: 1,
    },
    checks: 1,
  },
  {
    id: 'sun-3',
    text: 'Add two ⟳ +1 cards',
    perks: {
      'plusOne|continue': 2,
    },
    checks: 2,
  },
  {
    id: 'sun-4',
    text: 'Add two ⟳ Heal +1 cards',
    perks: {
      'healOne|continue': 2,
    },
    checks: 2,
  },
  {
    id: 'sun-5',
    text: 'Add one ⟳ STUN card',
    perks: {
      'stun|continue': 1,
    },
    checks: 1,
  },
  {
    id: 'sun-6',
    text: 'Add two ⟳ LIGHT cards',
    perks: {
      'sun|continue': 2,
    },
    checks: 2,
  },
  {
    id: 'sun-7',
    text: 'Add two ⟳ Shield 1, Self cards',
    perks: {
      'shieldOne|continue': 2,
    },
    checks: 1,
  },
  {
    id: 'sun-8',
    text: 'Ignore negative item effects and add two +1 cards',
    perks: {
      plusOne: 2,
    },
    checks: 1,
  },
  {
    id: 'sun-9',
    text: 'Ignore negative scenario effects',
    perks: {},
    checks: 1,
  },
];

export default sunPerks;
