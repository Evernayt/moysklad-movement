import { Button, Modal } from 'components';
import React, { useState } from 'react';

const ErrorModal = ({ isShowing, setIsShowing }) => {
  return (
    <Modal title="Ошибка чтения файла" isShowing={isShowing}>
      <div style={{ whiteSpace: 'pre-line', marginBottom: '12px' }}>
        {`Возможно в файле отсутствует одно из названий столбца,
        напр. (№, Наименование, Код, Артикул или Кол-во).
        \nИли файл с кривой кодировкой, и его нужно пересохранить.`}
      </div>
      <Button appearance="primary" onClick={() => setIsShowing(false)}>
        ОК
      </Button>
    </Modal>
  );
};

export default ErrorModal;
