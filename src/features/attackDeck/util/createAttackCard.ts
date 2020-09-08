import { AttackCard, AttackCardKey } from '../models';
import { kebabCase } from 'lodash-es';

interface Backgrounds {
  [key: string]: string | undefined;
}

const BACKGROUNDS: Backgrounds = {
  'add-target': 'red',
  'minus-one': 'soft-red',
  'minus-two': 'soft-red',
  'pierce-three': 'gray',
  'plus-four': 'soft-green',
  'plus-one': 'soft-green',
  'plus-three': 'soft-green',
  'plus-two': 'soft-green',
  'pull-one': 'gray',
  'pull-two': 'gray',
  'push-one': 'gray',
  'push-two': 'gray',
  'shield-one': 'brown',
  crit: 'soft-purple',
  curse: 'purple',
  dark: 'gray',
  disarm: 'blue',
  fire: 'red',
  ice: 'blue',
  immobilize: 'brown',
  invisible: 'gray',
  leaf: 'green',
  muddle: 'brown',
  poison: 'green',
  refresh: 'red',
  stun: 'blue',
  sun: 'orange',
  wind: 'blue',
  wound: 'orange',
};

export default function createAttackCard(
  key?: AttackCardKey
): AttackCard | undefined {
  if (!key) {
    return;
  }

  const [first, second, third] = key.split('|').map(item => kebabCase(item));

  const showContinue = [second, third].includes('continue');

  const secondary = second !== 'continue' ? second : undefined;

  const background = BACKGROUNDS[`${secondary}`] ?? BACKGROUNDS[first];

  return {
    background,
    main: first,
    secondary,
    showContinue,
  };
}
