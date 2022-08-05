import { $authHost } from 'http';

const fetchStoresAPI = async () => {
  const { data } = await $authHost.get('entity/store');
  return data;
};

export { fetchStoresAPI };
