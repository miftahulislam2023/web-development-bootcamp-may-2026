export const parseP2003FieldName = (error_message: string) => {
  const match = error_message.match(/`([^`]+_fkey)`/);
  if (!match) return "unknown_field";

  const fullConstraint = match[1];

  const firstUnderscore = fullConstraint.indexOf("_");
  const lastUnderscore = fullConstraint.lastIndexOf("_");

  if (
    firstUnderscore === -1 ||
    lastUnderscore === -1 ||
    firstUnderscore === lastUnderscore
  ) {
    return "unknown_field";
  }
  return fullConstraint.substring(firstUnderscore + 1, lastUnderscore);
};

export const parsePrismaValidationError = (
  error_message: string,
): { field: string; message?: string } => {
  let field = "unknown_field";

  const arg_match = error_message.match(/Invalid value for argument `([^`]+)`/);
  if (arg_match) {
    field = arg_match?.[1] ?? field;
    return {
      field,
      message: `Invalid value provided for '${field}'. Please check your input.`,
    };
  }

  const missing_match = error_message.match(/Missing required field '([^']+)'/);
  if (missing_match) {
    field = missing_match[1] ?? field;
    return {
      field,
      message: `The '${field}' field is required. Please provide a value.`,
    };
  }

  // fallback message
  return { field };
};
