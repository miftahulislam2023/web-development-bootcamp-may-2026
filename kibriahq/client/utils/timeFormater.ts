
export const timeFormater = (dateString: string) => {
    // make time this formate: May 1, 2026, 9:52 AM
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };
    return date.toLocaleString('en-US', options);
}