import { NOT_INDICATED, SERVER_API_URL } from 'constants/app';
import { fetchProductAPI } from 'http/productAPI';
import sleep from './sleep';

const getProduct = (productHref) => {
  const url = productHref.replace(SERVER_API_URL, '');

  return new Promise((resolve) => {
    fetchProductAPI(url)
      .then((data) => {
        const name = data.name;
        const article = data.article ? data.article : NOT_INDICATED;
        const code = data.code ? data.code : NOT_INDICATED;

        resolve({ name, article, code });
      })
      .catch((e) => {
        console.error(e);
      });
  });
};

export default getProduct;
