import { useCallback } from "react";
import { useAppContext } from "../context";
import { Actions } from "../state";
import { fetchData } from "../utils/api";
import { cleanObject } from "../utils/urls";
import { Location } from "../../types";

const useApi = () => {
  const {
    state: {
      locationIds,
      selectedEvent = "",
      clientId: ClientId = "",
      eventDriven: eventdriven,
      widgetKey: widgetkey = "",
      selectedLocation,
      agentId,
    },
    dispatch,
  } = useAppContext();

  const retrieveEvents = useCallback(async (locations: string) => {
    dispatch({ type: Actions.LOADING, payload: true });

    try {
      const data = await fetchData(
        "events",
        cleanObject({
          eDataLocationId: locations,
          widgetkey,
          eventdriven,
        })
      );

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
      const data = await fetchData(
        "locations",
        cleanObject({
          ArrayeDataLocationId: locationIds?.split(","),
          ClientId,
          evid: selectedEvent?.id,
          widgetkey,
        })
      );

      dispatch({
        type: Actions.SET_LOCATIONS,
        payload: data.map(
          ({
            DefaultWidgetType,
            ID,
            LocationId,
            Name,
            RateID,
            Latitude,
            Longitude,
          }: Location) => ({
            locationId: LocationId,
            id: ID,
            modes: DefaultWidgetType,
            label: Name,
            rid: RateID,
            lat: Latitude,
            lng: Longitude,
          })
        ),
      });

      if (data.length === 1) {
        dispatch({ type: Actions.SELECTED_LOCATION, payload: data[0].LocationId });
      }
    } catch (error) {
      dispatch({ type: Actions.LOADING, payload: false });
    }
  }, [selectedEvent?.id, locationIds]);

  const retrieveSeasonTickets = useCallback(
    async ({
      IsMPS = false,
      IsFEP = false,
      IsFAP = false,
      IsMUP = false,
    }: {
      IsMUP?: boolean;
      IsMPS?: boolean;
      IsFEP?: boolean;
      IsFAP?: boolean;
    }) => {
      dispatch({ type: Actions.LOADING, payload: true });

      let params: Record<string, string | boolean> = {
        eDataLocationId: locationIds?.split(","),
        WidgetKey: widgetkey,
      };

      if (!IsMUP) {
        params = {
          ...params,
          IsMPS,
          IsFEP,
          IsFAP,
          AgentId: agentId,
        };
      }

      try {
        const data = await fetchData(
          IsMUP ? "passes" : "seasontickets",
          cleanObject(params)
        );

        dispatch({ type: Actions.SET_SEASON_TICKETS, payload: data });

        if (data.length === 1) {
          dispatch({ type: Actions.SET_RATE, payload: data[0].Id });
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
