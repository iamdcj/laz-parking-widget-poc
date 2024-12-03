import { useCallback } from "react";
import { useAppContext } from "../context";
import { Actions } from "../state";
import { fetchData } from "../utils/api";
import { cleanObject } from "../utils/urls";
import { Location, ModesTable } from "../../types";
import dayjs from "dayjs";

type APITimezones =
  | "Eastern Standard Time"
  | "Mountain Standard Time"
  | "Central Time"
  | "Pacific Standard Time"
  | "Alaska Standard Time"
  | "Hawaii-Aleutian Standard Time";

enum FormattedTimezones {
  "Eastern Standard Time" = "America/New_York",
  "Mountain Standard Time" = "America/Denver",
  "Central Time" = "America/Chicago",
  "Pacific Standard Time" = "America/Los_Angeles",
  "Alaska Standard Time" = "America/Anchorage",
  "Hawaii-Aleutian Standard Time" = "Honolulu",
}

const useApi = () => {
  const {
    state: {
      locationIds,
      selectedEvent = "",
      clientId: ClientId = "",
      eventDriven: eventdriven,
      widgetKey: widgetkey = "",
      selectedLocation,
      selectedMode,
      modeOverwrite,
      modes,
      agentId,
      labels,
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
        eDataLocationId: selectedLocation.id,
      });

      dispatch({
        type: Actions.SET_TIME_INCREMENTS,
        payload: [
          {
            Display: labels.PARKRIGHTNOW,
            Duration: "00M",
          },
          {
            Display: "7 days",
            Duration: "07D",
          },
          {
            Display: "3 Hours",
            Duration: "03h",
          },
          ...data,
        ],
      });
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

      const locations = data.map(
        ({
          DefaultWidgetType,
          ID,
          LocationId,
          Name,
          RateID,
          Latitude,
          Longitude,
          Status,
          TimeZoneDate,
          City,
          TimeZone,
        }: Location) => ({
          locationId: LocationId,
          city: City?.trim(),
          currentDate: dayjs(),
          status: Status,
          id: ID,
          modes: modeOverwrite ? modes : DefaultWidgetType,
          timeZoneDate: dayjs(TimeZoneDate),
          timeZone: TimeZone,
          label: Name,
          rid: RateID,
          lat: Latitude,
          lng: Longitude,
        })
      );

      dispatch({
        type: Actions.SET_LOCATIONS,
        payload: locations,
      });

      dispatch({
        type: Actions.SET_TIMEZONE,
        payload: FormattedTimezones[locations[0].timeZone as APITimezones],
      });

      if (data.length === 1) {
        dispatch({ type: Actions.SELECTED_LOCATION, payload: locations[0] });
      }
    } catch (error) {
      dispatch({ type: Actions.LOADING, payload: false });
    }
  }, [selectedEvent?.id, locationIds]);

  const retrieveSeasonTickets = useCallback(async () => {
    dispatch({ type: Actions.LOADING, payload: true });
    const IsMUP = selectedMode === ModesTable.MUP;

    let params: Record<string, string | boolean> = {
      WidgetKey: widgetkey,
      eDataLocationId: selectedLocation.id,
    };

    if (!IsMUP) {
      params = {
        ...params,
        IsMPS: selectedMode === ModesTable.MUP,
        IsFEP: selectedMode === ModesTable.FEP,
        IsFAP: selectedMode === ModesTable.FAP,
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
        const pass = data[0];
        dispatch({ type: Actions.SET_PASS, payload: pass.RateId || pass.Id });
      }
    } catch (error) {
      dispatch({ type: Actions.LOADING, payload: false });
    }
  }, [locationIds, selectedLocation]);

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
