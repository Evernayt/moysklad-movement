import { Button, Textarea, Textbox } from 'components';
import { Context } from 'context';
import { getFormattedTime } from 'helpers';
import { useModal } from 'hooks';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTable } from 'react-table';
import AuthModal from './AuthModal/AuthModal';
import ButtonCell from './ButtonCell';
import EditableCell from './EditableCell';
import EditModal from './EditModal/EditModal';
import './MainPage.css';
import NewMovementModal from './NewMovementModal/NewMovementModal';
import ProductInfo from './ProductInfo/ProductInfo';
import ProductSearch from './ProductSearch/ProductSearch';
import Table from './Table/Table';
import XLSX from 'xlsx-js-style';

const MainPage = () => {
  const { state } = useLocation();
  const { from, where, supplier, recreatedExcelData } = state;

  const [skipPageReset, setSkipPageReset] = useState(false);

  const {
    main: { excelData, setExcelData },
  } = useContext(Context);

  const editModal = useModal();
  const authModal = useModal();
  const newMovementModal = useModal();
  const productInfoModal = useModal();
  const productSearchModal = useModal();

  const columns = useMemo(
    () => [
      {
        Header: '№',
        accessor: 'num',
      },
      {
        Header: 'Наименование',
        accessor: 'name',
        style: { width: '100%' },
      },
      {
        Header: 'Артикул',
        accessor: 'article',
        style: { whiteSpace: 'nowrap' },
      },
      {
        Header: 'Код',
        accessor: 'code',
        style: { whiteSpace: 'nowrap' },
      },
      {
        Header: 'Кол-во',
        accessor: 'quantity',
      },
      {
        Header: 'Товар в МойСклад',
        accessor: 'productInMoySklad',
        Cell: ButtonCell,
        productInfoModal,
        productSearchModal,
      },
      {
        Header: 'Перемещение',
        accessor: 'movement',
        Cell: EditableCell,
      },
      {
        Header: 'Комментарий',
        accessor: 'comment',
        Cell: EditableCell,
      },
    ],
    []
  );

  useEffect(() => {
    setExcelData(recreatedExcelData);
  }, []);

  useEffect(() => {
    setSkipPageReset(false);
  }, [excelData]);

  const updateMyData = (rowIndex, columnId, value) => {
    setSkipPageReset(true);
    setExcelData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const createExcelFile = () => {
    const data = [];
    for (let index = 0; index < excelData.length; index++) {
      const product = excelData[index];

      data.push({
        '№': product.num.toString(),
        Наименование: product.name,
        Артикул: product.article.toString(),
        Код: product.code.toString(),
        'Кол-во': product.quantity,
        Перемещение: product.movement,
        Комментарий: product.comment ? product.comment : ' ',
      });
    }

    const workbook = XLSX.utils.book_new();
    workbook.SheetNames.push('Movement');
    const worksheet = XLSX.utils.json_to_sheet(data);

    const border = {
      top: {
        style: 'thin',
        color: '000000',
      },
      bottom: {
        style: 'thin',
        color: '000000',
      },
      left: {
        style: 'thin',
        color: '000000',
      },
      right: {
        style: 'thin',
        color: '000000',
      },
    };

    for (const key in worksheet) {
      if (typeof worksheet[key] != 'object') continue;

      const cell = XLSX.utils.decode_cell(key);

      worksheet[key].s = {
        font: {
          name: 'Arial',
          sz: 10,
        },
        alignment: {
          vertical: 'center',
          wrapText: true,
        },
        border,
      };

      if (cell.c == 0 || cell.c == 4 || cell.c == 5) {
        worksheet[key].s = {
          font: {
            name: 'Arial',
            sz: 10,
          },
          alignment: {
            vertical: 'center',
            horizontal: 'center',
          },
          border,
        };
      }

      if (cell.r == 0) {
        worksheet[key].s = {
          font: {
            name: 'Arial',
            sz: 10,
            bold: true,
          },
          alignment: {
            vertical: 'center',
            horizontal: 'center',
          },
          border,
        };
      }
    }

    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const rowsCount = range.e.r + 1;
    const colsCount = range.e.c + 1;

    const rows = [];
    for (let index = 0; index < rowsCount; index++) {
      rows.push({ hpx: 30 });
    }
    worksheet['!rows'] = rows;

    const cols = [];
    for (let index = 0; index < colsCount; index++) {
      if (index === 0) {
        cols.push({ wch: 5 });
      } else if (index === 1) {
        cols.push({ wch: 50 });
      } else {
        cols.push({ wch: 20 });
      }
    }
    worksheet['!cols'] = cols;
    workbook.Sheets['Movement'] = worksheet;
    const time = getFormattedTime();
    XLSX.writeFile(
      workbook,
      `${supplier} - перемещение на ${where} (${time}).xlsx`
    );
  };

  return (
    <div>
      <EditModal
        isShowing={editModal.isShowing}
        setIsShowing={editModal.setIsShowing}
      />
      <AuthModal
        isShowing={authModal.isShowing}
        setIsShowing={authModal.setIsShowing}
      />
      <NewMovementModal
        isShowing={newMovementModal.isShowing}
        setIsShowing={newMovementModal.setIsShowing}
      />
      <div className="main-page-header">
        <span>
          Перемещение с <span className="product-value">{from}</span> на{' '}
          <span className="product-value">{where}</span>. Поставщик{' '}
          <span className="product-value">{supplier}</span>.
        </span>
      </div>
      <div className="main-page-center">
        <ProductInfo
          isShowing={productInfoModal.isShowing}
          setIsShowing={productInfoModal.setIsShowing}
          from={from}
          where={where}
          editModal={editModal}
          productSearchModal={productSearchModal}
        />
        <ProductSearch
          isShowing={productSearchModal.isShowing}
          setIsShowing={productSearchModal.setIsShowing}
          productInfoModal={productInfoModal}
        />
        <div className="main-page-table-container">
          <Table
            columns={columns}
            data={excelData}
            updateMyData={updateMyData}
            skipPageReset={skipPageReset}
          />
        </div>
      </div>
      <div className="main-page-footer">
        <Button onClick={() => authModal.setIsShowing(true)}>
          Авторизация
        </Button>
        <Button onClick={() => newMovementModal.setIsShowing(true)}>
          Новое перемещение
        </Button>
        <Button appearance="primary" onClick={createExcelFile}>
          Сохранить в файл
        </Button>
      </div>
    </div>
  );
};

export default MainPage;
