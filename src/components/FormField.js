import React from 'react';

function FormField({ 
  label, 
  name, 
  value, 
  onChange, 
  type = 'text', 
  isTextarea = false, 
  rows = 3,
  disabled = false,
  required = false
}) {
  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      
      {isTextarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="field-input textarea"
          rows={rows}
          disabled={disabled}
          required={required}
        ></textarea>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="field-input"
          disabled={disabled}
          required={required}
        />
      )}
    </div>
  );
}

export default FormField;