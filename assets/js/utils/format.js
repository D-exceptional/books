// -------------------------------
// Extract Numerical Amount Part
// -------------------------------
export function extractAmount(value) {
  // Remove any non-digit, non-dot, and non-comma characters
  let clean = value.replace(/[^0-9.,]/g, "");

  // Remove commas (thousand separators)
  clean = clean.replace(/,/g, "");

  // Convert to float
  return parseFloat(clean);
}

// ----------------------------------------------------
//  Format Amounts Correctly
// ----------------------------------------------------
export function formatAmount(amount) {
  return `₦ ${amount.toLocaleString("US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ----------------------------------------------------
//  With custom settings, forcing a "US" locale to
// guarantee commas in output
// ----------------------------------------------------
export function formatCurrency(amount, decimalPrecision = 2) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: decimalPrecision,
    maximumFractionDigits: decimalPrecision,
  });
}

// ----------------------------------------------------
//  With custom settings, forcing a "US" locale
// to guarantee commas in output
// ----------------------------------------------------
export function formatNum(num) {
  return num.toLocaleString();
}

// ----------------------------------------------------
// Share Content
// ----------------------------------------------------
export function formatStat(number, precision = 1) {
  let numberCount;
  let suffix = "";

  if (number < 1000) {
    numberCount = number.toFixed(precision);
  } else if (number < 1_000_000) {
    numberCount = (number / 1000).toFixed(precision);
    suffix = "K";
  } else if (number < 1_000_000_000) {
    numberCount = (number / 1_000_000).toFixed(precision);
    suffix = "M";
  } else if (number < 1_000_000_000_000) {
    numberCount = (number / 1_000_000_000).toFixed(precision);
    suffix = "B";
  } else {
    numberCount = (number / 1_000_000_000_000).toFixed(precision);
    suffix = "T";
  }

  // Remove unnecessary trailing zeros
  if (precision > 0) {
    numberCount = numberCount.replace(new RegExp(`\\.0{1,${precision}}$`), "");
  }

  return numberCount + suffix;
}

/**
 * Generate a human readable version of the given timestamp
 *
 * @param {string} time - Timestamp in "YYYY-MM-DD HH:mm:ss" format
 * @returns {string} - Formatted time (e.g. "2 hours ago")
 */
export function formatTimeAgo(time) {
  const timeAgo = new Date(time.replace(" ", "T")); // Convert to valid ISO format
  const curTime = new Date();
  const elapsedTime = Math.floor((curTime - timeAgo) / 1000); // in seconds

  const seconds = elapsedTime;
  const minutes = Math.round(elapsedTime / 60);
  const hours = Math.round(elapsedTime / 3600);
  const days = Math.round(elapsedTime / 86400);
  const weeks = Math.round(elapsedTime / 604800);
  const months = Math.round(elapsedTime / 2600640);
  const years = Math.round(elapsedTime / 31207680);

  if (seconds <= 60) {
    return "Just now";
  } else if (minutes <= 60) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else if (hours <= 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (days <= 7) {
    return days === 1 ? "Yesterday" : `${days} days ago`;
  } else if (weeks <= 4.3) {
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  } else if (months <= 12) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else {
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }
}
