// Validation utility for common input validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 100;
};

const validateAmount = (amount) => {
  return amount && !isNaN(amount) && amount > 0;
};

const validateDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

const validateString = (str, minLength = 1, maxLength = 1000) => {
  return (
    str &&
    typeof str === "string" &&
    str.length >= minLength &&
    str.length <= maxLength
  );
};

const validateArrayItems = (arr, maxLength = 100) => {
  return (
    Array.isArray(arr) &&
    arr.length <= maxLength &&
    arr.every((item) => typeof item === "string" && item.length > 0)
  );
};

const validateCategory = (category, validCategories) => {
  return validCategories.includes(category);
};

const validateTransactionType = (type) => {
  return ["income", "expense"].includes(type);
};

const validateFrequency = (frequency) => {
  return ["daily", "weekly", "monthly"].includes(frequency);
};

const validateCurrency = (currency) => {
  const validCurrencies = [
    "USD",
    "EUR",
    "GBP",
    "INR",
    "JPY",
    "AUD",
    "CAD",
    "CHF",
    "CNY",
    "SGD",
  ];
  return validCurrencies.includes(currency);
};

// Sanitization utility
const sanitizeString = (str) => {
  if (!str) return "";
  return String(str).trim().replace(/[<>]/g, "").substring(0, 1000);
};

const sanitizeEmail = (email) => {
  return String(email).toLowerCase().trim();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validateAmount,
  validateDate,
  validateString,
  validateArrayItems,
  validateCategory,
  validateTransactionType,
  validateFrequency,
  validateCurrency,
  sanitizeString,
  sanitizeEmail,
};
