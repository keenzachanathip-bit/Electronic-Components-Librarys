import { parts } from "../data/catalog.js";

// Demo scores are fixed examples. They never inspect the uploaded image.
export function createMockPredictions(className) {
  const selected = parts.find((part) => part.name === className) || parts[0];
  const otherClasses = parts.filter((part) => part.name !== selected.name);

  return [
    { className: selected.name, probability: 0.82 },
    { className: otherClasses[0].name, probability: 0.11 },
    { className: otherClasses[1].name, probability: 0.07 },
    ...otherClasses.slice(2).map((part) => ({ className: part.name, probability: 0 })),
  ];
}
