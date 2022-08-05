const getBase64 = (file, cb) => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = () => {
    cb(reader.result);
  };
  reader.onerror = (error) => {
    console.log('Error: ', error);
  };
};

export default getBase64;
