import { useCallback, useEffect, useState } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useAppContext } from "../../context";
import { getUrlParam } from "../../utils/urls";
import useApi from "../../hooks/useApi";
import { Actions } from "../../state";

export const useMapSetup = (useLocations = false) => {
  const {
    state: { locations, bounds, variant },
    dispatch,
  } = useAppContext();
  const map = useMap();
  const core = useMapsLibrary("core");
  const [center, setCenter] = useState(null);
  const geocoding = useMapsLibrary("geocoding");
  const { location: geolocation } = getUrlParam();
  const { retrieveLocationsByBounds } = useApi();
  const isMap = variant === "map";

  async function getAddressPosition() {
    const address = geolocation ? geolocation : "New York, USA";

    try {
      const geocoder = new geocoding.Geocoder();
      const response = await geocoder.geocode({ address });

      if (!response.results || response.results.length < 1) {
        throw new Error("Unable to perform geocode lookup");
      }

      const location = response.results[0];
      const bounds = location.geometry.bounds.toJSON();

      setCenter(location.geometry.bounds.getCenter());

      dispatch({
        type: Actions.SET_BOUNDS,
        payload: bounds,
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  const fitMapBoundsUsingLocations = useCallback(() => {
    const bound = new core.LatLngBounds();

    locations.forEach(({ lat, lng }: { lat: number; lng: number }) => {
      bound.extend(new core.LatLng(lat, lng));
    });

    return map.fitBounds(bound, { left: useLocations ? 0 : 300 });
  }, [core, locations, map]);

  useEffect(() => {
    if (useLocations || !geocoding || !isMap) return;

    getAddressPosition();
  }, [geocoding]);

  useEffect(() => {
    if (useLocations || !bounds) return;

    retrieveLocationsByBounds({
      nelat: bounds.north,
      nelng: bounds.east,
      swlat: bounds.south,
      swlng: bounds.west,
    });
  }, [bounds?.north]);

  useEffect(() => {
    if (!useLocations || !core || !locations || !map) return;

    fitMapBoundsUsingLocations();
  }, [locations, core, map]);

  return [center, fitMapBoundsUsingLocations];
};

// ResetMap: function () {
//   if (lazGoMap.map == null) return;
//   lazGoMap.map.setCenter(LAZWidget.UI.GetMapBounds().getCenter());
//   lazGoMap.map.setZoom(parseInt(lazGoMap.zoom));
// },
// GetMapBounds: function () {
//   var bound = new google.maps.LatLngBounds();

//   for (i = 0; i < lazGoLocations.length; i++) {
//     bound.extend(
//       new google.maps.LatLng(
//         lazGoLocations[i].Latitude,
//         lazGoLocations[i].Longitude
//       )
//     );
//   }

//   if (lazGoMap.placeLat !== 0 && lazGoMap.placeLng !== 0)
//     bound.extend(
//       new google.maps.LatLng(lazGoMap.placeLat, lazGoMap.placeLng)
//     );

//   return bound;
// },

// BuildMap: function () {
//   if (lazGoMap.map !== null) {
//     var _marker = $.grep(lazGoMap.markers, function (m) {
//       return m.id == parseInt(WidgetValues.SelectedLID);
//     });
//     if (_marker.length !== 0)
//       _marker[0].setIcon(
//         "//grs.lazparking.com/facilityfinder/images/laz_icon_rollover.png"
//       );
//     return;
//   }
//   if (WidgetSettings.LocationIDs.length > 1) {
//     lazGoMap.zoom = LAZWidget.UI.ZoomLevel();
//   }
//   lazGoMap.map = new google.maps.Map($("#lazGoMapDiv").get(0), {
//     center: LAZWidget.UI.GetMapBounds().getCenter(),
//     zoom: parseInt(lazGoMap.zoom),
//     zoomControl: true,
//   });

//   if (lazGoMap.placeLat !== 0 && lazGoMap.placeLng !== 0) {
//     var marker = new google.maps.Marker({
//       position: new google.maps.LatLng(
//         lazGoMap.placeLat,
//         lazGoMap.placeLng
//       ),
//       map: lazGoMap.map,
//       title: lazGoMap.placeTxt,
//     });
//   }

//   var _imageBase = "//grs.lazparking.com/facilityfinder/images/laz_icon";
//   for (i = 0; i < lazGoLocations.length; i++) {
//     var _loc = lazGoLocations[i];

//     var marker = new google.maps.Marker({
//       position: new google.maps.LatLng(
//         lazGoLocations[i].Latitude,
//         lazGoLocations[i].Longitude
//       ),
//       map: lazGoMap.map,
//       title: lazGoLocations[i].Name,
//       icon:
//         WidgetValues.SelectedLID == _loc.ID
//           ? _imageBase + "_rollover.png"
//           : _imageBase + ".png",
//       id: lazGoLocations[i].ID,
//       index: i,
//     });
//     marker.addListener("mouseover", function () {
//       LAZWidget.UI.NormalizeMarkerIcons();
//       $("#LAZ_Locations_Select .active-result").removeClass(
//         "highlighted"
//       );
//       var _index = this.index;
//       if (lazGoLocations.length > 1) _index = _index + 1;
//       $($("#LAZ_Locations_Select .active-result")[_index]).addClass(
//         "highlighted"
//       );
//       lazGoMap.markers[this.index].setIcon(
//         "//grs.lazparking.com/facilityfinder/images/laz_icon_rollover.png"
//       );
//     });
//     marker.addListener("mouseout", function () {
//       $("#LAZ_Locations_Select .active-result").removeClass(
//         "highlighted"
//       );
//       var _index = this.index;
//       if (lazGoLocations.length > 1) _index = _index + 1;
//       LAZWidget.UI.NormalizeMarkerIcons(this.index);
//     });
//     marker.addListener("click", function (e) {
//       window.event.preventDefault();
//       $("#park-location").val(this.id);
//       $("#park-location").trigger("chosen:updated");
//       $("#park-location").trigger("change");
//       $("#park-location").trigger("chosen:close");
//     });
//     lazGoMap.markers.push(marker);
//   }
// },
