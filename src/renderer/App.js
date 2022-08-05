import { AuthPage, MainPage, StepsPage } from 'pages';
import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Context } from 'context';
import { STEPS_ROUTE, MAIN_ROUTE } from 'constants/routes';
import './App.css';

const App = () => {
  const [stores, setStores] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [name, setName] = useState('');
  const [article, setArticle] = useState('');
  const [code, setCode] = useState('');
  const [productHref, setProductHref] = useState('');
  const [stocks, setStocks] = useState([]);
  const [lastProduct, setLastProduct] = useState(null);

  return (
    <Context.Provider
      value={{
        store: { stores, setStores },
        main: { excelData, setExcelData },
        product: {
          name,
          setName,
          article,
          setArticle,
          code,
          setCode,
          productHref,
          setProductHref,
          stocks,
          setStocks,
          lastProduct,
          setLastProduct,
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path={STEPS_ROUTE} element={<StepsPage />} />
          <Route path={MAIN_ROUTE} element={<MainPage />} />
        </Routes>
      </Router>
    </Context.Provider>
  );
};

export default App;
