import React from 'react';

function FormField({ label, name, value, onChange, type = 'text', isTextarea = false, rows = 3 }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      
      {isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          className="field-input textarea"
          rows={rows}
        ></textarea>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="field-input"
        />
      )}
    </div>
  );
}

export default FormField;