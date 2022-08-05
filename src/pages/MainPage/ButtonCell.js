import { Button } from 'components';
import { Context } from 'context';
import { useContext } from 'react';
import { SERVER_API_URL } from 'constants/app';
import { fetchProductAPI } from 'http/productAPI';
import { getProduct } from 'helpers';

const ButtonCell = ({
  data,
  row: { index },
  column: { productInfoModal, productSearchModal },
}) => {
  const {
    product: {
      setName,
      setArticle,
      setCode,
      setProductHref,
      setStocks,
      setLastProduct,
    },
  } = useContext(Context);

  const openProductInfo = () => {
    const product = data[index];
    setLastProduct(product);
    setProductHref(product.productHref);

    const stockByStore = product.stockByStore;
    setStocks(stockByStore);
    getProduct(product.productHref).then((data) => {
      setName(data.name);
      setArticle(data.article);
      setCode(data.code);
      productInfoModal.setIsShowing(true);
    });
  };

  const openProductSearch = () => {
    const product = data[index];
    setLastProduct(product);

    productSearchModal.setIsShowing(true);
  };

  if (data[index].productHref) {
    return <Button onClick={openProductInfo}>Открыть</Button>;
  } else {
    return (
      <Button onClick={openProductSearch} appearance="danger">
        Не найдено
      </Button>
    );
  }
};

export default ButtonCell;
