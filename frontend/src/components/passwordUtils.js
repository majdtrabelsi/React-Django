export function checkPasswordStrength(password) {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  return {
    isStrong: minLength && hasUpper && hasLower && hasNumber && hasSymbol,
    rules: {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSymbol,
    }
  };
}