const calcMovement = (quantity, stockByStore, from, where) => {
  let fromStocks = 0;
  let whereStocks = 0;

  for (let index = 0; index < stockByStore.length; index++) {
    const storeName = stockByStore[index].name;
    if (storeName === from) {
      fromStocks = Number(stockByStore[index].stock);
    } else if (storeName === where) {
      whereStocks = Number(stockByStore[index].stock);
    }
  }

  const coef = 0.33;
  const staysCoef = 0.67;

  const total = fromStocks + whereStocks + Number(quantity);
  const stays = coef * total;

  const movement = stays - whereStocks;

  return Math.round(movement);
};

export default calcMovement;
