import { Button, Modal, Textbox } from 'components';
import { NOT_INDICATED, SERVER_API_URL } from 'constants/app';
import { Context } from 'context';
import { enterPressHandler } from 'helpers';
import { updateProductAPI } from 'http/productAPI';
import React, { useContext, useEffect, useState } from 'react';
import './EditModal.css';

const EditModal = ({ isShowing, setIsShowing }) => {
  const [newArticle, setNewArticle] = useState('');
  const [newCode, setNewCode] = useState('');

  const {
    product: { productHref, article, setArticle, code, setCode },
  } = useContext(Context);

  useEffect(() => {
    if (isShowing) {
      setNewArticle(article === NOT_INDICATED ? '' : article);
      setNewCode(code === NOT_INDICATED ? '' : code);
    }
  }, [isShowing]);

  const close = () => {
    setNewArticle('');
    setNewCode('');
    setIsShowing(false);
  };

  const edit = () => {
    const url = productHref.replace(SERVER_API_URL, '');
    const updatedData = { article: newArticle, code: newCode };
    updateProductAPI(url, updatedData).then((data) => {
      setArticle(data.article);
      setCode(data.code);
      close();
    });
  };

  const onEnterPress = (event) => {
    enterPressHandler(event, edit);
  };

  return (
    <Modal title="Изменение товара" isShowing={isShowing}>
      <Textbox
        label="Артикул"
        value={newArticle}
        onChange={(e) => setNewArticle(e.target.value)}
        onKeyUp={onEnterPress}
      />
      <Textbox
        label="Код"
        containerStyle={{ margin: '12px 0' }}
        value={newCode}
        onChange={(e) => setNewCode(e.target.value)}
        onKeyUp={onEnterPress}
      />
      <div className="edit-modal-controls">
        <Button style={{ marginRight: '8px' }} onClick={close}>
          Отменить
        </Button>
        <Button appearance="primary" onClick={edit}>
          Сохранить
        </Button>
      </div>
    </Modal>
  );
};

export default EditModal;
