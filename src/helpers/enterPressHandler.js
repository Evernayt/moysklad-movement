const enterPressHandler = (event, handler) => {
  if (event.code === 'Enter' || event.code === 'NumpadEnter') {
    handler();
  }
};

export default enterPressHandler;
