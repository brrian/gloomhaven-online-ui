import { PerksSchema } from '../models';

const circlesPerks: PerksSchema = [
  {
    id: 'circles-0',
    text: 'Remove two -1 cards',
    perks: {
      minusOne: -2,
    },
    checks: 1,
  },
  {
    id: 'circles-1',
    text: 'Replace one -2 card with one +0 card',
    perks: {
      minusTwo: -1,
      zero: 1,
    },
    checks: 1,
  },
  {
    id: 'circles-2',
    text: 'Replace one -1 card with one +1 card',
    perks: {
      minusOne: -1,
      plusOne: 1,
    },
    checks: 3,
  },
  {
    id: 'circles-3',
    text: 'Add one +2 card',
    perks: {
      plusTwo: 1,
    },
    checks: 2,
  },
  {
    id: 'circles-4',
    text: 'Add two ⟳ WOUND cards',
    perks: {
      'wound|continue': 2,
    },
    checks: 1,
  },
  {
    id: 'circles-5',
    text: 'Add two ⟳ POISON cards',
    perks: {
      'poison|continue': 2,
    },
    checks: 1,
  },
  {
    id: 'circles-6',
    text: 'Add two ⟳ Heal +1 cards',
    perks: {
      'healOne|continue': 1,
    },
    checks: 3,
  },
  {
    id: 'circles-7',
    text: 'Add one ⟳ FIRE and one ⟳ WIND',
    perks: {
      'fire|continue': 1,
      'wind|continue': 1,
    },
    checks: 1,
  },
  {
    id: 'circles-8',
    text: 'Add one ⟳ DARK and one ⟳ LEAF',
    perks: {
      'dark|continue': 1,
      'leaf|continue': 1,
    },
    checks: 1,
  },
  {
    id: 'circles-9',
    text: 'Ignore negative scenario effects and add two +1 cards',
    perks: {
      plusOne: 2,
    },
    checks: 1,
  },
];

export default circlesPerks;
