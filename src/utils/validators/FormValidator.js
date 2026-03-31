export const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isStrongPassword = (v) =>
  v.length >= 8 && /[A-Z]/.test(v) && /[0-9]/.test(v) && /[^A-Za-z0-9]/.test(v);
