import { calcPlacement } from 'helpers';
import { useOnClickOutside } from 'hooks';
import { useEffect, useRef, useState } from 'react';
import './SelectButton.css';

const SelectButton = ({
  items,
  onChange,
  defaultSelectedItem,
  placement,
  disabled,
  ...props
}) => {
  const defaultItem = {
    id: -1,
    name: 'Выберите...',
  };

  const [isHidden, setIsHidden] = useState(true);
  const [selectedItem, setSelectedItem] = useState(defaultItem);

  const selectBtnRef = useRef();

  useOnClickOutside(selectBtnRef, () => setIsHidden(true));

  useEffect(() => {
    if (defaultSelectedItem !== undefined) {
      setSelectedItem(defaultSelectedItem);
    }
  }, [defaultSelectedItem]);

  const selectItem = (item) => {
    setIsHidden(true);
    setSelectedItem(item);
    onChange(item);
  };

  return (
    <div className="select-btn-container" ref={selectBtnRef} {...props}>
      <div
        className={disabled ? 'select-btn-disabled' : 'select-btn'}
        onClick={
          disabled ? () => {} : () => setIsHidden((prevState) => !prevState)
        }
      >
        {selectedItem?.name}
      </div>
      <ul
        className="select-btn-menu"
        style={{
          display: isHidden ? 'none' : 'block',
          ...calcPlacement(placement),
        }}
      >
        {items?.map((item, index) => {
          const id = new Date().getTime();
          return (
            <li key={item.id}>
              <input
                className="select-btn-input"
                id={index + id}
                name="select_btn"
                type="radio"
                checked={selectedItem?.id === item.id}
                onChange={() => selectItem(item)}
              />
              <label className="select-btn-item" htmlFor={index + id}>
                {item.name}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SelectButton;
