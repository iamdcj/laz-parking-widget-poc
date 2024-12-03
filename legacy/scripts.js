grsdefine([], function () {
  return function () {
    var LAZWidget = LAZWidget || {};

    LAZWidget.Main = {
      InvokeRates: function () {
        if (FixedAccessMode) {
          var timezoneDateString = lazGoLocations[0].TimeZoneDate;
          timezoneDateString = timezoneDateString.split(".")[0];
          timezoneDate = new Date(timezoneDateString);
          var minutes = LAZWidget.UI.TimeDiff();
          var nextAvailableDate = "";
          var isfixedStartTime = false;
          timezoneDate.setMinutes(timezoneDate.getMinutes() + minutes);
          var duration = 0;
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
          var startDate =
            $("#LAZ_FixedAccessDateTb").val() === ""
              ? ""
              : new Date($("#LAZ_FixedAccessDateTb").val());
          //   startDate = new Date(startDate.format(WidgetSettings.DateFormatLib) + ' ' + $('#LAZ_FixedAccessTimeTb').val());
          if (startDate !== undefined && startDate !== "") {
            startDate = new Date(
              startDate.format(WidgetSettings.DateFormatLib) +
                " " +
                $("#LAZ_FixedAccessTimeTb").val()
            );
            LAZWidget.UI.HideRateError();
            //GRSDESK-3298 pass start and end time as a parameter and start time must be less than end time.
            var startDateStr =
              startDate.format(WidgetSettings.DateFormatLib) +
              " " +
              $("#LAZ_FixedAccessTimeTb").val();
            if (Date.parse(timezoneDate) > Date.parse(startDateStr) === true) {
              //if fixedAccessTime is passed away then set current time of the timezone date
              startDateStr = moment(timezoneDate).format(
                "ddd, MMM DD, YYYY hh:mm A"
              );
            }
            if (nextAvailableDate === "") {
              nextAvailableDate = new Date(startDateStr);
              nextAvailableDate.setMinutes(
                new Date(startDateStr).getMinutes() + duration
              );
            }
            var endDateStr = new Date(nextAvailableDate.toLocaleString())
              .format(
                WidgetSettings.DateFormatLib +
                  " " +
                  WidgetSettings.TimeFormatLib
              )
              .toLocaleString();
            endDateStr =
              endDateStr === undefined || endDateStr === ""
                ? startDateStr
                : endDateStr;

            var qParam =
              "&start=" +
              startDateStr +
              "&end=" +
              endDateStr +
              "&fst=" +
              isfixedStartTime +
              "&t=r&wt=fap&rid=" +
              WidgetValues.SelectedFAPID +
              "&duration=" +
              duration;
            if (WidgetSettings.SalesChannelKey !== "")
              qParam += "&sc=" + WidgetSettings.SalesChannelKey;

            LAZWidget.Helpers.OpenWindow(qParam);
          } else {
            LAZWidget.UI.ShowRateError();
          }
          return;
        }

        if (TimedMode) {
          var locationDateString = lazGoLocations[0].TimeZoneDate;
          locationDateString = locationDateString.split(".")[0];
          var locationstartDateTime = new Date(locationDateString);
          var minutes = LAZWidget.UI.TimeDiff();
          locationstartDateTime.setMinutes(
            locationstartDateTime.getMinutes() + minutes
          );
          var startDate = moment(new Date($("#LAZ_ArriveDateTb").val())).format(
            "ddd, MMM DD, YYYY"
          );
          var startDateStr = startDate + " " + $("#LAZ_ArriveTimeTb").val();
          //if selected date-time is passed then startDate-time set to current locationTime.
          if (
            Date.parse(locationstartDateTime) >
            Date.parse(new Date(startDateStr))
          ) {
            startDateStr = moment(locationstartDateTime).format(
              "ddd, MMM DD, YYYY hh:mm A"
            );
          }
        }

        if (PassTypeMode) {
          var timezoneDate = lazGoLocations[0].TimeZoneDate.split(".")[0];
          var startDate = new Date(timezoneDate);
          var startDateStr = moment(startDate).format(_dateFormatLib);
          var pId = $("#PassTypeSel").val();
          var passObj = $.grep(
            WidgetSettings.PassTypesJSON,
            function (value, index) {
              return value.Id === Number(pId);
            }
          )[0];

          var actualTime =
            moment(startDate).format("YYYY/MM/DD") + " " + passObj.StartTime;
          if (Date.parse(actualTime) > Date.parse(startDate)) {
            //for future time, starttime = actualTime
            startDateStr = moment(actualTime).format(_dateFormatLib);
          }

          var edate = new Date(startDate);
          edate.setMinutes(edate.getMinutes() + passObj.Duration);
          endDateStr =
            moment(edate).format("ddd, MMM DD, YYYY") + " " + passObj.EndTime;
        }
      },
    };
  };
});
