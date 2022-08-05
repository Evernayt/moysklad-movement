import Button from 'components/Button/Button';
import React, { useRef, useState } from 'react';
import './FileUploader.css';

const FileUploader = ({ icon, appearance, onChange, accept, ...props }) => {
  const [fileName, setFileName] = useState('Выберите файл');

  const fileInputRef = useRef(null);

  const handleClick = (event) => {
    fileInputRef.current.click();
  };

  const onChangeHandler = (event) => {
    setFileName(event.target.files[0].name);
    onChange(event);
  };

  return (
    <div {...props}>
      <Button
        appearance={appearance}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={handleClick}
      >
        <img className="file-uploader-img" src={icon} alt="" />
        <span className="file-uploader-text">{fileName}</span>
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onChangeHandler}
        accept={accept}
      />
    </div>
  );
};

const IconButton = ({ appearance = 'default', icon, children, ...props }) => {
  return (
    <button className={`icon-button-${appearance}`} {...props}>
      <img
        className="icon-button-img"
        style={
          children === undefined ? { marginRight: 0 } : { marginRight: '8px' }
        }
        src={icon}
        alt=""
      />
      {children}
    </button>
  );
};

export default FileUploader;
