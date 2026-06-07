export type ModelInfo = {
  model_version: string | null;
  algorithm: string;
  accuracy: number | null;
  macro_f1: number | null;
  categories: string[];
  model_loaded: boolean;
};
