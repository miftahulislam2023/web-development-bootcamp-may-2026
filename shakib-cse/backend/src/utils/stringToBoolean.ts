export function stringToBoolean(value: unknown): boolean | undefined {
    if (typeof value === 'boolean') return value; // already boolean
    if (typeof value !== 'string') return undefined; // not a string, return undefined

    const val = value.trim().toLowerCase();
    if (['true', '1', 'yes'].includes(val)) return true;
    if (['false', '0', 'no'].includes(val)) return false;

    return undefined; // cannot convert
}
