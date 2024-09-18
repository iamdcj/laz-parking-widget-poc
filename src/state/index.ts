export interface InitialState {
  isLoading: boolean;
  locations: any[] | null;
  events: any[] | null;
}

export const initialState: InitialState = {
  isLoading: true,
  locations: null,
  events: null,
};

export const appReducer = (state: InitialState, action: { type: string, payload: any}) => {
  const { type, payload } = action

  switch (type) {
    case "loading":
      return {
        ...state,
        isLoading: payload,
      };
    case "events":
      return {
        ...state,
        events: payload,
      };
    case "locations":
      return {
        ...state,
        locations: payload,
      };
    case "focused_location":
      return {
        ...state,
        focusedLocation: payload,
      };
    case "selected_location":
      return {
        ...state,
        selectedLocation: payload,
      };

    case "selected_event":
      return {
        ...state,
        selectedEvent: payload,
      };
    default:
      return initialState;
  }
};
