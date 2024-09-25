
export type Mode = "TMD" | "EVT" | "PST" | "MUP" | "FAP" | "FEX" | "FEP"

export type Component = Record<string, () => React.JSX.Element | null>;
