import { $authHost } from 'http';

const fetchProductAPI = async (url) => {
  const { data } = await $authHost.get(url);
  return data;
};

const searchProductsAPI = async (search) => {
  const { data } = await $authHost.get(
    `entity/assortment/?filter=search=${search}&limit=20`
  );
  return data;
};

const updateProductAPI = async (url, updatedData) => {
  const { data } = await $authHost.put(url, updatedData);
  return data;
};

export { fetchProductAPI, searchProductsAPI, updateProductAPI };
