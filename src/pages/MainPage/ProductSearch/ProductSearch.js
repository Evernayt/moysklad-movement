import { Loader, Textbox } from 'components';
import { Context } from 'context';
import { getStocks } from 'helpers';
import { useDebounce, useOnClickOutside } from 'hooks';
import { searchProductsAPI } from 'http/productAPI';
import React, { useContext, useEffect, useRef, useState } from 'react';
import './ProductSearch.css';

const ProductSearch = ({ isShowing, setIsShowing, productInfoModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const [products, setProducts] = useState([]);

  const {
    store: stores,
    product: {
      setName,
      setArticle,
      setCode,
      setStocks,
      setProductHref,
      setLastProduct,
    },
  } = useContext(Context);

  const ref = useRef();

  useOnClickOutside(ref, () => setIsShowing(false));

  const debouncedSearchTerm = useDebounce(text, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      search();
    } else {
      setProducts([]);
    }
  }, [debouncedSearchTerm]);

  const search = () => {
    setIsLoading(true);
    const foundProducts = [];
    searchProductsAPI(debouncedSearchTerm)
      .then((data) => {
        for (let index = 0; index < data.rows.length; index++) {
          const product = data.rows[index];
          const name = product.name;
          const article = product.article ? product.article : null;
          const code = product.code ? product.code : null;
          const href = product.meta.href;

          foundProducts.push({ name, article, code, href });
        }
        setProducts(foundProducts);
      })
      .finally(() => setIsLoading(false));
  };

  const openProduct = (product) => {
    setName(product.name);
    setArticle(product.article);
    setCode(product.code);
    setProductHref(product.href);
    getStocks([product.name]).then((data) => {
      const stocks = data?.rows[0].stockByStore;
      setStocks(stocks);
      setIsShowing(false);
      productInfoModal.setIsShowing(true);
    });
  };

  return (
    <div
      className={isShowing ? 'product-search active' : 'product-search'}
      ref={ref}
    >
      <Textbox
        label="Поиск"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="divider" />
      {isLoading ? (
        <div className="product-search-loader-container">
          <Loader />
        </div>
      ) : (
        <div style={{ height: '70%' }}>
          {products.length > 0 ? (
            <div className="product-search-container">
              {products.map((product, index) => (
                <span
                  key={index}
                  className="product-value clickable"
                  onClick={() => openProduct(product)}
                >
                  {product.name}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              Введите наименование, код, штрихкод или артикул
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
