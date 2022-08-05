import { Button, Modal } from 'components';
import React from 'react';
import './NewMovementModal.css';

const NewMovementModal = ({ isShowing, setIsShowing }) => {
  const newMovement = () => {
    window.location.reload();
  };

  return (
    <Modal title="Новое перемещение" isShowing={isShowing}>
      <span className="new-movement-modal-message">
        Вы уверены что хотите сделать новое перемещение?{`\n`}Не сохраненные
        данные будут удалены.
      </span>
      <div className="new-movement-modal-controls">
        <Button
          style={{ marginRight: '8px' }}
          onClick={() => setIsShowing(false)}
        >
          Отмена
        </Button>
        <Button appearance="primary" onClick={newMovement}>
          Новое перемещение
        </Button>
      </div>
    </Modal>
  );
};

export default NewMovementModal;
