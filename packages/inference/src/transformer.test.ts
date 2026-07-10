import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  TinyTransformer,
  geluTanh,
  layerNorm,
  sampleIndex,
  softmaxWithTemperature,
  topK,
  type ModelManifest,
} from "./transformer";

describe("geluTanh", () => {
  it("matches torch's tanh-approximated GELU at known points", () => {
    expect(geluTanh(0)).toBe(0);
    expect(geluTanh(1)).toBeCloseTo(0.8412, 3);
    expect(geluTanh(-1)).toBeCloseTo(-0.1588, 3);
    expect(geluTanh(3)).toBeCloseTo(2.9964, 3);
  });
});

describe("layerNorm", () => {
  it("normalizes each row to zero mean and unit variance", () => {
    const x = new Float32Array([1, 2, 3, 4, 10, 20, 30, 40]);
    const ones = new Float32Array([1, 1, 1, 1]);
    const zeros = new Float32Array(4);
    const y = layerNorm(x, 2, 4, ones, zeros);
    for (let row = 0; row < 2; row++) {
      let mean = 0;
      let variance = 0;
      for (let j = 0; j < 4; j++) mean += y[row * 4 + j];
      mean /= 4;
      for (let j = 0; j < 4; j++) variance += (y[row * 4 + j] - mean) ** 2;
      variance /= 4;
      expect(mean).toBeCloseTo(0, 5);
      expect(variance).toBeCloseTo(1, 3);
    }
  });

  it("applies scale and shift", () => {
    const x = new Float32Array([1, 2, 3, 4]);
    const g = new Float32Array([2, 2, 2, 2]);
    const b = new Float32Array([5, 5, 5, 5]);
    const y = layerNorm(x, 1, 4, g, b);
    const plain = layerNorm(
      x,
      1,
      4,
      new Float32Array([1, 1, 1, 1]),
      new Float32Array(4),
    );
    for (let j = 0; j < 4; j++) {
      expect(y[j]).toBeCloseTo(plain[j] * 2 + 5, 5);
    }
  });
});

describe("softmaxWithTemperature", () => {
  it("sums to 1", () => {
    const probs = softmaxWithTemperature([1, 2, 3, 4], 1);
    const sum = probs.reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 5);
  });

  it("sharpens at low temperature and flattens at high temperature", () => {
    const logits = [1, 2, 3];
    const cold = softmaxWithTemperature(logits, 0.1);
    const warm = softmaxWithTemperature(logits, 1);
    const hot = softmaxWithTemperature(logits, 10);
    expect(cold[2]).toBeGreaterThan(warm[2]);
    expect(hot[2]).toBeLessThan(warm[2]);
    expect(cold[2]).toBeGreaterThan(0.99);
  });
});

describe("topK", () => {
  it("returns the k most probable tokens, highest first", () => {
    const result = topK([0.1, 0.5, 0.15, 0.25], 2, "abcd");
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ id: 1, char: "b" });
    expect(result[1]).toMatchObject({ id: 3, char: "d" });
  });
});

describe("sampleIndex", () => {
  it("walks the cumulative distribution", () => {
    const probs = [0.2, 0.5, 0.3];
    expect(sampleIndex(probs, 0.0)).toBe(0);
    expect(sampleIndex(probs, 0.19)).toBe(0);
    expect(sampleIndex(probs, 0.21)).toBe(1);
    expect(sampleIndex(probs, 0.69)).toBe(1);
    expect(sampleIndex(probs, 0.71)).toBe(2);
    expect(sampleIndex(probs, 0.999999)).toBe(2);
  });
});

describe("tokenizer", () => {
  const manifest: ModelManifest = {
    config: { vocabSize: 3, blockSize: 4, dModel: 2, nHead: 1, nLayer: 0 },
    chars: "abc",
    tensors: [
      { name: "tok_emb", shape: [3, 2], offset: 0 },
      { name: "pos_emb", shape: [4, 2], offset: 6 },
      { name: "ln_f.g", shape: [2], offset: 14 },
      { name: "ln_f.b", shape: [2], offset: 16 },
    ],
    testVector: { prompt: "a", logits: [] },
    meta: { paramCount: 18, valLoss: 0, trainSteps: 0, corpus: "synthetic" },
  };
  const model = new TinyTransformer(manifest, new Float32Array(18));

  it("round-trips text within the charset", () => {
    expect(model.decode(model.encode("abcba"))).toBe("abcba");
  });

  it("drops characters outside the charset", () => {
    expect(model.encode("aXbYc")).toEqual([0, 1, 2]);
    expect(model.sanitize("aXbYc")).toBe("abc");
  });
});

// Parity with PyTorch: replay the test vector baked into the exported
// manifest and require the TypeScript forward pass to reproduce the same
// logits. Skipped only if the trained weights are not present.
const modelDir = fileURLToPath(
  new URL("../../../apps/web/public/models/tiny-shakespeare/", import.meta.url),
);
const trained = existsSync(modelDir + "manifest.json");

describe.skipIf(!trained)("PyTorch parity", () => {
  it("reproduces the exported logits and returns valid attention", () => {
    const manifest = JSON.parse(
      readFileSync(modelDir + "manifest.json", "utf-8"),
    ) as ModelManifest;
    const raw = readFileSync(modelDir + "weights.bin");
    const weights = new Float32Array(
      raw.buffer,
      raw.byteOffset,
      raw.byteLength / 4,
    );
    const model = new TinyTransformer(manifest, weights);

    const ids = model.encode(manifest.testVector.prompt);
    const { logits, attention } = model.forward(ids);

    expect(logits).toHaveLength(manifest.testVector.logits.length);
    let maxDiff = 0;
    for (let i = 0; i < logits.length; i++) {
      maxDiff = Math.max(
        maxDiff,
        Math.abs(logits[i] - manifest.testVector.logits[i]),
      );
    }
    expect(maxDiff).toBeLessThan(5e-3);

    expect(attention).toHaveLength(manifest.config.nLayer);
    for (const layer of attention) {
      expect(layer).toHaveLength(manifest.config.nHead);
      for (const head of layer) {
        expect(head).toHaveLength(ids.length);
        const sum = head.reduce((a, b) => a + b, 0);
        expect(sum).toBeCloseTo(1, 4);
      }
    }
  });
});
