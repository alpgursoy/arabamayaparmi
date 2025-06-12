/**
 * Format a date string into a more readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};
