export const FormPwField = ({
  label,
  name,
  value,
  show,
  toggleShow,
  small,
  handle,
  errors,
}) => (
  <div className="brd-field">
    <label htmlFor={name}>
      {label}
      <span>*</span>
    </label>
    <div className="brd-pw-wrap">
      <input
        id={name}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={handle}
        className={errors[name] ? "brd-input brd-input--err" : "brd-input"}
        autoComplete="new-password"
      />
      <button
        type="button"
        className="brd-pw-toggle"
        onClick={toggleShow}
        tabIndex={-1}
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
    {small && <p className="brd-hint">{small}</p>}
    {errors[name] && <p className="brd-err">{errors[name]}</p>}
  </div>
);
