import { Textarea, Textbox } from 'components';
import React, { useEffect, useState } from 'react';

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData,
}) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    updateMyData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (id === 'movement') {
    return (
      <Textbox
        type="number"
        min="0"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    );
  } else if (id === 'comment') {
    return <Textarea value={value} onChange={onChange} onBlur={onBlur} />;
  }
};

export default EditableCell;
