
export type Mode = "TMD" | "EVT" | "PST" | "MUP" | "MPS" | "FAP" | "FEX" | "FEP";

export type Component = Record<string, () => React.JSX.Element | null>;
