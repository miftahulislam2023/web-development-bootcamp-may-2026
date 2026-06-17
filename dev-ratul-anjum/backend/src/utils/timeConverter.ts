/**
 * Convert time string (15m, 1h, 7d) to milliseconds
 * for cookie maxAge
 */
export const toMilliseconds = (time: string) => {
  const unit = time.slice(-1)?.toLowerCase();
  const value = parseInt(time.slice(0, -1), 10);
  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      return 24 * 60 * 60 * 1000; // default 1 day
  }
};

/**
 * Convert time string (15m, 1h, 7d) to seconds
 * for Redis expire / JWT expiresIn
 */
export const toSeconds = (time: string) => {
  const unit = time.slice(-1)?.toLowerCase();
  const value = parseInt(time.slice(0, -1), 10);
  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 24 * 60 * 60;
    default:
      return 24 * 60 * 60; // default 1 day
  }
};
