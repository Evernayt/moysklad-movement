import Button from 'components/Button/Button';
import './Modal.css';

const Modal = ({ title, isShowing, setIsShowing, children, ...props }) => {
  return (
    isShowing && (
      <div className="modal-container">
        <div className="modal-form-container" {...props}>
          <div className="modal-form-header">
            <span className="modal-form-header-title">{title}</span>
          </div>
          <div className="divider" style={{ margin: 0 }} />
          <div className="modal-form">{children}</div>
        </div>
      </div>
    )
  );
};

export default Modal;
