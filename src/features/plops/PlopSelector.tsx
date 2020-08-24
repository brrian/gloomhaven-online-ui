import React, { FC, ChangeEvent, useState, memo } from 'react';
import assets from '../../assets.json';
import { AssetType } from '../session/models';
import { usePlopsStore } from '../../store';

interface PlopSelectorProps {
  className?: string;
  label: string;
  type: AssetType;
}

const PlopSelector: FC<PlopSelectorProps> = ({ className, label, type }) => {
  const { createPlopper } = usePlopsStore();

  const [value, setValue] = useState(assets[type][0].id);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const asset = event.currentTarget.value;

    setValue(asset);
  };

  const handleButtonClick = () => {
    createPlopper(type, value);
  };

  return (
    <div className={className}>
      <select onChange={handleSelectChange} value={value}>
        {assets[type].map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      <button onClick={handleButtonClick}>Create {label}</button>
    </div>
  );
};

export default memo(PlopSelector);
