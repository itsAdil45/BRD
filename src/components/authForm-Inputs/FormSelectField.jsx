export const FormSelectField = ({
  label,
  name,
  value,
  options,
  required,
  handle,
  errors,
}) => (
  <div className="brd-field">
    <label htmlFor={name}>
      {label}
      {required && <span>*</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={handle}
      className={errors[name] ? "brd-input brd-input--err" : "brd-input"}
    >
      <option value="">— Select —</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    {errors[name] && <p className="brd-err">{errors[name]}</p>}
  </div>
);
