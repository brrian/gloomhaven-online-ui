import React, { ChangeEvent, FC, memo, useState } from 'react';
import assets from '../../assets.json';
import { usePlopsStore } from '../../store';

interface MonsterPlopSelectorProps {
  className?: string;
}

const MonsterPlopSelector: FC<MonsterPlopSelectorProps> = ({ className }) => {
  const { createPlopper } = usePlopsStore();

  const [assetId, setAssetId] = useState(assets.monsters[0].id);
  const [level, setLevel] = useState('normal');

  const handleAssetIdChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setAssetId(event.currentTarget.value);
  };

  const handleLevelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLevel(event.currentTarget.value);
  };

  const handleButtonClick = () => {
    createPlopper('monsters', assetId, {
      meta: {
        monsterlevel: level,
      },
    });
  };

  return (
    <div className={className}>
      <select onChange={handleAssetIdChange} value={assetId}>
        {assets.monsters.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      <select onChange={handleLevelChange} value={level}>
        <option value="normal">Normal</option>
        <option value="elite">Elite</option>
      </select>
      <button onClick={handleButtonClick}>Create monster</button>
    </div>
  );
};

export default memo(MonsterPlopSelector);
