import React, { ChangeEvent, FC, useMemo } from 'react';
import useLocalStorageState from '../../hooks/useLocalStorageState';
import perksSchemas from './perksSchemas';
import styles from './Perks.module.scss';
import { Perks as IPerks } from './models';
import { startCase } from 'lodash-es';

const DEFAULT_PERKS: IPerks = {
  class: Object.keys(perksSchemas)[0],
  perks: {},
};

const Perks: FC = () => {
  const [perks, setPerks] = useLocalStorageState<IPerks>(
    'perks',
    DEFAULT_PERKS
  );

  const perksSchema = useMemo(() => perksSchemas[perks.class], [perks.class]);

  const handleClassChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPerks({
      class: event.currentTarget.value,
      perks: {},
    });
  };

  const handleCheckmarkChange = (
    event: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const clonedPerks = { ...perks.perks };

    let perk = clonedPerks[id] ?? 0;

    perk += event.currentTarget.checked ? 1 : -1;

    if (perk > 0) {
      clonedPerks[id] = perk;
    } else {
      delete clonedPerks[id];
    }

    localStorage.removeItem('attackDeck');

    setPerks(prevStoredPerks => ({
      ...prevStoredPerks,
      perks: clonedPerks,
    }));
  };

  return (
    <div className={styles.perks}>
      <h4 className={styles.heading}>
        <span>Perks</span>
        <select onChange={handleClassChange} value={perks.class}>
          {Object.keys(perksSchemas).map(classType => (
            <option key={classType} value={classType}>
              {startCase(classType)}
            </option>
          ))}
        </select>
      </h4>
      {perksSchema.map(perk => (
        <div className={styles.perk} key={perk.id}>
          {[...Array(perk.checks)].map((_count, index) => (
            <input
              key={`${perk.id}-check-${index}`}
              type="checkbox"
              checked={perks.perks[perk.id] >= index + 1}
              onChange={event => handleCheckmarkChange(event, perk.id)}
            />
          ))}
          <span className={styles.text}>{perk.text}</span>
        </div>
      ))}
    </div>
  );
};

export default Perks;
