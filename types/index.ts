import { Dayjs } from "dayjs";

export type Modes = "TMD" | "EVT" | "PST" | "MUP" | "FAP" | "FEX" | "FEP";

export enum ModesTable {
  TMD = "TMD",
  EVT = "EVT",
  PST = "PST",
  MUP = "MUP",
  FAP = "FAP",
  FEX = "FEX",
  FEP = "FEP",
}

export type Component = Record<string, () => React.JSX.Element | null>;

export type Location = {
  LocationId: number;
  ID: string;
  LocNo: string;
  Name: string;
  Latitude: number;
  Longitude: number;
  DefaultWidgetType: string;
  DefaultCustomerFlow: string;
  ImageUrl: string;
  TimeZone: string;
  RateID: number;
  Status: string | null;
  TimeZoneDate: string;
  Address1: string;
  City: string;
  State: string;
  Zip: string;
};

export interface AppDefaults {
  agentId: string;
  arriveOffset: number;
  clientId: string;
  currentPage: boolean;
  departOffset: number;
  endTime: string;
  eventDriven: boolean;
  evid: string;
  hideEventDateTime: boolean;
  labels: Record<string, string>;
  locationIds: string;
  apiKey: string;
  mapLocationLat: number;
  mapLocationLng: number;
  mapLocationText: string;
  mapZoom: number;
  modesOverride: null | string[];
  salesChannelKey: string;
  startTime: string;
  useFullWidget: boolean;
  useMap: boolean;
  variant: "basic" | "map";
  widgetKey: string;
}

export interface Settings extends AppDefaults {
  isHeaderEnabled: boolean;
  headerText: string;
  language: "EN" | "FR";
  theme: null | JSON;
  buttonText: string;
  selectedMode: string | null;
}

export interface InitialState extends AppDefaults {
  bounds: any | null;
  duration: null | string;
  events: null | string[];
  focusedLocation: null | string;
  isLoading: boolean;
  isInitializing: boolean;
  locations: null | string[];
  modes: string[] | null;
  selectedPass: null | Record<string, string>;
  seasonTickets: null | any[];
  selectedDuration: null | string;
  selectedEvent: { id: string; label: string } | null;
  selectedLocation: null | string;
  selectedMode: null | string;
  showSidebar: boolean;
  times: {
    start: null;
    end: null;
  };
  timeIncrements: null | any[];
  timezone: string;
}

type DateTime = string | Dayjs | null;

export interface LinkParams {
  times?: {
    start: DateTime;
    end: DateTime;
  };
  duration?: string;
  widgetKey?: string;
  mode?: string;
  rid?: string;
  l?: string;
  evid?: string;
  wk?: string;
  aid?: string;
  sc?: string;
}
