export const initialState = {
  isLoading: true,
  locations: null,
  events: null,
};

export const appReducer = (state, { type, payload }) => {

  console.log(state);
  console.log( type, payload);
  
  switch (type) {
    case "loading":
      return {
        ...state,
        isLoading: payload,
      };
    case "events":
      return {
        ...state,
        events: state,
      };
    case "locations":
      return {
        ...state,
        locations: state,
      };
    default:
      return {
        ...state,
      };
  }
};
