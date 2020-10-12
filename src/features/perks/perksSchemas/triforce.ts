import { PerksSchema } from '../models';

const triforcePerks: PerksSchema = [
  {
    id: 'triforce-0',
    text: 'Remove two -1 cards',
    perks: {
      minusOne: -2,
    },
    checks: 2,
  },
  {
    id: 'triforce-1',
    text: 'Replace one -1 card with one +1 card',
    perks: {
      minusOne: -1,
      plusOne: 1,
    },
    checks: 1,
  },
  {
    id: 'triforce-2',
    text: 'Replace one +0 card with one +2 card',
    perks: {
      zero: -1,
      plusTwo: 2,
    },
    checks: 2,
  },
  {
    id: 'triforce-3',
    text: 'Add three +0 FIRE cards',
    perks: {
      'zero|fire': 3,
    },
    checks: 1,
  },
  {
    id: 'triforce-4',
    text: 'Add three +0 ICE cards',
    perks: {
      'zero|ice': 3,
    },
    checks: 1,
  },
  {
    id: 'triforce-5',
    text: 'Add three +0 WIND cards',
    perks: {
      'zero|wind': 3,
    },
    checks: 1,
  },
  {
    id: 'triforce-6',
    text: 'Add three +0 LEAF cards',
    perks: {
      'zero|leaf': 3,
    },
    checks: 1,
  },
  {
    id: 'triforce-7',
    text: 'Replace two +0 cards with one +0 FIRE and one +0 LEAF card',
    perks: {
      zero: -2,
      'zero|fire': 1,
      'zero|leaf': 1,
    },
    checks: 1,
  },
  {
    id: 'triforce-8',
    text: 'Replace two +0 cards with one +0 ICE and one +0 WIND card',
    perks: {
      zero: -2,
      'zero|ice': 1,
      'zero|wind': 1,
    },
    checks: 1,
  },
  {
    id: 'triforce-9',
    text: 'Add two +1 PUSH 1 cards',
    perks: {
      'plusOne|pushOne': 2,
    },
    checks: 1,
  },
  {
    id: 'triforce-10',
    text: 'Add one +1 WOUND cards',
    perks: {
      'plusOne|wound': 1,
    },
    checks: 1,
  },
  {
    id: 'triforce-11',
    text: 'Add one +0 STUN card',
    perks: {
      'zero|stun': 1,
    },
    checks: 1,
  },
  {
    id: 'triforce-12',
    text: 'Add one +0 ADD TARGET card',
    perks: {
      'plusOne|addTarget': 1,
    },
    checks: 1,
  },
];

export default triforcePerks;
