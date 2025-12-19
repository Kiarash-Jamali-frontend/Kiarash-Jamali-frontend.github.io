/**
 * محاسبه level بر اساس XP
 * هر ۱۵۰۰ XP برابر با 1 level است
 * @param xp - مقدار تجربه (XP) کاربر
 * @returns سطح (Level) کاربر
 */
export function calculateLevel(xp: number): number {
    if (xp < 0) return 1;
    return Math.floor(xp / 1500) + 1;
}
