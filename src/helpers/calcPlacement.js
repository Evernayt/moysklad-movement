const calcPlacement = (placement, margin = '8px') => {
  switch (placement) {
    case 'bottom-start':
      return { right: 'auto', marginTop: margin };
      break;
    case 'bottom-end':
      return { right: '0', marginTop: margin };
      break;
    case 'top-start':
      return { bottom: '100%', right: 'auto', marginBottom: margin };
      break;
    case 'top-end':
      return { bottom: '100%', right: '0', marginBottom: margin };
      break;
    case 'left-start':
      return { top: '0', right: '100%', marginRight: margin };
      break;
    case 'left-end':
      return { bottom: '0', right: '100%', marginRight: margin };
      break;
    case 'right-start':
      return { top: '0', left: '100%', marginLeft: margin };
      break;
    case 'right-end':
      return { bottom: '0', left: '100%', marginLeft: margin };
      break;
    default:
      return { right: 'auto', marginTop: margin };
      break;
  }
};

export default calcPlacement;
