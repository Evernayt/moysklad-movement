import { Button, Modal, Textbox } from 'components';
import { enterPressHandler } from 'helpers';
import { authorizationAPI } from 'http/authorizationAPI';
import React, { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ isShowing, setIsShowing }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const authorization = (login, password) => {
    authorizationAPI(login, password)
      .then(() => {
        const loginData = [login, password];
        localStorage.setItem('login', JSON.stringify(loginData));

        close();
      })
      .catch((e) => {
        setError(e.message ? e.message : 'Ошибка');
        console.log(e);
      });
  };

  const close = () => {
    setIsShowing(false);
    setLogin('');
    setPassword('');
    setError('');
  };

  const onEnterPress = (event) => {
    enterPressHandler(event, () => {
      if (!login === '' || password === '') return;
      authorization(login, password);
    });
  };

  return (
    <Modal title="Авторизация в МойСклад" isShowing={isShowing}>
      <Textbox
        label="Логин"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        onKeyUp={onEnterPress}
      />
      <Textbox
        label="Пароль"
        type="password"
        containerStyle={{ margin: '12px 0' }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyUp={onEnterPress}
      />
      <div className="auth-modal-controls">
        <Button style={{ marginRight: '8px' }} onClick={close}>
          Отменить
        </Button>
        <Button
          appearance="primary"
          disabled={!login === '' || password === ''}
          onClick={() => authorization(login, password)}
        >
          Авторизоваться
        </Button>
      </div>
      {error !== '' && <div className="auth-modal-error">{error}</div>}
    </Modal>
  );
};

export default AuthModal;
