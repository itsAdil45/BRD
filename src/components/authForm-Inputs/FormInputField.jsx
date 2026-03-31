export const FormInputField = ({
  label,
  name,
  type: ft = "text",
  value,
  placeholder,
  disabled,
  small,
  required,
  handle,
  errors,
}) => (
  <div className="brd-field">
    <label htmlFor={name}>
      {label}
      {required && <span>*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={ft}
      value={value}
      placeholder={placeholder || ""}
      disabled={disabled}
      onChange={handle}
      className={errors[name] ? "brd-input brd-input--err" : "brd-input"}
      autoComplete={ft === "password" ? "current-password" : "off"}
    />
    {small && <p className="brd-hint">{small}</p>}
    {errors[name] && <p className="brd-err">{errors[name]}</p>}
  </div>
);
