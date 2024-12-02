LAZWidget.Helpers = {
    OpenWindow: function (parameters) {
      var LocationPart = "",
        WidgetKeyPart = "",
        AgentIdPart = "";

      var SelectedISOCode = $.trim($("#LanguageSelector").val());

      var width = 800,
        height = 600,
        left = screen.width / 2 - width / 2,
        top = screen.height / 2 - height / 2;

      if (SelectedISOCode.length == 0) SelectedISOCode = "US";

      if (WidgetValues.SelectedLID !== "0")
        LocationPart = "?l=" + LocationPart + WidgetValues.SelectedLID;

      if (WidgetSettings.WidgetKey !== "")
        WidgetKeyPart = "&wk=" + WidgetKeyPart + WidgetSettings.WidgetKey;

      if (WidgetSettings.AgentId !== "")
        AgentIdPart = "&aid=" + WidgetSettings.AgentId;

      var _lid = WidgetValues.SelectedLID;

      // Uncomment the line below to limit which locations have access to the new customer flow
      //if (_lid === '297' || _lid === '11385')

      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      )
        WidgetSettings.WidgetRedirect = WidgetSettings.WidgetSwitcherRedirect;

      if (LocationPart == "" && parameters.indexOf("&") == 0)
        parameters = "?" + parameters.substring(1, parameters.length);

      // Build final URL
      var URL =
        WidgetSettings.WidgetRedirect +
        LocationPart +
        parameters +
        "&isocode=" +
        SelectedISOCode +
        WidgetKeyPart +
        AgentIdPart;

      if (!WidgetSettings.UseFullWidget) {
        if (WidgetSettings.ISCurrentPage === false)
          window.open(
            URL,
            "_blank",
            "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=" +
              width +
              "px,height=" +
              height +
              "px,modal=yes,alwaysRaised=yes,top=" +
              top +
              "px,left=" +
              left +
              "px"
          );
        else
          window.open(
            URL,
            "_self",
            "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=" +
              width +
              "px,height=" +
              height +
              "px,modal=yes,alwaysRaised=yes,top=" +
              top +
              "px,left=" +
              left +
              "px"
          );
      } else window.location.href = URL;
    },
    OpenCustomWindow: function (URL) {
      var LocationPart = "",
        WidgetKeyPart = "",
        AgentIdPart = "";

      var SelectedISOCode = $.trim($("#LanguageSelector").val());

      var width = 800,
        height = 600,
        left = screen.width / 2 - width / 2,
        top = screen.height / 2 - height / 2;
      $(".side-menu").toggleClass("open");
      window.open(
        URL,
        "_blank",
        "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=" +
          width +
          "px,height=" +
          height +
          "px,modal=yes,alwaysRaised=yes,top=" +
          top +
          "px,left=" +
          left +
          "px"
      );
    },
    // Rounds a datetime object to the next half hour
    Round2NextHalfHour: function (date, forceStandardTime) {
      var hour = date.getHours("H");
      var inMinute = date.getMinutes("i"),
        minute = date.getMinutes("i") > 30 ? "30" : "00";
      if (inMinute >= 15 && inMinute < 45) minute = "30";
      else if (inMinute >= 45) {
        minute = "00";
        hour = hour + 1;
      } else minute = "00";

      if (forceStandardTime)
        return widget.helpers.fnTimeMilitaryToStandard(hour + ":" + minute);

      return hour + ":" + minute;
    },
    // Uses datetime arithmetic to determine if the start and end dates/times are valid
    ValidateParkingDate: function () {
      // Only validate when in timed mode
      if (!$("#LAZ_UseTimedRb").prop("checked")) return true;

      var _StartDate = $("#LAZ_ArriveDateTb").val(),
        _StartTime = $("#LAZ_ArriveTimeTb").val(),
        _EndDate = $("#LAZ_DepartDateTb").val(),
        _EndTime = $("#LAZ_DepartTimeTb").val(),
        _Valid = false,
        dtFormat = "ddd, MMM D, YYYY hh:mm A";

      if (
        _StartDate != "" &&
        _StartTime != "" &&
        _EndDate != "" &&
        _EndTime != ""
      ) {
        if (
          Date.parse(_StartDate + " " + _StartTime) <
          Date.parse(_EndDate + " " + _EndTime)
        ) {
          LAZWidget.UI.HideRateError();
          _Valid = true;
        }

        //if (moment(_StartDate + ' ' + _StartTime, dtFormat).isBefore(moment(_EndDate + ' ' + _EndTime, dtFormat))) {
        //    LAZWidget.UI.HideRateError();
        //    _Valid = true;
        //}
      }

      // Show the rate error if the date/times are not valid
      if (_Valid === false) LAZWidget.UI.ShowRateError();

      return _Valid;
    },
    ValidateMonthlyParkingDate: function () {
      // Only validate when in monthly mode
      if (!$("#LAZ_UseMonthlyRb").prop("checked")) return true;

      var _StartDate = $("#LAZ_MonthlyDateTb").val(),
        _Valid = false;

      if (
        _StartDate != "" &&
        moment(_StartDate, "YYYY-MM-DD").isValid() === false
      ) {
        LAZWidget.UI.HideRateError();
        _Valid = true;
      }

      // Show the rate error if the date/times are not valid
      if (_Valid === false) LAZWidget.UI.ShowRateError();

      return _Valid;
    },
  };
