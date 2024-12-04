grsdefine([], function () {
  return function () {
    var LAZWidget = LAZWidget || {};

    LAZWidget.Main = {
      InvokeRates: function () {
        if (FixedAccessMode) {
          if (
            WidgetSettings.FixedAccessJSON !== null &&
            WidgetSettings.FixedAccessJSON.length > 0
          ) {
            var seasonticket = $.grep(
              WidgetSettings.FixedAccessJSON,
              function (x) {
                return x.Id === parseInt(WidgetValues.SelectedFAPID);
              }
            );
            if (
              seasonticket !== null &&
              seasonticket.length > 0 &&
              seasonticket[0].NextAvailableDate !== ""
            ) {
              //GRSDESK-3298 set nextAvailableTime
              duration =
                seasonticket[0].Duration === undefined
                  ? 0
                  : seasonticket[0].Duration;
              if (seasonticket[0].FixedStartTime === true) {
                isfixedStartTime = true;
                //GRSDESK-3650
                var rstartDate =
                  $("#LAZ_FixedAccessDateTb").val() === ""
                    ? ""
                    : new Date($("#LAZ_FixedAccessDateTb").val());
                var startDate =
                  $("#LAZ_FixedAccessDateTb").val() === ""
                    ? ""
                    : new Date($("#LAZ_FixedAccessDateTb").val());

                //for same day
                if (
                  Date.parse(rstartDate.toLocaleDateString()) ===
                  Date.parse(new Date(timezoneDate.toLocaleDateString()))
                ) {
                  //get fixed startTime
                  var fixedstartDate = new Date(
                    rstartDate.format(WidgetSettings.DateFormatLib) +
                      " " +
                      seasonticket[0].StartTime
                  );
                  if (
                    Date.parse(timezoneDate) > Date.parse(fixedstartDate) ===
                    true
                  ) {
                    //if fixedAccessTime is passed away then set current time of the timezone date
                    var currentTime = timezoneDate
                      .format(WidgetSettings.TimeFormatLib)
                      .toLocaleString();
                    $("#LAZ_FixedAccessTimeTb").val(currentTime);
                    nextAvailableDate = new Date(fixedstartDate);
                    nextAvailableDate.setMinutes(
                      nextAvailableDate.getMinutes() + duration
                    );
                  } else {
                    //for same day and future time
                    $("#LAZ_FixedAccessTimeTb").val(seasonticket[0].StartTime);
                  }
                  //LAZWidget.UI.SetDefaultTime($('#LAZ_FixedAccessTimeTb'));
                } else {
                  var nextAvailableTime = seasonticket[0].StartTime;
                  $("#LAZ_FixedAccessTimeTb").val(nextAvailableTime);
                }
              }
            } else LAZWidget.UI.SetDefaultTime($("#LAZ_FixedAccessTimeTb"));
          } else LAZWidget.UI.SetDefaultTime($("#LAZ_FixedAccessTimeTb"));
        }
      },
    };
  };
});
