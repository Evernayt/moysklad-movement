import { fetchStocksAPI } from 'http/stockAPI';

const getStocks = async (options) => {
  for (let index = 0; index < options.length; index++) {
    const data = await fetchStocksAPI(options[index]);
    if (data.rows.length > 0) {
      return data;
    }
  }
  return null;
};

export default getStocks;
