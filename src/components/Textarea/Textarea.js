import './Textarea.css';

const Textarea = ({label, containerStyle, ...props}) => {
  return (
    <div className="textarea-container" style={containerStyle}>
      <textarea className="textarea" {...props} placeholder=" "/>
      <label className="textarea-label" >{label}</label>
    </div>
  );
}

export default Textarea;