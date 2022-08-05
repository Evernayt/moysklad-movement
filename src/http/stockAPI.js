import { $authHost } from "http";

const fetchStocksAPI = async (search) => {
  const { data } = await $authHost.get(
    `report/stock/bystore/?filter=search=${search}&filter=stockMode=all`
  );
  return data;
};

export { fetchStocksAPI };
