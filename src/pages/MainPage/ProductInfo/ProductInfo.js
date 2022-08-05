import { Button } from 'components';
import { NOT_INDICATED } from 'constants/app';
import { Context } from 'context';
import { calcMovement } from 'helpers';
import { useOnClickOutside } from 'hooks';
import React, { useContext, useRef } from 'react';
import './ProductInfo.css';

const ProductInfo = ({
  isShowing,
  setIsShowing,
  from,
  where,
  editModal,
  productSearchModal,
}) => {
  const {
    main: { setExcelData, excelData },
    product: { name, article, code, productHref, stocks, lastProduct },
  } = useContext(Context);

  const ref = useRef();

  useOnClickOutside(ref, () => {
    !editModal.isShowing && setIsShowing(false);
  });

  const saveAndCalcMovement = () => {
    const movement = calcMovement(lastProduct.quantity, stocks, from, where);

    setExcelData((prevState) =>
      prevState.map((state) =>
        state.num === lastProduct.num
          ? { ...state, movement, productHref, stockByStore: stocks }
          : state
      )
    );

    setIsShowing(false);
  };

  const openEditModal = () => {
    editModal.setIsShowing(true);
  };

  const openProductSearchModal = () => {
    setIsShowing(false);
    productSearchModal.setIsShowing(true);
  };

  return (
    <div
      className={isShowing ? 'product-info active' : 'product-info'}
      ref={ref}
    >
      <div className="product-info-header">
        <span className="product-info-name">{name}</span>
        <Button
          appearance="primary-deemphasized"
          style={{ width: 'max-content' }}
          onClick={openEditModal}
        >
          Изменить
        </Button>
      </div>
      <div className="divider" />
      <div className="product-info-container">
        <div className="product-info-column">
          <span className="product-param">Артикул</span>
          <span className="product-param">Код</span>
          {stocks.map((stock, index) => (
            <span key={index} className="product-param">
              {stock.name}
            </span>
          ))}
        </div>
        <div className="product-info-column">
          <span className="product-value">
            {article ? article : NOT_INDICATED}
          </span>
          <span className="product-value">{code ? code : NOT_INDICATED}</span>
          {stocks.map((stock, index) => (
            <span key={index} className="product-value">
              {stock.stock}
            </span>
          ))}
        </div>
        <div style={{ marginLeft: 'auto' }}>
          {!lastProduct?.productHref && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                style={{ width: 'min-content' }}
                onClick={openProductSearchModal}
              >
                Назад
              </Button>
              <Button appearance="primary" onClick={saveAndCalcMovement}>
                Сохранить и вычислить перемещение
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
