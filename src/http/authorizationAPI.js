import { $host } from './index';

const authorizationAPI = async (login, password) => {
  const basicAuth = 'Basic ' + btoa(`${login}:${password}`);

  const { data } = await $host.post(
    'security/token',
    {},
    { headers: { Authorization: basicAuth } }
  );

  localStorage.setItem('token', data.access_token);
  return data.access_token;
};

export { authorizationAPI };
