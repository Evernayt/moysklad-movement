import {
  Button,
  FileUploader,
  Loader,
  SelectButton,
  Textbox,
} from 'components';
import { MAIN_ROUTE } from 'constants/routes';
import { Context } from 'context';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import XLSX from 'xlsx-js-style';
import {
  calcMovement,
  enterPressHandler,
  getBase64,
  getStocks,
  sleep,
} from 'helpers';
import {
  ARTICLE_KEYS,
  CODE_KEYS,
  NAME_KEYS,
  NUM_KEYS,
  QUANTITY_KEYS,
} from 'constants/keys';
import './StepsPage.css';
import { EXCEL_ICON } from 'constants/icons';
import ErrorModal from './ErrorModal/ErrorModal';
import { useModal } from 'hooks';

const StepsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [stepTitle, setStepTitle] = useState('Загрузите файл накладной');
  const [file, setFile] = useState(null);
  const [from, setFrom] = useState(null);
  const [where, setWhere] = useState(null);
  const [supplier, setSupplier] = useState('');
  const [responseNum, setResponseNum] = useState(0);
  const [maxResponsesNum, setMaxResponsesNum] = useState(0);

  const {
    store: { stores },
  } = useContext(Context);

  const errorModal = useModal();

  const navigate = useNavigate();

  const nextStep = () => {
    switch (step) {
      case 1:
        setStep(2);
        setStepTitle('Укажите параметры');
        const savedFrom = localStorage.getItem('from');
        const savedWhere = localStorage.getItem('where');

        const selectedFrom = stores.find((x) => x.name === savedFrom);
        const selectedWhere = stores.find((x) => x.name === savedWhere);

        setFrom(selectedFrom);
        setWhere(selectedWhere);
        break;
      case 2:
        setIsLoading(true);
        localStorage.setItem('from', from.name);
        localStorage.setItem('where', where.name);
        parseExcelAndGetKeys()
          .then((data) => {
            recreateExcelData(data)
              .then((recreatedExcelData) => {
                navigate(MAIN_ROUTE, {
                  state: {
                    from: from.name,
                    where: where.name,
                    supplier,
                    recreatedExcelData,
                  },
                });
              })
              .finally(() => setIsLoading(false));
          })
          .catch((e) => console.error(e));
        break;
      default:
        break;
    }
  };

  const parseExcelAndGetKeys = () => {
    return new Promise((resolve) => {
      getBase64(file, (res) => {
        const workbook = XLSX.read(res);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        let numKey = null;
        let nameKey = null;
        let articleKey = null;
        let codeKey = null;
        let quantityKey = null;

        for (let i = 0; i < json.length; i++) {
          const row = json[i];

          for (const key in row) {
            const rowValue = row[key].toString();

            for (let j = 0; j < NUM_KEYS.length; j++) {
              if (rowValue === NUM_KEYS[j]) {
                numKey = key;
                break;
              }
            }

            for (let j = 0; j < NAME_KEYS.length; j++) {
              if (rowValue.includes(NAME_KEYS[j])) {
                nameKey = key;
                break;
              }
            }

            for (let j = 0; j < ARTICLE_KEYS.length; j++) {
              if (rowValue.includes(ARTICLE_KEYS[j])) {
                articleKey = key;
                break;
              }
            }

            for (let j = 0; j < CODE_KEYS.length; j++) {
              if (
                !rowValue.includes('Штрих') &&
                rowValue.includes(CODE_KEYS[j])
              ) {
                codeKey = key;
                break;
              }
            }

            for (let j = 0; j < QUANTITY_KEYS.length; j++) {
              if (rowValue.includes(QUANTITY_KEYS[j])) {
                quantityKey = key;

                if (!articleKey && !codeKey) {
                  setIsLoading(false);
                  errorModal.setIsShowing(true);
                  return;
                }

                resolve({
                  json,
                  startIndex: i + 1,
                  keys: { numKey, nameKey, articleKey, codeKey, quantityKey },
                });
                return;
              }
            }
          }
          
          if (i === json.length - 1) {
            setIsLoading(false);
            errorModal.setIsShowing(true);
            return;
          }
        }
      });
    });
  };

  const recreateExcelData = ({ json, startIndex, keys }) => {
    return new Promise(async (resolve) => {
      const promises = [];
      const recreatedExcelData = [];
      let requestIndex = 0;
      let maxResponsesNumTemp = 0;

      for (let index = startIndex; index < json.length; index++) {
        const row = json[index];

        let num = null;

        for (const key in row) {
          const rowValue = row[key];

          if (key === keys.numKey) {
            num = rowValue;
          }
        }

        if (!num) break;
        maxResponsesNumTemp++;
      }

      setMaxResponsesNum(maxResponsesNumTemp);
      
      for (let i = startIndex; i < json.length; i++) {
        const row = json[i];
        requestIndex++;

        let num = null;
        let name = null;
        let article = null;
        let code = null;
        let quantity = null;

        for (const key in row) {
          const rowValue = row[key];

          if (key === keys.numKey) {
            num = rowValue;
          } else if (key === keys.nameKey) {
            name = rowValue;
          } else if (key === keys.articleKey) {
            article = rowValue;
          } else if (key === keys.codeKey) {
            code = rowValue;
          } else if (key === keys.quantityKey) {
            quantity = rowValue;
          }
        }

        if (!num || !name || !code || !quantity) break;
        setResponseNum((prevState) => prevState + 1);
        if (requestIndex === 5) {
          await sleep(3000);
          requestIndex = 0;
        }
        
        const promise = getStocks([article, code]).then((data) => {
          let movement = 0;
          let productHref = null;
          let stockByStore = null;

          if (data) {
            movement = calcMovement(
              quantity,
              data.rows[0].stockByStore,
              from.name,
              where.name
            );
            productHref = data.rows[0].meta.href;
            stockByStore = data.rows[0].stockByStore;
          }

          recreatedExcelData.push({
            num,
            name,
            article,
            code,
            quantity,
            movement,
            commnet: '',
            productHref,
            stockByStore,
          });
        });
        promises.push(promise);
      }
      Promise.all(promises).then(() => {
        recreatedExcelData.sort((a, b) => a.num - b.num);
        resolve(recreatedExcelData);
      });
    });
  };

  const onEnterPress = (event) => {
    enterPressHandler(event, () => {
      if (!from || !where || supplier === '') return;
      nextStep();
    });
  };

  const back = () => {
    setFile(null);
    setStep(1);
  };

  const renderStepBody = () => {
    if (step === 1) {
      return (
        <div className="steps-card-body">
          <FileUploader
            icon={EXCEL_ICON}
            onChange={(e) => setFile(e.target.files[0])}
            accept=".xlsx, .xls, .ods"
          />
          <Button
            appearance="primary"
            style={{ width: 'max-content', marginTop: '16px' }}
            onClick={nextStep}
            disabled={!file}
          >
            Далее
          </Button>
        </div>
      );
    } else if (step === 2) {
      return (
        <div className="steps-card-body">
          <span className="select-button-label">Откуда</span>
          <SelectButton
            items={stores}
            style={{ marginBottom: '8px' }}
            defaultSelectedItem={from}
            onChange={(e) => setFrom(e)}
          />
          <span className="select-button-label">Куда</span>
          <SelectButton
            items={stores}
            style={{ marginBottom: '12px' }}
            defaultSelectedItem={where}
            onChange={(e) => setWhere(e)}
          />
          <Textbox
            label="Поставщик"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            onKeyUp={onEnterPress}
          />
          <div className="steps-page-controls">
            <Button style={{ width: 'max-content' }} onClick={back}>
              Назад
            </Button>
            <Button
              appearance="primary"
              onClick={nextStep}
              disabled={!from || !where || supplier === ''}
            >
              Вычислить перемещение
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="steps-page-container">
      <ErrorModal
        isShowing={errorModal.isShowing}
        setIsShowing={errorModal.setIsShowing}
      />
      {isLoading ? (
        <div className="steps-page-loader-container">
          <Loader />
          <span
            className="steps-card-header-text"
            style={{ marginTop: '24px', marginBottom: '12px' }}
          >
            Пожалуйста, подождите.
          </span>
          <span className="steps-card-header-text">
            {responseNum}/{maxResponsesNum}
          </span>
        </div>
      ) : (
        <div className="steps-page-container">
          <div className="card">
            <div className="steps-card-header">
              <span className="steps-card-header-text">
                {step}. {stepTitle}
              </span>
              <span className="steps-card-header-text">{step}/2</span>
            </div>
            {renderStepBody()}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepsPage;
