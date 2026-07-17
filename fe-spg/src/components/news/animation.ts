export function getStaggerDelay(
  index: number,
  step = 0.1,
  maximum = 0.3,
) {
  return `${Math.min(Math.max(index, 0) * step, maximum).toFixed(1)}s`;
}
