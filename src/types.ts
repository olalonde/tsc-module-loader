export type Context = {
  conditions: string[];
  importAssertions: Record<string, string>;
  parentURL?: string;
};

export type NextFn = (specifier: string, context: Context) => void;
