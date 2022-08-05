import axios from 'axios';
import { SERVER_API_URL } from 'constants/app';

const $host = axios.create({
  baseURL: SERVER_API_URL,
});

const $authHost = axios.create({
  baseURL: SERVER_API_URL,
});

const authInterceptor = (config) => {
  const token = localStorage.getItem('token');
  config.headers.authorization = `Bearer ${token}`;
  return config;
};

$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };
