import { useCallback } from "react";
import { useAppContext } from "../context";
import { Actions } from "../state";
import { fetchData } from "../utils/api";

const useApi = () => {
  const {
    state: {
      locationIds,
      selectedEvent = "",
      clientId: ClientId = "",
      widgetKey: widgetkey = "",
      selectedLocation,
      agentId,
    },
    dispatch,
  } = useAppContext();

  const retrieveEvents = useCallback(async (locations: string) => {
    dispatch({ type: Actions.LOADING, payload: true });

    try {
      const data = await fetchData("events", {
        eDataLocationId: locations,
        widgetkey,
        eventdriven: widgetkey ? "true" : "false",
      });

      dispatch({ type: Actions.SET_EVENTS, payload: data });
    } catch (error) {
      dispatch({ type: Actions.LOADING, payload: false });
    }
  }, []);

  const retrieveTimeIncrements = useCallback(async () => {
    dispatch({ type: Actions.LOADING, payload: true });

    try {
      const data = await fetchData("time_increments", {
        eDataLocationId: selectedLocation,
      });

      dispatch({ type: Actions.SET_TIME_INCREMENTS, payload: data });
    } catch (error) {
      dispatch({ type: Actions.LOADING, payload: false });
    }
  }, [selectedLocation]);

  const retrieveLocations = useCallback(async () => {
    dispatch({ type: Actions.LOADING, payload: true });

    try {
      const data = await fetchData("locations", {
        ClientId,
        ArrayeDataLocationId: locationIds?.split(","),
        evid: selectedEvent,
        WidgetKey: widgetkey,
      });

      dispatch({ type: Actions.SET_LOCATIONS, payload: data });

      if (data.length === 1) {
        dispatch({ type: Actions.SELECTED_LOCATION, payload: data[0].ID });
      }
    } catch (error) {
      dispatch({ type: Actions.LOADING, payload: false });
    }
  }, [locationIds]);

  const retrieveSeasonTickets = useCallback(
    async ({
      IsMPS = false,
      IsFEP = false,
      IsFAP = false,
    }: {
      IsMPS?: boolean;
      IsFEP?: boolean;
      IsFAP?: boolean;
    }) => {
      dispatch({ type: Actions.LOADING, payload: true });

      try {
        const data = await fetchData("seasontickets", {
          agentId,
          eDataLocationId: locationIds?.split(","),
          evid: selectedEvent,
          WidgetKey: widgetkey,
          IsMPS,
          IsFEP,
          IsFAP,
        });

        dispatch({ type: Actions.SET_SEASON_TICKETS, payload: data });

        if (data.length === 1) {
          dispatch({ type: Actions.SET_SEASON_TICKETS, payload: data });
        }
      } catch (error) {
        dispatch({ type: Actions.LOADING, payload: false });
      }
    },
    [locationIds]
  );

  return {
    retrieveEvents,
    retrieveLocations,
    retrieveTimeIncrements,
    retrieveSeasonTickets,
  };
};

export default useApi;
