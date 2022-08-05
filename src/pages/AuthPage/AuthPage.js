import { Button, Loader, Textbox } from 'components';
import { MOYSKLAD_ICON } from 'constants/icons';
import { authorizationAPI } from 'http/authorizationAPI';
import { fetchStoresAPI } from 'http/storeAPI';
import { useContext, useEffect, useState } from 'react';
import { Context } from 'context';
import { useNavigate } from 'react-router-dom';
import { STEPS_ROUTE } from 'constants/routes';
import './AuthPage.css';
import { enterPressHandler } from 'helpers';

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const {
    store: { setStores },
  } = useContext(Context);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('login') !== null) {
      const localLoginData = JSON.parse(localStorage.getItem('login'));
      const login = localLoginData[0];
      const password = localLoginData[1];

      authorization(login, password);
    }
  }, []);

  const authorization = (login, password) => {
    setIsLoading(true);
    authorizationAPI(login, password)
      .then(() => {
        const loginData = [login, password];
        localStorage.setItem('login', JSON.stringify(loginData));

        getStores();
        navigate(STEPS_ROUTE);
      })
      .catch((e) => {
        setError(e.message ? e.message : 'Ошибка');
      })
      .finally(() => setIsLoading(false));
  };

  const getStores = () => {
    fetchStoresAPI()
      .then((data) => {
        data.rows.forEach((store, index) => {
          setStores((prevState) => [
            ...prevState,
            { id: index, name: store.name },
          ]);
        });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const onEnterPress = (event) => {
    if (login === '' || password === '') {
      enterPressHandler(event, () => authorization(login, password));
    }
  };

  return (
    <div className="auth-page-container">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="auth-page-container">
          <img src={MOYSKLAD_ICON} style={{ marginBottom: '24px' }} />
          <div className="card">
            <Textbox
              label="Логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <Textbox
              label="Пароль"
              type="password"
              containerStyle={{ margin: '12px 0' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={onEnterPress}
            />
            <Button
              appearance="primary"
              disabled={!login === '' || password === ''}
              onClick={() => authorization(login, password)}
            >
              Авторизоваться
            </Button>
          </div>
          <span className="auth-page-error">{error}</span>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
