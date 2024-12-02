grsdefine([], function () {
  return function () {
    var LAZWidget = LAZWidget || {};

    LAZWidget.Main = {
      // TODO : What is this?
      SpecialHandlers: function (lid) {
        // Special event handler for rosebowl website
        if (lid === "1680") {
          $($("#LAZ_Widget").parents("dd"))
            .prev()
            .on("click", function () {
              grsrequirejs(["jquery"], function (a) {
                a("#LAZ_Widget").LAZParkingWidget({});
              });
            });
        }
      },
      //Invoke rates
      InvokeRates: function () {
        var dateTimeFormat =
          WidgetSettings.DateFormatLib + " " + WidgetSettings.TimeFormatLib;

        //Sets EndDateTime in PresetMode
        if (PresetMode) {
          var PSTDuration = 0;
          if (WidgetSettings.PresetsJSON.length > 0) {
            var PSTObj = $.grep(WidgetSettings.PresetsJSON, function (e) {
              return e.Minutes === $("#PresetTimesSel").val();
            });
            var PSTData = "",
              PSTValue = "";
            if (PSTObj.length > 0) {
              PSTData = PSTObj[0].Minutes;
              (PSTValue = PSTData.substr(PSTData.length - 1)),
                (PSTDuration = parseInt(
                  PSTData.substring(0, PSTData.length - 1),
                  10
                ));
            }
            //convert duration in minutes
            switch (PSTValue.toUpperCase()) {
              case "H":
                PSTDuration = PSTDuration * 60;
                PSTValue = "M";
                break;
              case "D":
                PSTDuration = PSTDuration * 24 * 60;
                PSTValue = "M";
                break;
            }

            if (PSTDuration === 0) PSTDuration = 30;

            var endDate = new Date(locationDateString);

            switch (PSTValue) {
              case "M":
                //endDateTime = new Date(endDate.setMinutes(endDate.getMinutes() + PSTDuration));
                endDateTime = LAZWidget.Helpers.DateAdd(
                  new Date(locationDateString),
                  PSTValue,
                  PSTDuration
                );
                break;
              case "D":
                var MaxDateTime = new Date(locationDateString);
                MaxDateTime.setHours("23", "59", 0, 0);

                var Interval = MaxDateTime.getTime() - startDateTime.getTime(),
                  ArrInterval = LAZWidget.Helpers.DateDurations(Interval),
                  MinInterval = ArrInterval[1] * 60 + ArrInterval[2] + 1;

                if (PSTDuration > 1)
                  //endDateTime = new Date(endDate.setDate(endDate.getDate() + (PSTDuration - 1)));
                  endDateTime = LAZWidget.Helpers.DateAdd(
                    endDateTime,
                    PSTValue,
                    PSTDuration - 1
                  );

                //endDateTime.setMinutes(endDateTime.getMinutes() + MinInterval);
                endDateTime = LAZWidget.Helpers.DateAdd(
                  endDateTime,
                  "M",
                  MinInterval
                );
                break;
            }
          } else {
            endDateTime = endDate.setMinutes(endDate.getMinutes() + 30);
          }
          var minutes = LAZWidget.UI.TimeDiff();
          startDateTime.setMinutes(startDateTime.getMinutes() + minutes);
          endDateTime.setMinutes(endDateTime.getMinutes() + minutes);

          var qParam =
            "&start=" +
            startDateTime.format(dateTimeFormat) +
            "&end=" +
            endDateTime.format(dateTimeFormat) +
            "&t=r&duration=" +
            PSTDuration.toString() +
            "&wt=tmd";
          //var qParam = '&start=' + startDateTime.format(dateTimeFormat) + '&end=' + endDateTime.format(dateTimeFormat) + '&t=r&duration=' + jQuery("#PresetTimesSel").val() ;
          if (WidgetSettings.SalesChannelKey !== "")
            qParam += "&sc=" + WidgetSettings.SalesChannelKey;

          LAZWidget.Helpers.OpenWindow(qParam);
          return;
        }

        if (FixedExpiryMode && WidgetSettings.FixedExpiryJSON.length > 0) {
          if ($("#FixedExpirySel").val() == ("0" || "-1")) {
            return;
          }

          var timezoneDate = lazGoLocations[0].TimeZoneDate.split(".")[0];
          var startDate = new Date(timezoneDate);
          var startDateStr =
            startDate.format(WidgetSettings.DateFormatLib) + " 00:00";
          var endDateStr =
            startDate.format(WidgetSettings.DateFormatLib) + " 23:59";
          var rId = $("#FixedExpirySel").val();
          //var qParam = '&start=' + startDateStr + '&end=' + endDateStr + '&t=r&rid=' + rId + '&wt=fex';
          var qParam = "&t=r&rid=" + rId + "&wt=fex";
          if (WidgetSettings.SalesChannelKey !== "")
            qParam += "&sc=" + WidgetSettings.SalesChannelKey;
          LAZWidget.Helpers.OpenWindow(qParam);
          return;
        }

        if (FixedAccessMode) {
          var timezoneDateString = lazGoLocations[0].TimeZoneDate;
          timezoneDateString = timezoneDateString.split(".")[0];
          timezoneDate = new Date(timezoneDateString);
          var minutes = LAZWidget.UI.TimeDiff();
          var nextAvailableDate = "";
          var isfixedStartTime = false;
          timezoneDate.setMinutes(timezoneDate.getMinutes() + minutes);
          // var startDate = $A.reg['FixedAccessDate'] !== undefined ? $A.reg['FixedAccessDate'].date : undefined;
          //GRSDESK-3298 set start date
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

          var endDate = moment(new Date($("#LAZ_DepartDateTb").val())).format(
            "ddd, MMM DD, YYYY"
          );
          var endDateStr = endDate + " " + $("#LAZ_DepartTimeTb").val();

          var qParam =
            "&start=" + startDateStr + "&end=" + endDateStr + "&t=r&wt=tmd";
          if (WidgetSettings.SalesChannelKey !== "")
            qParam += "&sc=" + WidgetSettings.SalesChannelKey;

          LAZWidget.Helpers.OpenWindow(qParam);
          return;
        }

        if (PassTypeMode) {
          var _dateFormatLib = "ddd, MMM DD, YYYY hh:mm A"; //"yyyy/mm/dd HH:MM TT";
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
          var qParam =
            "&start=" +
            startDateStr +
            "&end=" +
            endDateStr +
            "&t=r&wt=pass&rid=" +
            passObj.RateId;
          if (WidgetSettings.SalesChannelKey !== "")
            qParam += "&sc=" + WidgetSettings.SalesChannelKey;

          LAZWidget.Helpers.OpenWindow(qParam);
          return;
        }
      },
    };
  };
});
