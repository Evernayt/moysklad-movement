import './Textbox.css';

const Textbox = ({ label, containerStyle, ...props }) => {
  return (
    <div className="textbox-container" style={containerStyle}>
      <input className="textbox" {...props} placeholder=" " />
      <div className="textbox-label">{label}</div>
    </div>
  );
};

export default Textbox;
