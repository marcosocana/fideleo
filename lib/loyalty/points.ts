export const POINTS_PER_EURO = 1;

export function calculatePointsFromAmount(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return 0;
  }

  return Math.max(Math.floor(amount * POINTS_PER_EURO), 0);
}
