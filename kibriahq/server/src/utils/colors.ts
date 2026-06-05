export const colors = [
    'amber', 'blue', 'green', 'red', 'purple', 'pink', 'orange', 'yellow',
    'cyan', 'indigo', 'violet', 'fuchsia', 'rose', 'lime', 'emerald', 'teal',
    'sky', 'slate', 'gray', 'zinc', 'neutral', 'stone'
];

export const getRandomColor = (): string => {
    const availableColors = colors.slice(0, -5); // I don't want to set last 5 colors as default
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex] || 'amber';
}