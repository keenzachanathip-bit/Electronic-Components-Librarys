import * as tmImage from "@teachablemachine/image";
import * as tf from "@tensorflow/tfjs";

export function normalizeModelUrl(value) {
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("Enter a valid Teachable Machine model URL.");
  }

  if (url.protocol !== "https:" || url.hostname !== "teachablemachine.withgoogle.com" ||
      !/^\/models\/[^/]+\/?(?:model\.json)?$/.test(url.pathname)) {
    throw new Error("Use a Teachable Machine image model link from Share or Export.");
  }

  url.pathname = url.pathname.replace(/model\.json$/, "").replace(/\/?$/, "/");
  url.search = "";
  url.hash = "";
  return url.href;
}

export async function loadModel(modelUrl, onProgress) {
  const baseUrl = normalizeModelUrl(modelUrl);
  const modelFile = tf.io.http(`${baseUrl}model.json`, {
    onProgress: (fraction) => onProgress?.(Math.round(fraction * 100)),
  });
  return tmImage.load(modelFile, `${baseUrl}metadata.json`);
}

export async function predictImage(model, imageElement) {
  const predictions = await model.predict(imageElement);
  return [...predictions].sort((a, b) => b.probability - a.probability);
}
