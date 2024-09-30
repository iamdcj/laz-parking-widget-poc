export type Mode = "TMD" | "EVT" | "PST" | "MUP" | "FAP" | "FEX" | "FEP";

export type Component = Record<string, () => React.JSX.Element | null>;

export type Location = {
  LocationId: number;
  ID: string;
  Name: string;
  Latitude: number;
  Longitude: number;
  DefaultWidgetType: string;
  DefaultCustomerFlow: string;
  TimeZone: string;
  RateID: number;
  Status: string | null;
  TimeZoneDate: string;
};
