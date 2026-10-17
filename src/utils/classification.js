// A UI prompt, not a calibrated estimate of the model's real-world accuracy.
export function needsClassConfirmation(predictions, isMock = false) {
  if (isMock || !predictions?.length) return false;
  const first = predictions[0]?.probability;
  const second = predictions[1]?.probability ?? 0;
  if (!Number.isFinite(first) || !Number.isFinite(second)) return true;
  return first < 0.75 || first - second < 0.15;
}

export function shouldRetryImage(predictions, isMock = false) {
  if (isMock || !predictions?.length) return false;
  const topScore = predictions[0]?.probability;
  return !Number.isFinite(topScore) || topScore < 0.7;
}
