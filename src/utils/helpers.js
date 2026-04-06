/**
 * Format currency to Indian Rupees
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to readable string
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time to 12-hour format
 */
export function formatTime(time) {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
}

/**
 * Get TMDB image URL
 */
export function getTmdbImageUrl(path, size = 'w500') {
  if (!path) return '/placeholder.png';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

/**
 * Generate booking reference
 */
export function generateBookingReference() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `BK${timestamp}${random}`.toUpperCase();
}

/**
 * Calculate time until showtime
 */
export function getTimeUntilShow(showDate, showTime) {
  const [hours, minutes] = showTime.split(':');
  const showDateTime = new Date(showDate);
  showDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
  
  const now = new Date();
  const diff = showDateTime - now;
  
  if (diff < 0) return 'Show has passed';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hrs}h`;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

/**
 * Validate email
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate phone number (Indian)
 */
export function isValidPhone(phone) {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

/**
 * Get seat row letter from seat number
 */
export function getSeatRow(seatNumber) {
  return seatNumber.match(/[A-Z]+/)?.[0] || '';
}

/**
 * Get seat column number from seat number
 */
export function getSeatColumn(seatNumber) {
  return parseInt(seatNumber.match(/\d+/)?.[0] || 0);
}

/**
 * Group array by key
 */
export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
}

/**
 * Check if date is today
 */
export function isToday(date) {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    today.getDate() === checkDate.getDate() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getFullYear() === checkDate.getFullYear()
  );
}

/**
 * Get movie rating color
 */
export function getRatingColor(rating) {
  if (rating >= 8) return 'text-green-500';
  if (rating >= 6) return 'text-yellow-500';
  return 'text-red-500';
}

/**
 * Format movie runtime
 */
export function formatRuntime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Download as JSON
 */
export function downloadJSON(data, filename) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  link.click();
  URL.revokeObjectURL(url);
}