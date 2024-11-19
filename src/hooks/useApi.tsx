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
      bounds,
      salesChannelKey = "",
      apiKey: key,
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
      dispatch({ type: Actions.SET_EVENTS, payload: [] });
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
        dispatch({ type: Actions.SELECTED_LOCATION, payload: data[0].ID });
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
        WidgetKey: widgetkey,
        eDataLocationId: selectedLocation,
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
          dispatch({ type: Actions.SET_RATE, payload: data[0].RateId });
        }
      } catch (error) {
        dispatch({ type: Actions.LOADING, payload: false });
      }
    },
    [locationIds, selectedLocation]
  );

  const retrieveLocationsByBounds = useCallback(async (params: any) => {
    dispatch({ type: Actions.LOADING, payload: true });

    const searchParams = new URLSearchParams({
      ...params,
      _: "1621281148859",
      key,
    });

    try {
      const res = await fetch(
        `https://xpark.lazparking.com/api/v1/Locations/FindLocationsByLatLng?${searchParams}`
      );

      if (!res.ok) {
        throw new Error("Unable to retrieve locations");
      }

      const data = await res.json();
      const rates = await retrieveRatesByLocations(data);

      dispatch({
        type: Actions.SET_LOCATIONS,
        payload: data.map(
          ({
            DefaultWidgetType,
            ID,
            Name,
            RateID,
            Latitude,
            Longitude,
            LocNo,
            ImageUrl,
            Address1,
            City,
            State,
            Zip,
          }: Location) => {
            const rateData = rates.find(
              ({ eDataLocationId }: { eDataLocationId: string }) =>
                eDataLocationId === LocNo
            );

            return {
              id: ID,
              modes: DefaultWidgetType,
              label: Name,
              rid: RateID,
              lat: Latitude,
              lng: Longitude,
              imageUrl: ImageUrl,
              address: Address1,
              city: City,
              state: State,
              zipCode: Zip,
            };
          }
        ),
      });
    } catch (error) {
      dispatch({ type: Actions.LOADING, payload: false });
    }
  }, []);

  const retrieveRatesByLocations = useCallback(async (locations: any) => {
    dispatch({ type: Actions.LOADING, payload: true });

    try {
      const res = await fetch(
        `https://grsv2api-a7gkc9becmebc8fq.z01.azurefd.net/api/v1/Rate/GetMultipleRates`,
        {
          method: "POST",
          body: JSON.stringify({
            Criteria: locations.map(({ ID }: { ID: string }) => ({
              LotId: ID,
              ParkingBeginDateTime: "2024/11/07 12:53 PM",
              ParkingEndDateTime: "2024/11/07 2:53 PM",
              SalesChannelKey: salesChannelKey,
            })),
            loadFromSearchCache: true,
          }),
          headers: {
            "content-type": "application/json; charset=utf-8",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Unable to retrieve locations");
      }

      const data = await res.json();

      return JSON.parse(data.d);
    } catch (error) {
      dispatch({ type: Actions.LOADING, payload: false });
    }
  }, []);

  const retrieveLanguages = useCallback(async () => {
    dispatch({ type: Actions.LOADING, payload: true });

    try {
      const languagesRes = await fetch(
        `https://grs-external.lazparking.com/api/system/languages`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json; charset=utf-8",
          },
        }
      );

      if (!languagesRes.ok) {
        throw new Error("Unable to retrieve languages");
      }

      let languages = await languagesRes.json();

      languages = languages.split(",");

      const translationsRes = await fetch(
        "https://grs-external.lazparking.com/api/system/translations",
        {
          method: "POST",
          headers: {
            "content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            ISOLanguageCode: languages[0],
            eDataLocationId: locationIds,
          }),
        }
      );

      if (!translationsRes.ok) {
        throw new Error("Unable to retrieve languages");
      }

      let translations = await translationsRes.json();

      dispatch({ type: Actions.SET_LABELS, payload: translations });
      dispatch({ type: Actions.INITIALIZING, payload: false });
    } catch (error) {
      dispatch({ type: Actions.LOADING, payload: false });
    }
  }, [locationIds]);

  return {
    retrieveLanguages,
    retrieveEvents,
    retrieveLocations,
    retrieveTimeIncrements,
    retrieveSeasonTickets,
    retrieveLocationsByBounds,
  };
};

export default useApi;
