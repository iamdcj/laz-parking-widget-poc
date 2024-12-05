// Simple JS for LAZ GRS Widget
// 2014-2017 LAZ
// Interfaces with LAZ' services to retrieve location, preset time and event info

var _LAZGa = "";
var selectedLocation = "";
var lazGoLocations = [];
var lazGoLID = "";
var appStartTime = "";
var version = "20230206V1.0";
var defaultHours = 2;

// Object to hold map specific values
var lazGoMap = {
  map: null,
  zoom: 12,
  markers: [],
  placeLat: 0,
  placeLng: 0,
  placeTxt: "Destination",
};

grsdefine(
  [
    "ServiceMessages",
    "jquery",
    "jquery-ui",
    "timepicker",
    "mustache",
    "settings",
    "language",
    "xdomain",
    "chosen",
    "format",
    "dplocalize",
    "formatlib",
    "maps",
    "moment",
    "cal",
  ],
  function (
    GetServiceMessages,
    $,
    ui,
    tp,
    Mustache,
    Settings,
    Language,
    xdomain,
    chosen,
    format,
    dplocalize,
    formatlib,
    maps,
    cal
  ) {
    return function (options) {
      // Global variables
      var LAZWidget = LAZWidget || {},
        StartTime = new Date();

      var WidgetSettings = {
        BaseURL: "",
        ContentBase: "",
        BrandBase: "",
        WidgetRedirect: "",
        WidgetSwitcherRedirect: "",
        SubPath: "",
        ServicePath: "",
        GoogleAccount: "UA-18633846-31",
        WidgetType: "",
        LocationIDs: [],
        StartDT: null,
        EndDT: null,
        TimeOffsetArrive: null,
        TimeOffsetDepart: null,
        EventID: 0,
        LocationsJSON: [],
        EventsJSON: [],
        PresetsJSON: [],
        FixedAccessJSON: [],
        FixedExpiryJSON: [],
        PassTypesJSON: [],
        Mode: "",
        ClientId: "",
        TemplatePath: "",
        TemplateBase: "",
        DefaultTemplate: "",
        IncludeHeader: true,
        HeaderText: "",
        PresetOffset: "0",
        UseFullWidget: false,
        DateFormatLib: "ddd, mmm d, yyyy",
        TimeFormatLib: "h:MM TT",
        DateFormat: "D, M d, yy",
        TimeFormat: "g:i A",
        WidgetKey: "",
        ShowWidgetBgImage: true,
        ShowWidgetLangSelect: true,
        UseMap: true,
        MapZoom: 12,
        MapPlaceLat: 0,
        MapPlaceLng: 0,
        MapPlaceTxt: "",
        HideEventDate: false,
        AgentId: "",
        ForceNativeControls: false,
        StartTime: "",
        EndTime: "",
        DataModeOverwrite: false,
        BeforeReservationTime: "30",
        ISCurrentPage: false,
        eventdriven: false,
        issoldout: false,
        SalesChannelKey: "",
      };

      var WidgetValues = {
        SelectedEVID: 0,
        SelectedLID: 0,
        SelectedFAPID: 0,
        SelectedFEPID: 0,
        SelectedPassTypeID: 0,
        TimedModeBound: false,
        MonthlyModeBound: false,
        FixedExpiryModeBound: false,
        FixedAccessModeBound: false,
        HideFixedAccessTime: false,
        DefaultMode: "",
      };

      // Set widget paths
      WidgetSettings.BaseURL = Settings.BaseURL;
      WidgetSettings.ContentBase =
        WidgetSettings.BaseURL + Settings.ContentBase;
      WidgetSettings.TemplateBase = Settings.TemplateBaseURL;
      WidgetSettings.DefaultTemplate = Settings.DefaultTemplate;
      WidgetSettings.BrandBase = Settings.BrandBase;
      WidgetSettings.WidgetRedirect = Settings.WidgetRedirect;
      WidgetSettings.WidgetSwitcherRedirect = Settings.WidgetSwitcherRedirect;
      WidgetSettings.UseFullWidget = Settings.UseFullWidget;

      WidgetSettings.SubPath = Settings.SubPath;
      WidgetSettings.ServicePath = Settings.ServicePath;
      WidgetSettings.ShowWidgetBgImage = Settings.ShowWidgetBgImage;
      WidgetSettings.ShowWidgetLangSelect = Settings.ShowWidgetLangSelect;
      WidgetSettings.ISCurrentPage = Settings.ISCurrentPage;

      LAZWidget.Main = {
        // First function called to begin loading the widget
        Initialize: function () {
          // Begin loading dependencies
          this.LoadDependencies();
          this.DefaultSize();
          $("body").click(function () {
            LAZWidget.UI.Setwidgetheight();
          });
        },
        DefaultSize: function () {
          $.browser.device =
            /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
              navigator.userAgent.toLowerCase()
            );
          if ($.browser.device) {
            $("div.page")
              .css("overflow-y", "scroll")
              .addClass("hide-scrollbar");
            $("div.page").css("height", "39rem");
            $("#container-outer")
              .css("padding-top", ".5rem")
              .css("padding-bottom", ".5rem");
            $("body").css("background-color", "#fff!important");
            $(".container").css("padding-left", "0px");
            $(".header-main").css("height", "6rem");
          } else {
            //$("div.page").css("height", "45rem");
            //$("div.page").css("overflow-y", "none").addClass('hide-scrollbar');
            $("div.page").addClass("hide-scrollbar");
            $("div.page").css("height", "auto");
            $("#container-outer")
              .css("padding-top", ".5rem")
              .css("padding-bottom", ".5rem");
            $(".header-main .logo a").css("margin-top", ".7rem");
          }
        },
        // Loads the widget's dependencies into the current web-page
        LoadDependencies: function () {
          $.ajaxSetup({ cache: true });
          LAZWidget.Network.GetStyleSheet(
            "https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.1/themes/smoothness/jquery-ui.min.css"
          );
          LAZWidget.Network.GetStyleSheet(
            WidgetSettings.ContentBase +
              WidgetSettings.SubPath +
              WidgetSettings.BrandBase +
              "css/LAZSimple-Responsive.css?v=202211110000"
          );
          LAZWidget.Network.GetStyleSheet(
            WidgetSettings.ContentBase +
              WidgetSettings.SubPath +
              WidgetSettings.BrandBase +
              "css/LAZSimple.css?v=202210170000"
          );
          LAZWidget.Network.GetStyleSheet(
            WidgetSettings.ContentBase +
              WidgetSettings.SubPath +
              WidgetSettings.BrandBase +
              "css/chosen.css?v=202211100000"
          );
          LAZWidget.Main.StartWidget();
        },

        // Function called after all dependencies loaded
        StartWidget: function () {
          // Load the options passed into the constructor
          this.SetOptions();

          // Set up widget object by loading attribute and query string data
          this.ParseSettings();

          // Configures and loads google analytics script
          LAZWidget.Helpers.LoadAnalytics();

          if (WidgetSettings.eventdriven === true) {
            var locationParam =
              "eDataLocationId=[" + WidgetSettings.LocationIDs.join() + "]";
            //var locationParam = 'eDataLocationId=' + WidgetSettings.LocationIDs.join();
            LAZWidget.Network.GetData(
              "GetEvents",
              locationParam +
                "&widgetkey=" +
                WidgetSettings.WidgetKey +
                "&eventdriven=" +
                WidgetSettings.eventdriven,
              function (result) {
                if (result !== undefined && result.status !== 200) {
                  var firstLoad = true;
                  LAZWidget.UI.InitializeUI(firstLoad, function () {
                    var ServiceMode = "GetEvents";
                    var output = {};
                    LAZWidget.Network.ProcessRequest(ServiceMode, output);
                    $(
                      "#lblOr_MP,#lblOr_PM,#lblOr_ME,#lblOr_MA,#lblOr_AE,#lblOr_ER"
                    ).hide();
                    $("#btnGetRate")
                      .val(Language.objLang.GETRATE)
                      .attr("disabled", "disabled")
                      .css("cursor", "default")
                      .addClass("laz-ff-getRatesButtonDisabled");
                  });
                }
              }
            );
          } else {
            // Get json data for locations the widget is configured for
            LAZWidget.Network.GetData(
              "GetLocations",
              "ClientId=" +
                WidgetSettings.ClientId +
                "&ArrayeDataLocationId=[" +
                WidgetSettings.LocationIDs.join() +
                "]&WidgetKey=" +
                WidgetSettings.WidgetKey,
              function () {
                LAZWidget.Helpers.Log(
                  "Widget Started - " + Math.abs(new Date() - StartTime) + "ms"
                );
              }
            );
          }
        },

        // Sets location options based on those passed in
        SetOptions: function () {
          WidgetSettings.StartDT = options.StartDateTime;
          WidgetSettings.EndDT = options.EndDateTime;
          WidgetSettings.TimeOffsetArrive = options.TimeOffsetArrive;
          WidgetSettings.TimeOffsetDepart = options.TimeOffsetDepart;
          WidgetSettings.LocationIDs = options.FacilityID;
        },

        // Function to get all the widgets settings/options from the query string + attributes
        ParseSettings: function () {
          // Check query string to override element attributes first.
          // Fall back to element attributes next
          var locationIDsStr = "";

          if (LAZWidget.Helpers.GetParameterByName("l") !== "") {
            locationIDsStr = LAZWidget.Helpers.GetParameterByName("l");
          } else {
            locationIDsStr = $("#LAZ_Widget").attr("data-locationid");
          }

          lazGoLID = locationIDsStr;

          // Remove spaces, split by comma delimiter, assign to LocationIDs array
          if (typeof locationIDsStr != "undefined") {
            WidgetSettings.LocationIDs = locationIDsStr
              .replace(/\s+/g, "")
              .split(",");
          }

          // Get event ID from query string. This implies the given event should be selected.
          if (LAZWidget.Helpers.GetParameterByName("evid") !== "") {
            WidgetSettings.EventID =
              LAZWidget.Helpers.GetParameterByName("evid");
          }
          // Get the start datetime from query string to initialise the start date picker and time picker with.
          if (LAZWidget.Helpers.GetParameterByName("start") !== "") {
            WidgetSettings.StartDT =
              LAZWidget.Helpers.GetParameterByName("start");
          }
          // Get the end datetime from query string to initialise the end date picker and time picker with.
          if (LAZWidget.Helpers.GetParameterByName("end") !== "") {
            WidgetSettings.EndDT = LAZWidget.Helpers.GetParameterByName("end");
          }
          // Get whether or not to hide the events start date + time
          if (LAZWidget.Helpers.GetParameterByName("hed") !== "") {
            WidgetSettings.HideEventDate =
              LAZWidget.Helpers.GetParameterByName("hed") === "true";
          }
          // Get the agent ID from the query string
          if (LAZWidget.Helpers.GetParameterByName("aid") !== "") {
            WidgetSettings.AgentId =
              LAZWidget.Helpers.GetParameterByName("aid");
          }

          // Set start and end datetime from local storage (LAZ website)
          try {
            if (
              WidgetSettings.StartDT === null &&
              WidgetSettings.EndDT === null
            ) {
              //var LAZStorageObject = localStorage.getItem('LAZ');
              var LAZStorageObject = null;
              if (LAZStorageObject !== null) {
                var LAZLocalStore = $.parseJSON(LAZStorageObject);
                if (
                  LAZLocalStore.fromDate !== undefined &&
                  LAZLocalStore.toDate !== undefined
                ) {
                  var dfStore = "ddd, MMM D, YYYY H:m A",
                    targetFormat = "YYYY-MM-DD h:m A";
                  WidgetSettings.StartDT = moment(
                    LAZLocalStore.fromDate + " " + LAZLocalStore.fromTime,
                    dfStore
                  ).format(targetFormat);
                  WidgetSettings.EndDT = moment(
                    LAZLocalStore.toDate + " " + LAZLocalStore.toTime,
                    dfStore
                  ).format(targetFormat);
                }
              }
            }
          } catch (ex) {}

          // Arrival time offset in minutes
          var arriveOffsetAttr = $("#LAZ_Widget").attr("data-arrive");
          if (typeof arriveOffsetAttr !== "undefined") {
            WidgetSettings.TimeOffsetArrive = arriveOffsetAttr;
          }
          // Departure time offset in minutes
          var departOffsetAttr = $("#LAZ_Widget").attr("data-depart");
          if (typeof departOffsetAttr !== "undefined") {
            WidgetSettings.TimeOffsetDepart = departOffsetAttr;
          }
          // Client ID used for grouping locations together without specifying distinct IDs in the widget's DIV element
          var clientIdAttr = $("#LAZ_Widget").attr("data-clientid");
          if (typeof clientIdAttr !== "undefined") {
            WidgetSettings.ClientId = clientIdAttr;
          }
          // Agent ID used for rates tied to specific agents
          var agentIdAttr = $("#LAZ_Widget").attr("data-agentid");
          if (typeof agentIdAttr !== "undefined") {
            WidgetSettings.AgentId = agentIdAttr;
          }

          // Path of the template the widget is to use
          var TemplatePathAttr = $("#LAZ_Widget").attr("data-template");
          if (typeof TemplatePathAttr !== "undefined") {
            WidgetSettings.TemplatePath = TemplatePathAttr;
          } else {
            WidgetSettings.TemplatePath = WidgetSettings.TemplateBase;
            var isoCode = LAZWidget.Helpers.GetParameterByName("isocode");
            //load template and stub style sheet based on iso language code
            if (isoCode !== "FR") {
              WidgetSettings.TemplatePath =
                WidgetSettings.TemplateBase + WidgetSettings.DefaultTemplate;
              //WidgetSettings.TemplatePath = "http://localhost/laz-simplewidget/templates/LAZDefault.html";
            } else {
              WidgetSettings.TemplatePath =
                WidgetSettings.TemplateBase + "templates/VinciCanada.html";
              LAZWidget.Network.GetStyleSheet(
                WidgetSettings.ContentBase +
                  WidgetSettings.SubPath +
                  WidgetSettings.BrandBase +
                  "/css/LAZSimple_FR.css"
              );
            }
          }

          // Boolean to set whether or not to display the blue widget header
          var isHeaderEnabled = $("#LAZ_Widget").attr("data-header");
          if (typeof isHeaderEnabled !== "undefined") {
            WidgetSettings.IncludeHeader = isHeaderEnabled === "true";
          }

          // Attribute to set the widget's header text
          var headerText = $("#LAZ_Widget").attr("data-header-text");
          if (typeof headerText !== "undefined") {
            WidgetSettings.HeaderText = headerText;
          }

          // Boolean to set whether or not to open the full widget url in a new window or to change the current url
          // and pass parameters to open page 2
          var useFullWidget = $("#LAZ_Widget").attr("data-fullwidget");
          if (typeof useFullWidget !== "undefined") {
            WidgetSettings.UseFullWidget = useFullWidget === "true";
          }

          // Boolean to set whether or not to display the events start date + time
          var hideEventDateTime = $("#LAZ_Widget").attr("data-hide-event-date");
          if (typeof hideEventDateTime !== "undefined") {
            WidgetSettings.HideEventDate = hideEventDateTime === "true";
          }

          // Set the widget's default mode. If there's multiple locations and none are selected by default, the widget will start in this mode
          // Modes: Timed, Event, PresetTime, All

          // Variable to set the default end time of the widget
          //GRSDESK-3611-change-parameter-name-for-custom-data-mode
          var dataModeOverwrite = $("#LAZ_Widget").attr("data-mode-overwrite");
          dataModeOverwrite =
            dataModeOverwrite === undefined || dataModeOverwrite === null
              ? $("#LAZ_Widget").attr("data-mode-overwrtie")
              : dataModeOverwrite;
          if (typeof dataModeOverwrite !== "undefined") {
            WidgetSettings.DataModeOverwrite = JSON.parse(dataModeOverwrite);
          }
          var urlparam = LAZWidget.Helpers.GetParameterByName("wt");
          var htmlparam =
            WidgetSettings.DataModeOverwrite === true
              ? $("#LAZ_Widget").attr("data-mode")
              : "";
          var widgetMode =
            urlparam === "" || urlparam === undefined || urlparam === null
              ? htmlparam
              : urlparam;
          //var widgetMode = $('#LAZ_Widget').attr('data-mode');
          if (typeof widgetMode !== "undefined") {
            widgetMode = widgetMode.toUpperCase();
            WidgetSettings.Mode = widgetMode;
          }

          // Get the widget key
          var widgetKeyAttr = $("#LAZ_Widget").attr("data-wk");
          if (typeof widgetKeyAttr !== "undefined") {
            WidgetSettings.WidgetKey = widgetKeyAttr;
          }

          // Get the widget key from the query string
          if (LAZWidget.Helpers.GetParameterByName("wk") !== "") {
            WidgetSettings.WidgetKey =
              LAZWidget.Helpers.GetParameterByName("wk");
          }

          // Boolean to set whether or not to use the map view for location selection
          var useMap = $("#LAZ_Widget").attr("data-map");
          if (typeof useMap !== "undefined") {
            WidgetSettings.UseMap = useMap === "true";
          }

          // Set the map zoom
          var mapZoom = $("#LAZ_Widget").attr("data-mapzoom");
          if (typeof mapZoom !== "undefined") {
            WidgetSettings.MapZoom = mapZoom;
            lazGoMap.zoom = WidgetSettings.MapZoom;
          }

          var mapLat = $("#LAZ_Widget").attr("data-mapplacelat");
          if (typeof mapLat !== "undefined") {
            WidgetSettings.MapPlaceLat = mapLat;
            lazGoMap.placeLat = mapLat;
          }

          var mapLng = $("#LAZ_Widget").attr("data-mapplacelng");
          if (typeof mapLng !== "undefined") {
            WidgetSettings.MapPlaceLng = mapLng;
            lazGoMap.placeLng = mapLng;
          }

          var mapTxt = $("#LAZ_Widget").attr("data-mapplacetxt");
          if (typeof mapTxt !== "undefined") {
            WidgetSettings.MapPlaceTxt = mapTxt;
            lazGoMap.placeTxt = mapTxt;
          }

          // Variable to set the default start time of the widget
          var startTime = $("#LAZ_Widget").attr("data-starttime");
          if (typeof startTime !== "undefined") {
            WidgetSettings.StartTime = startTime;
          }

          // Variable to set the default end time of the widget
          var endTime = $("#LAZ_Widget").attr("data-endtime");
          if (typeof endTime !== "undefined") {
            WidgetSettings.EndTime = endTime;
          }

          // Special case override to force use of native controls.
          //if (locationIDsStr === '99936328')
          //	WidgetSettings.ForceNativeControls = true;

          // Get the widget key
          var currentPageAttr = $("#LAZ_Widget").attr("data-currentpage");
          if (typeof currentPageAttr !== "undefined") {
            WidgetSettings.ISCurrentPage = Boolean(currentPageAttr);
          }

          var eventdriven = $("#LAZ_Widget").attr("data-eventdriven");
          var urlparam = LAZWidget.Helpers.GetParameterByName("wt").trim();
          if (urlparam != "" && urlparam == "evt") {
            eventdriven = "true";
          }
          if (typeof eventdriven !== "undefined") {
            WidgetSettings.eventdriven = JSON.parse(eventdriven.toLowerCase());
          }

          // Get the sales channel key
          var salesChannelKey = $("#LAZ_Widget").attr("data-sc");
          if (typeof salesChannelKey !== "undefined") {
            WidgetSettings.SalesChannelKey = salesChannelKey;
          }

          // Get the sales channel key from the query string
          if (LAZWidget.Helpers.GetParameterByName("sc") !== "") {
            WidgetSettings.SalesChannelKey =
              LAZWidget.Helpers.GetParameterByName("sc");
          }

          this.SpecialHandlers(locationIDsStr);
        },

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
          // Return if the selected location's ID = 0 or the dates are invalid
          if (
            WidgetSettings.eventdriven === false &&
            (WidgetValues.SelectedLID == 0 ||
              LAZWidget.Helpers.ValidateParkingDate() === false ||
              LAZWidget.Helpers.ValidateMonthlyParkingDate() === false)
          )
            return;

          var MultiUseMode = $("#LAZ_UseMultiUsePassRb").prop("checked"),
            PresetMode = $("#LAZ_UsePresetRb").prop("checked"),
            MonthlyMode = $("#LAZ_UseMonthlyRb").prop("checked"),
            FixedExpiryMode = $("#LAZ_UseFixedExpiryRb").prop("checked"),
            FixedAccessMode = $("#LAZ_UseFixedAccessRb").prop("checked"),
            EventMode = $("#LAZ_UseEventRb").prop("checked"),
            TimedMode = $("#LAZ_UseTimedRb").prop("checked"),
            PassTypeMode = $("#LAZ_UsePassTypeRb").prop("checked");

          if (WidgetSettings.eventdriven === true) {
            EventMode = true;
            PresetMode = false;
            MonthlyMode = false;
            FixedExpiryMode = false;
            FixedAccessMode = false;
            TimedMode = false;
            PassTypeMode = false;
            MultiUseMode = false;
          }
          var locationDateString = lazGoLocations[0].TimeZoneDate;
          locationDateString = locationDateString.split(".")[0];
          var startDateTime = new Date(locationDateString);
          var endDateTime = new Date(locationDateString);
          var dateTimeFormat =
            WidgetSettings.DateFormatLib + " " + WidgetSettings.TimeFormatLib;

          if (MultiUseMode) {
            var minutes = LAZWidget.UI.TimeDiff();
            var startDate = new Date(locationDateString);
            startDate.setMinutes(startDate.getMinutes() + minutes);
            startDate = startDate.format(dateTimeFormat);

            var endDate =
              new Date(locationDateString).format(
                WidgetSettings.DateFormatLib
              ) + " 23:59";
            var qParam =
              "&start=" + startDate + "&end=" + endDate + "&t=r&wt=mup";

            if (WidgetSettings.SalesChannelKey !== "")
              qParam += "&sc=" + WidgetSettings.SalesChannelKey;

            LAZWidget.Helpers.OpenWindow(qParam);
            return;
          }

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

                  var Interval =
                      MaxDateTime.getTime() - startDateTime.getTime(),
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

          if (MonthlyMode) {
            var startDate = $A.reg["MonthlyDate"].date;
            var startDateStr =
              startDate.format(WidgetSettings.DateFormatLib) + " 00:00";
            var locationDate = new Date(
              lazGoLocations[0].TimeZoneDate.split(".")[0]
            );
            var dateTimeFormat = WidgetSettings.DateFormatLib + " " + "HH:MM";
            //check selected date is same date as the location date Time-zone
            if (
              Date.parse(startDate.format(WidgetSettings.DateFormatLib)) ===
              Date.parse(locationDate.format(WidgetSettings.DateFormatLib))
            ) {
              var minutes = LAZWidget.UI.TimeDiff();
              locationDate.setMinutes(locationDate.getMinutes() + minutes);
              startDateStr = locationDate.format(dateTimeFormat);
            }
            var endDateStr =
              startDate.format(WidgetSettings.DateFormatLib) + " 23:59";
            var qParam =
              "&start=" + startDateStr + "&end=" + endDateStr + "&t=r&wt=mps";
            if (WidgetSettings.SalesChannelKey !== "")
              qParam += "&sc=" + WidgetSettings.SalesChannelKey;

            LAZWidget.Helpers.OpenWindow(qParam);
            return;
          }

          if (FixedExpiryMode && WidgetSettings.FixedExpiryJSON.length > 0) {
            // var startDate = $A.reg['FixedExpiryDate'].date;
            // var startDateStr = startDate.format(WidgetSettings.DateFormatLib) + ' 00:00';
            // var endDateStr = startDate.format(WidgetSettings.DateFormatLib) + ' 23:59';

            // var qParam = '&start=' + startDateStr + '&end=' + endDateStr + '&t=r&wt=fex';
            // LAZWidget.Helpers.OpenWindow(qParam);
            // return;

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
                      $("#LAZ_FixedAccessTimeTb").val(
                        seasonticket[0].StartTime
                      );
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
              if (
                Date.parse(timezoneDate) > Date.parse(startDateStr) ===
                true
              ) {
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

          if (EventMode) {
            var qParam = "&evid=" + WidgetValues.SelectedEVID + "&t=e&wt=evt";
            if (WidgetSettings.SalesChannelKey !== "")
              qParam += "&sc=" + WidgetSettings.SalesChannelKey;

            LAZWidget.Helpers.OpenWindow(qParam);
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
            //var startDate = $A.reg['ArrivalDate'].date;
            //var startDateStr = startDate.format(WidgetSettings.DateFormatLib) + ' ' + $('#LAZ_ArriveTimeTb').val();
            //var endDate = $A.reg['DepartureDate'].date;
            //var endDateStr = endDate.format(WidgetSettings.DateFormatLib) + ' ' + $('#LAZ_DepartTimeTb').val();
            var startDate = moment(
              new Date($("#LAZ_ArriveDateTb").val())
            ).format("ddd, MMM DD, YYYY");
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
            //WidgetSettings.PassTypesJSON.push({ PassType: value.RateDetailName, Id: value.id, RateId: value.RateId, Duration: value.Duration, StartTime: value.StartTime, EndTime: value.EndTime
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
            //var qParam = '&eDataLocationId=' + WidgetValues.SelectedLID + '&start=' + startDateStr + '&end=' + endDateStr + '&t=r&wt=pass&rid=' + passObj.RateId;
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

      LAZWidget.SysEvents = {
        // Handles when the GetLocations service call has completed
        LocationsLoaded: function (firstLoad) {
          if (WidgetSettings.eventdriven === true) {
            LAZWidget.SysEvents.BindLocation();
          } else {
            LAZWidget.UI.InitializeUI(firstLoad, function () {
              LAZWidget.SysEvents.BindLocation();
            });
          }
        },
        BindLocation: function () {
          $.get(
            WidgetSettings.TemplateBase + "templates/LAZDefault_Locations.html",
            function (template) {
              var rendered = Mustache.render(template, {
                Locations: WidgetSettings.LocationsJSON,
              });
              $("#LAZ_Locations_Select").html(rendered);
              $("#LAZ_Locations_Select").css("margin-top", "10px");
              // If there's more than one location, set-up the two drop down menus
              if (WidgetSettings.LocationsJSON.length > 1) {
                if (WidgetSettings.eventdriven === true) {
                  $.each($("select#park-location")[0], function (index, item) {
                    var result = $.grep(
                      WidgetSettings.LocationsJSON,
                      function (value, index) {
                        return value.ID === item.value;
                      }
                    );
                    if (result.length > 0) {
                      if (result[0].Status === "1")
                        item.innerHTML =
                          item.innerHTML +
                          " <span style='color:red'>Sold Out</span>";
                    }
                  });
                }
                $("#park-location").prepend(
                  $(
                    '<option selected="selected" data-eventid="000" data-locationId="000" value="0">' +
                      Language.objLang.SELECTLOCATION +
                      "</option>"
                  )
                );
                if (WidgetSettings.eventdriven !== true) {
                  $("#ActiveEventsSel").html(
                    '<option selected="selected" data-eventid="000" data-locationId="000" value="0">' +
                      Language.objLang.NOEVENTSTHISTIME +
                      "</option>"
                  );
                }
                LAZWidget.UI.SelectLocationDefault();
              } else if (WidgetSettings.LocationsJSON.length === 0) {
                $("#park-location").prepend(
                  $(
                    '<option selected="selected" data-eventid="000" data-locationId="000" value="0">No locations available</option>'
                  )
                );
                $("#btnGetRate,.lblOr").hide();
              }
              LAZWidget.UI.SetUpLocationListeners();

              // If there's only one location in the drop down, select it.
              if (WidgetSettings.LocationsJSON.length >= 1) {
                $("#park-location").val("0");
                $("#park-location").trigger("chosen:updated");
                //if (WidgetSettings.eventdriven === false)
                $("#park-location").trigger("change");
                $("#park-location").trigger("chosen:close");
                LAZWidget.UI.SetUpMap();
                if (WidgetSettings.eventdriven === true) {
                  if (
                    WidgetSettings.issoldout === true ||
                    $("#park-location")
                      .text()
                      .includes("Choose a parking location") == true
                  )
                    LAZWidget.UI.DisableGetRateButton();
                  else LAZWidget.UI.EnableGetRateButton();
                }
              } else {
                // Handle 0 location condition
                LAZWidget.UI.DisableLocationsDropDown();
              }
            },
            "text"
          );
        },
        // Handles when the GetPresets service call has completed
        PresetsLoaded: function () {
          LAZWidget.UI.SetUpPresets();
        },

        // Handles when the GetEvents service call has completed
        EventsLoaded: function () {
          LAZWidget.UI.SetUpEvents();
        },
        // Handles when the GetFixedExpiry service call has completed
        FixedExpiryLoaded: function () {
          LAZWidget.UI.SetUpFixedExpiry();
        },

        FixedAccessPassesLoaded: function () {
          LAZWidget.UI.SetUpFixedAccess();
        },

        PassTypeLoaded: function () {
          LAZWidget.UI.SetUpPassType();
        },
      };

      LAZWidget.Network = {
        // Adds style sheets to the current page
        GetStyleSheet: function (Path) {
          $("<link>")
            .appendTo("head")
            .attr({ type: "text/css", rel: "stylesheet" })
            .attr("href", Path);
        },

        // Creates the ajax request to the web service
        GetData: function (ServiceMode, Params, Callback) {
          var ResourceURL = WidgetSettings.ServicePath;
          if (typeof Callback == "undefined") Callback = function () {};
          switch (ServiceMode) {
            case "GetLocations":
              ResourceURL = ResourceURL + "locations";
              break;
            case "GetEvents":
              ResourceURL = ResourceURL + "events";
              break;
            case "GetPresets":
              ResourceURL = ResourceURL + "locations/timeincrements";
              break;
            //case 'GetFixedAccessPasses':
            //	ResourceURL = ResourceURL + "locations/seasontickets";
            //	break;
            case "GetMonthlyPass":
            case "GetFixedExpiry":
            case "GetFixedAccessPasses":
              ResourceURL = ResourceURL + "locations/seasontickets";
              break;
            case "GetPasses":
              ResourceURL = ResourceURL + "locations/GetPasses";
              //Params = "";
              break;
            default:
              break;
          }

          LAZWidget.UI.ShowLoader();
          $.ajax({
            type: "GET",
            url: ResourceURL,
            contentType: "json",
            data: Params,
            dataType: "json",
            success: function (result) {
              if (result != null) {
                if (result == null || typeof result.Message != "undefined") {
                  LAZWidget.Network.ProcessError(ServiceMode, result.Message);
                } else if (typeof result.Message == "undefined") {
                  if (WidgetSettings.eventdriven === true) {
                    if (ServiceMode === "GetEvents") {
                      var firstLoad = true;
                      LAZWidget.UI.InitializeUI(firstLoad, function () {
                        var output =
                          typeof result.d != "undefined"
                            ? JSON.parse(result.d)
                            : result;
                        LAZWidget.Network.ProcessRequest(ServiceMode, output);
                        $(
                          "#lblOr_MP,#lblOr_PM,#lblOr_ME,#lblOr_MA,#lblOr_AE,#lblOr_ER"
                        ).hide();
                      });
                    } else {
                      var output =
                        typeof result.d != "undefined"
                          ? JSON.parse(result.d)
                          : result;
                      LAZWidget.Network.ProcessRequest(ServiceMode, output);
                    }
                  } else {
                    var output =
                      typeof result.d != "undefined"
                        ? JSON.parse(result.d)
                        : result;
                    LAZWidget.Network.ProcessRequest(ServiceMode, output);
                  }
                }
              }
              Callback();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              LAZWidget.Network.ProcessError(ServiceMode, textStatus);
              Callback(jqXHR);
            },
          });
        },

        // Processes the ajax request with a given mode and returned data
        ProcessRequest: function (ServiceMode, Data) {
          LAZWidget.UI.CloseLoader();
          switch (ServiceMode) {
            case "GetLocations":
              for (var i = 0, item; (item = Data[i]); i++) {
                if (item.ID != null && item.Name != null) {
                  var dataMode = "";
                  //URL parameter P-1, HTML parameter P-2,default location
                  var urlparam = LAZWidget.Helpers.GetParameterByName("wt");
                  var htmlparam =
                    WidgetSettings.DataModeOverwrite === true
                      ? $("#LAZ_Widget").attr("data-mode")
                      : "";
                  dataMode =
                    urlparam === "" ||
                    urlparam === undefined ||
                    urlparam === null
                      ? htmlparam
                      : urlparam.toUpperCase();

                  if (dataMode !== "") {
                    WidgetSettings.DataModeOverwrite = true;
                  }
                  var LocationInfo = {};
                  LocationInfo.ID = item.ID;
                  LocationInfo.Status = item.Status;
                  LocationInfo.Name = item.Name;
                  LocationInfo.TimeZone = item.TimeZone;
                  LocationInfo.TimeZoneDate = item.TimeZoneDate; //"2020-09-09T23:17:49.6652175-04:00";
                  LocationInfo.CurrentDate = new Date().toLocaleString();
                  if (WidgetSettings.DataModeOverwrite === true)
                    LocationInfo.WidgetType = dataMode;
                  else LocationInfo.WidgetType = item.DefaultWidgetType;

                  LocationInfo.Latitude = item.Latitude;
                  LocationInfo.Longitude = item.Longitude;

                  if ((LocationInfo.City || "") !== "") {
                    LocationInfo.City = item.City.trim();
                  } else {
                    LocationInfo.City = "City";
                  }

                  // Add the location to the array if the widget type isn't null.
                  if (LocationInfo.WidgetType !== null) {
                    WidgetSettings.LocationsJSON.push(LocationInfo);
                  }
                }
              }
              lazGoLocations = WidgetSettings.LocationsJSON;
              appStartTime = new Date();
              LAZWidget.SysEvents.LocationsLoaded(true);
              break;
            case "GetEvents":
              WidgetSettings.EventsJSON = [];
              for (var i = 0, item; (item = Data[i]); i++) {
                if (item.EventId != null && item.EventName != null) {
                  var EventInfo = {};
                  EventInfo.EventId = item.EventId;
                  EventInfo.EventName = item.EventName;
                  EventInfo.EventDate = item.EventDate;
                  EventInfo.SaleStartDate = item.SaleStartDate;
                  EventInfo.SaleEndDate = item.SaleEndDate;
                  EventInfo.TIMEZONE = item.TIMEZONE;
                  EventInfo.Status = item.Status;
                  // Add the event to the array for later usage
                  WidgetSettings.EventsJSON.push(EventInfo);
                }
              }
              LAZWidget.SysEvents.EventsLoaded();
              break;
            case "GetPresets":
              WidgetSettings.PresetsJSON = [];
              WidgetSettings.PresetsJSON.push({
                Display: Language.objLang.PARKRIGHTNOW,
                Minutes: "00M",
              });
              for (var i = 0, item; (item = Data[i]); i++) {
                if (item.Display != null && item.Duration != null) {
                  var PresetInfo = {};
                  PresetInfo.Display = item.Display;
                  PresetInfo.Minutes = item.Duration;
                  // Add the preset to the array for later usage
                  WidgetSettings.PresetsJSON.push(PresetInfo);
                }
              }
              LAZWidget.SysEvents.PresetsLoaded();
              break;
            case "GetFixedExpiry":
              WidgetSettings.FixedExpiryJSON = [];
              for (var i = 0, item; (item = Data[i]); i++) {
                if (item.Id != null && item.RateName != null) {
                  var FixedExpiryInfo = {};
                  FixedExpiryInfo.Id = item.Id;
                  FixedExpiryInfo.RateName = item.RateName;
                  FixedExpiryInfo.Type = item.RateType;
                  // Add the fixed expiry ticket to the array for later usage
                  WidgetSettings.FixedExpiryJSON.push(FixedExpiryInfo);
                }
              }
              LAZWidget.SysEvents.FixedExpiryLoaded();
              break;
            case "GetFixedAccessPasses":
              WidgetSettings.FixedAccessJSON = [];
              for (var i = 0, item; (item = Data[i]); i++) {
                if (item.RateName != null && item.RateType != null) {
                  var _fixedAP = {};
                  _fixedAP.RateName = item.RateName;
                  _fixedAP.FixedStartTime = item.IsFixedStartTime;
                  _fixedAP.Id = item.Id;
                  _fixedAP.NextAvailableDate = item.NextAvailableDate;
                  _fixedAP.Duration = item.Duration;
                  _fixedAP.StartTime = item.StartTime;
                  // Add the preset to the array for later usage
                  WidgetSettings.FixedAccessJSON.push(_fixedAP);
                }
              }
              LAZWidget.SysEvents.FixedAccessPassesLoaded();
              break;
            case "GetPasses":
              if (Data.length > 0) {
                $("#LAZ_PassType").show();
                if (WidgetSettings.WidgetType == "MUP") $("#lblOr_PT").hide();
                else $("#lblOr_PT").show();
                WidgetSettings.PassTypesJSON = [];
                $.each(Data, function (index, value) {
                  WidgetSettings.PassTypesJSON.push({
                    PassType: value.RateDetailName,
                    Id: value.id,
                    RateId: value.RateId,
                    Duration: value.Duration,
                    StartTime: value.StartTime,
                    EndTime: value.EndTime,
                  });
                });
                LAZWidget.SysEvents.PassTypeLoaded();
              } else {
                $("#LAZ_PassType").hide();
                $("#lblOr_PT").hide();
              }
              break;
            default:
              return;
          }
        },

        // Processes the ajax error. Can give a friendly alert to the user as to what may have happened
        ProcessError: function (ServiceMode, Message) {
          LAZWidget.UI.CloseLoader();
          switch (ServiceMode) {
            case "GetLocations":
              console.log("Unable to retrieve location info!");
              break;
            case "GetEvents":
              console.log("Unable to retrieve event info!");
              break;
            case "GetPresets":
              console.log("Unable to retrieve preset info!");
              break;
            case "GetMonthly":
              console.log("Unable to retrieve monthly info!");
              break;
            default:
              return;
          }
        },
      };

      LAZWidget.Helpers = {
        SortById: function (a, b) {
          var aId = a.Id;
          var bId = b.Id;
          return aId < bId ? -1 : aId > bId ? 1 : 0;
        },

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
            WidgetSettings.WidgetRedirect =
              WidgetSettings.WidgetSwitcherRedirect;

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

        // Loads default language variables
        GetDefaultLanguage: function (firstLoad, callback) {
          if (firstLoad) {
            // Get available widget languages
            Language.getLanguages(function () {
              callback();
            });
          } else {
            // Language list already loaded, don't reload
            callback();
          }
        },

        // Writes a message to the browser's log
        Log: function (Message) {
          console.log(new Date().toLocaleTimeString() + " " + Message);
        },

        // Gets query string parameter values
        GetParameterByName: function (name) {
          var param = location.search.split("&");
          var searchString = location.search;
          if (param.length > 0) {
            $.each(param, function (index, value) {
              var key = value.substring(0, value.indexOf("="));
              searchString = location.search.replace(
                key.toUpperCase(),
                key.toLowerCase()
              );
            });
          }
          name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
          var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            //results = regex.exec(location.search);
            results = regex.exec(searchString);
          return results == null
            ? ""
            : decodeURIComponent(results[1].replace(/\+/g, " "));
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

        // Converts military time to standard time
        TimeMilitaryToStandard: function (fourDigitTime) {
          var hours24 = parseInt(fourDigitTime.substring(0, 2), 10),
            hours = ((hours24 + 11) % 12) + 1,
            amPm = hours24 > 11 ? "PM" : "AM",
            minutes = fourDigitTime.substring(2);

          return hours + ":" + minutes + " " + amPm;
        },

        // Converts standard  time to military time
        TimeStandardToMilitary: function (time) {
          return time.replace(
            /(\d{1,2})\s*:?\s*(\d{1,2})?\s*(am|pm)/gi,
            function (string, hour, minute, suffix) {
              minute = minute || "00";
              if (suffix.toLowerCase() === "am") {
                return (
                  (hour === "12"
                    ? "00"
                    : LAZWidget.Helpers.PadString(hour, 2)) +
                  ":" +
                  (minute.length === 1 ? minute + "0" : minute)
                );
              } else {
                return (
                  (hour === "12" ? 12 : +hour + 12) +
                  ":" +
                  (minute.length === 1 ? minute + "0" : minute)
                );
              }
            }
          );
        },

        //Round time part
        PadString: function (number, length) {
          var str = "" + number;
          while (str.length < length) {
            str = "0" + str;
          }
          return str;
        },

        // Rounds time to the closest half-hour
        Round2ClosestHalfHour: function (date, forceStandardTime) {
          var hour = date.getHours("H"),
            inMinute = date.getMinutes("i"),
            minute =
              inMinute > 30
                ? inMinute < 45
                  ? "30"
                  : "00"
                : inMinute < 15
                ? "00"
                : "30";

          if (inMinute >= 15 && inMinute < 45) minute = "30";
          else if (inMinute >= 45) {
            minute = "00";
            hour = hour + 1;
          } else minute = "00";

          //if (inMinute >= 45) {
          //	hour = hour + 1;
          //}
          if (forceStandardTime)
            return widget.helpers.fnTimeMilitaryToStandard(hour + ":" + minute);

          return hour + ":" + minute;
        },

        // Adds time in minutes to a given date
        AddMinutes: function (date, minutes) {
          var TempDate = new Date(date),
            NewTime = new Date(TempDate.getTime() + parseInt(minutes) * 60000);

          return NewTime;
        },

        // Setup google analytics script
        LoadAnalytics: function () {
          (function (i, s, o, g, r, a, m) {
            i["GoogleAnalyticsObject"] = r;
            (i[r] =
              i[r] ||
              function () {
                (i[r].q = i[r].q || []).push(arguments);
              }),
              (i[r].l = 1 * new Date());
            (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m);
          })(
            window,
            document,
            "script",
            "//www.google-analytics.com/analytics.js",
            "_LAZGa"
          );

          _LAZGa("create", WidgetSettings.GoogleAccount, "auto");
          _LAZGa("send", "pageview");
          _LAZGa("require", "ecommerce"); // Load the ecommerce plug-in.

          this.Log("Analytics loaded");
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

        // Gets date time parameters based on interval
        DateDurations: function (interval) {
          var msecPerMinute = 1000 * 60,
            msecPerHour = msecPerMinute * 60,
            msecPerDay = msecPerHour * 24;

          // Calculate how many days the interval contains. Subtract that
          // many days from the interval to determine the remainder.
          var days = Math.floor(interval / msecPerDay);
          interval = interval - days * msecPerDay;

          // Calculate the hours, minutes, and seconds.
          var hours = Math.floor(interval / msecPerHour);
          interval = interval - hours * msecPerHour;

          var minutes = Math.floor(interval / msecPerMinute);
          interval = interval - minutes * msecPerMinute;

          var seconds = Math.floor(interval / 1000);

          return [days, hours, minutes];
        },
        //Gets date time elements in array
        DateTimeElements: function (dateToFormat) {
          Date.prototype.monthNames = [
            ["1", "January"],
            ["2", "February"],
            ["3", "March"],
            ["4", "April"],
            ["5", "May"],
            ["6", "June"],
            ["7", "July"],
            ["8", "August"],
            ["9", "September"],
            ["10", "October"],
            ["11", "November"],
            ["12", "December"],
          ];
          Date.prototype.getMonthName = function () {
            return this.monthNames[this.getMonth()][1];
          };
          Date.prototype.getShortMonthName = function () {
            return this.getMonthName().substr(0, 3);
          };
          Date.prototype.dayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          Date.prototype.getDayName = function () {
            return this.dayNames[this.getDay()];
          };
          Date.prototype.getShortDayName = function () {
            return this.getDayName().substr(0, 3);
          };
          Date.prototype.getActualMonth = function () {
            return this.monthNames[this.getMonth()][0];
          };
          var d = new Date(dateToFormat);
          var hours = d.getHours();
          var minutes = d.getMinutes();
          var ampm = hours >= 12 ? "PM" : "AM";
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          minutes = minutes < 10 ? "0" + minutes : minutes;
          var DateTimeFormatArray = [
            d.getShortDayName(),
            d.getActualMonth(),
            d.getDate(),
            d.getFullYear(),
            d.getDayName(),
            d.getMonthName(),
            hours,
            minutes,
            ampm,
            d.getHours(),
          ];
          return DateTimeFormatArray;
        },
        //Process date based on interval---
        //-------GRSDESK-3583-Preset-mode-
        DateAdd: function (date, interval, units) {
          var ret = new Date(date); //don't change original date
          var ParsedUnits = parseInt(units);
          switch (interval.toLowerCase()) {
            case "year":
              ret.setFullYear(ret.getFullYear() + ParsedUnits);
              break;
            case "quarter":
              ret.setMonth(ret.getMonth() + 3 * ParsedUnits);
              break;
            case "month":
              ret.setMonth(ret.getMonth() + ParsedUnits);
              break;
            case "week":
              ret.setDate(ret.getDate() + 7 * ParsedUnits);
              break;
            case "day":
            case "d":
              ret.setDate(ret.getDate() + ParsedUnits);
              break;
            case "hour":
              ret.setTime(ret.getTime() + ParsedUnits * 3600000);
              break;
            case "minute":
            case "m":
              ret.setTime(ret.getTime() + ParsedUnits * 60000);
              break;
            case "second":
              ret.setTime(ret.getTime() + ParsedUnits * 1000);
              break;
            default:
              ret = undefined;
              break;
          }
          return ret;
        },
      };

      LAZWidget.UI = {
        _isMultiUseEnabled: false,
        _isPresetEnabled: false,
        _isMonthlyEnabled: false,
        _isFixedExpiryEnabled: false,
        _isFixedAccessEnabled: false,
        _isEventEnabled: false,
        _isTimedEnabled: false,

        // Sets up initial HTML code for the whole widget
        // firstLoad = false : Tells the language loader the template is being reloaded and to not download the language list again
        // firstLoad = true  : Tells the language loader the template is being loaded for the first time and to download the language list
        InitializeUI: function (firstLoad, callback) {
          // Get available widget languages first
          LAZWidget.Helpers.GetDefaultLanguage(firstLoad, function () {
            // Get the template from the network then render it
            $.get(WidgetSettings.TemplatePath, function (template) {
              // Render the template with required properties
              var rendered = Mustache.render(template, {
                Locations: WidgetSettings.LocationsJSON,
                Events: WidgetSettings.EventsJSON,
                Languages: Language.widgetLanguages,
                Language: Language.objLang,
                Header: WidgetSettings.IncludeHeader,
                HeaderText:
                  WidgetSettings.HeaderText === ""
                    ? Language.objLang.RESERVEPARKING
                    : WidgetSettings.HeaderText,
              });
              $("#LAZ_Widget").html(rendered);
              //Set element visibility
              LAZWidget.UI.SetUpVisibility();
              // Bind event listeners to the template elements
              LAZWidget.UI.SetUpListeners();
              callback();
              if (
                Language.widgetLanguages != null &&
                Language.widgetLanguages.length == 1
              ) {
                $("#LanguageSelector_chosen").wrap(
                  "<div style='height:7px;'></div>"
                );
                $("#LanguageSelector_chosen").css("display", "none");
              }
              //if ($('#chkCurrentTime').prop('checked') == true) {
              //	$('#LAZ_FixedAccessTimeTb').prop('disabled', true).css({ 'opacity': 0.5 });
              //}
            });
          });
        },

        // Sets up the event control
        SetUpEvents: function () {
          $.get(
            WidgetSettings.TemplateBase + "templates/LAZDefault_Events.html",
            function (template) {
              // Parse template so it loads quicker the next time it's loaded
              Mustache.parse(template);
              // Render template
              var rendered = Mustache.render(template, {
                Events: WidgetSettings.EventsJSON,
              });
              // Set the select element's HTML with the rendered template
              if (WidgetSettings.eventdriven === true) {
                $("#LAZ_Eventsdriven_Select").html(rendered);
                $("#lblOr_ER").hide();
              } else {
                $("#LAZ_Events_Select").html(rendered);
                //$("#lblOr_ER").show();
              }

              var WT = WidgetSettings.WidgetType;
              if (WidgetSettings.EventsJSON.length == 0) {
                $("#ActiveEventsSel").html(
                  '<option selected="selected" data-eventid="0" value="0">' +
                    Language.objLang.NOEVENTSTHISTIME +
                    "</option>"
                );
                if (WidgetSettings.eventdriven === false) {
                  $("#LAZ_UseEventRb").prop("disabled", true);
                  LAZWidget.UI.DisableEventMode();
                } else {
                  $("#LAZ_Eventsdriven").show();
                }

                // Change default widget type if there are no events returned
                // Don't enable timed mode again if it's already the priority widget mode
                if (WT.indexOf("TMD") > -1 && WT.indexOf("TMD") !== 0)
                  $("#LAZ_UseTimedRb").trigger("click");
                else if (
                  WT.indexOf("PST") > -1 &&
                  WidgetSettings.PresetsJSON.length > 0
                )
                  $("#LAZ_UsePresetRb").trigger("click");
              } else {
                LAZWidget.UI.UpdateEventsMenu();
                var WTI = WT.indexOf("EVT");
                //GRSDESK-3583-default-Timed-rate-selected
                if (WT.indexOf(WidgetValues.DefaultMode) >= 0) {
                  var cid = LAZWidget.UI.GetControlId(WidgetValues.DefaultMode);
                  $("#" + cid).trigger("click");
                } else {
                  // If the default type is event, trigger that type
                  if (WTI >= 0) {
                    // Disable the get rates button since the selected option is 'Select event'
                    LAZWidget.UI.DisableGetRateButton();
                    $("#LAZ_UseEventRb").trigger("click");
                  } else {
                    LAZWidget.UI.DisableEventMode();
                  }
                }
              }

              // Set the listeners since the template was just reloaded
              LAZWidget.UI.SetUpEventListeners();
              //GRSDESK-3583-enable/disable getrate button on loading when checked
              if ($("#LAZ_UseTimedRb:checked").prop("checked") === true) {
                LAZWidget.UI.EnableGetRateButton();
              } else {
                LAZWidget.UI.DisableGetRateButton();
              }

              if (
                WidgetSettings.EventsJSON.length > 0 &&
                WidgetSettings.eventdriven === true
              ) {
                LAZWidget.UI.InitDropdown();
                LAZWidget.UI.EnableEventMode();
                if (
                  parseInt($("#ActiveEventsSel option:selected").val()) <= 0
                ) {
                  LAZWidget.UI.DisableGetRateButton();
                } else {
                  LAZWidget.UI.EnableGetRateButton();
                }
              }
            }
          );
        },

        // Sets up the preset control
        SetUpPresets: function () {
          $.get(
            WidgetSettings.TemplateBase + "templates/LAZDefault_Preset.html",
            function (template) {
              //$.get('http://localhost/lazshoppingcarttest/'templates/LAZDefault_Preset.html', function (template) {
              var rendered = Mustache.render(template);
              $("#LAZ_Presets_Select").html(rendered);

              var WT = WidgetSettings.WidgetType;
              if (WidgetSettings.PresetsJSON.length == 0) {
                $("#PresetTimesSel").html(
                  '<option selected="selected" value="0">' +
                    Language.objLang.NOPRESETTIME +
                    "</option>"
                );
                $("#LAZ_UsePresetRb").prop("disabled", true);
                LAZWidget.UI.DisablePresetMode();

                if (
                  WidgetSettings.Mode === "" &&
                  WidgetValues.DefaultMode === "PST"
                ) {
                  if (WT.indexOf("TMD") > -1)
                    $("#LAZ_UseTimedRb").trigger("click");
                  else if (
                    WT.indexOf("EVT") > -1 &&
                    WidgetSettings.EventsJSON.length > 0
                  )
                    $("#LAZ_UseEventRb").trigger("click");
                  else if (WT.indexOf("SNT") > -1)
                    $("#LAZ_UsePresetRb").trigger("click");
                  else if (WT.indexOf("MUP") > -1)
                    $("#LAZ_UseMultiUsePassRb").trigger("click");
                }
              } else {
                LAZWidget.UI.UpdatePresetsMenu();
                $("#LAZ_UsePresetRb").prop("disabled", false);
                //var WTI = WT.indexOf('PST') && WT.indexOf('ALL');
                var WTI =
                  WT.indexOf("PST") < 0 ? WT.indexOf("ALL") : WT.indexOf("PST");
                //GRSDESK-3583-default-Timed-rate-selected
                if (WT.indexOf(WidgetValues.DefaultMode) >= 0) {
                  var cid = LAZWidget.UI.GetControlId(WidgetValues.DefaultMode);
                  $("#" + cid).trigger("click");
                } else {
                  //enable first type in panel incase of ALL
                  if (WT.indexOf("ALL") >= 0) {
                    LAZWidget.UI.DisablePresetMode();
                    $("#LAZ_UseMultiUsePassRb").trigger("click");
                  }
                  // If the default type is preset time, trigger that type
                  else if (WTI >= 0) {
                    $("#LAZ_UsePresetRb").trigger("click");
                  } else {
                    LAZWidget.UI.DisablePresetMode();
                  }
                }
              }
              LAZWidget.UI.SetUpPresetsListeners();
              //GRSDESK-3583-enable/disable getrate button on loading when checked
              if ($("#LAZ_UseTimedRb:checked").prop("checked") === true) {
                LAZWidget.UI.EnableGetRateButton();
              } else {
                LAZWidget.UI.DisableGetRateButton();
              }
            },
            "text"
          );
        },
        // Sets up the fixed expiry control
        SetUpFixedExpiry: function () {
          var self = this;
          $.get(
            WidgetSettings.TemplateBase +
              "templates/LAZDefault_FixedExpiry.html",
            function (template) {
              var rendered = Mustache.render(template, {
                FixedExpiry: WidgetSettings.FixedExpiryJSON,
              });
              $("#LAZ_FixedExpiry_Select").html(rendered);
              var WT = WidgetSettings.WidgetType;

              if (WidgetSettings.FixedExpiryJSON.length == 0) {
                $("#FixedExpirySel").html(
                  '<option selected="selected" data-Type="-1" value="-1">' +
                    Language.Translate("NOFIXEDEXPIRYTICKET") +
                    "</option>"
                );
                $("#LAZ_UseFixedExpiryRb").prop("disabled", true);
                LAZWidget.UI.DisableFixedExpiryMode();

                if (
                  WidgetSettings.Mode === "" &&
                  (WidgetValues.DefaultMode === "FEX" ||
                    WidgetValues.DefaultMode === "FEP")
                ) {
                  if (WT.indexOf("TMD") > -1) {
                    $("#LAZ_UseTimedRb").trigger("click");
                  } else if (
                    WT.indexOf("EVT") > -1 &&
                    WidgetSettings.EventsJSON.length > 0
                  ) {
                    $("#LAZ_UseEventRb").trigger("click");
                  } else if (WT.indexOf("SNT") > -1) {
                    $("#LAZ_UsePresetRb").trigger("click");
                  } else if (WT.indexOf("MUP") > -1) {
                    $("#LAZ_UseMultiUsePassRb").trigger("click");
                  }
                }
              } else {
                LAZWidget.UI.UpdateFixedExpiryMenu();
                $("#LAZ_UseFixedExpiryRb").prop("disabled", false);
                //var WTI = (WT.indexOf('FEX') || WT.indexOf('FEP'));// && WT.indexOf('ALL');
                var WTI =
                  WT.indexOf("FEX") < 0 ? WT.indexOf("FEP") : WT.indexOf("FEX");
                //GRSDESK-3583-default-Timed-rate-selected
                if (WT.indexOf(WidgetValues.DefaultMode) >= 0) {
                  var cid = LAZWidget.UI.GetControlId(WidgetValues.DefaultMode);
                  $("#" + cid).trigger("click");
                } else {
                  //enable first type in panel incase of ALL
                  if (WT.indexOf("ALL") >= 0) {
                    LAZWidget.UI.DisableFixedAccessMode();
                    $("#LAZ_UseMultiUsePassRb").trigger("click");
                  }
                  // If the default type is fep time, trigger that type
                  else if (WTI > -1) {
                    $("#LAZ_UseFixedExpiryRb").trigger("click");
                  } else {
                    LAZWidget.UI.DisableFixedExpiryMode();
                  }
                }
              }
              LAZWidget.UI.SetUpFixedExpiryListeners();
              //GRSDESK-3583-enable/disable getrate button on loading when checked
              if ($("#LAZ_UseTimedRb:checked").prop("checked") === true) {
                LAZWidget.UI.EnableGetRateButton();
              } else {
                LAZWidget.UI.DisableGetRateButton();
              }
            },
            "text"
          );
        },

        SetUpFixedAccess: function () {
          $.get(
            WidgetSettings.TemplateBase +
              "templates/LAZDefault_FixedAccess.html",
            function (template) {
              var rendered = Mustache.render(template);
              $("#LAZ_FixedAccess_Rates").html(rendered);

              var WT = WidgetSettings.WidgetType;
              if (WidgetSettings.FixedAccessJSON.length == 0) {
                $("#FixedAccessRates").html(
                  '<option selected="selected" value="0">' +
                    Language.objLang.NOFIXEDACCESSPASSES +
                    "</option>"
                );
                $("#LAZ_UseFixedAccessRb").prop("disabled", true);
                LAZWidget.UI.DisableFixedAccessMode();

                if (
                  WidgetSettings.Mode === "" &&
                  WidgetValues.DefaultMode === "FAP"
                ) {
                  if (WT.indexOf("TMD") > -1) {
                    $("#LAZ_UseTimedRb").trigger("click");
                  } else if (
                    WT.indexOf("EVT") > -1 &&
                    WidgetSettings.EventsJSON.length > 0
                  ) {
                    $("#LAZ_UseEventRb").trigger("click");
                  } else if (WT.indexOf("SNT") > -1) {
                    $("#LAZ_UsePresetRb").trigger("click");
                  } else if (WT.indexOf("MUP") > -1) {
                    $("#LAZ_UseMultiUsePassRb").trigger("click");
                  }
                }
              } else {
                LAZWidget.UI.UpdateFixedAccessMenu();
                $("#LAZ_UseFixedAccessRb").prop("disabled", false);
                //var WTI = WT.indexOf('FAP') && WT.indexOf('ALL');
                var WTI =
                  WT.indexOf("FAP") < 0 ? WT.indexOf("ALL") : WT.indexOf("FAP");
                //GRSDESK-3583-default-Timed-rate-selected
                if (WT.indexOf(WidgetValues.DefaultMode) >= 0) {
                  var cid = LAZWidget.UI.GetControlId(WidgetValues.DefaultMode);
                  $("#" + cid).trigger("click");
                } else {
                  //enable first type in panel incase of ALL
                  if (WT.indexOf("ALL") >= 0) {
                    LAZWidget.UI.DisableFixedAccessMode();
                    $("#LAZ_UseMultiUsePassRb").trigger("click");
                  }
                  // If the default type is preset time, trigger that type
                  else if (WTI >= 0) {
                    $("#LAZ_UseFixedAccessRb").trigger("click");
                  } else {
                    LAZWidget.UI.DisableFixedAccessMode();
                  }
                }
              }
              LAZWidget.UI.SetUpFixedAccessListeners();
              //GRSDESK-3583-enable/disable getrate button on loading when checked
              if ($("#LAZ_UseTimedRb:checked").prop("checked") === true) {
                LAZWidget.UI.EnableGetRateButton();
              } else {
                LAZWidget.UI.DisableGetRateButton();
              }
            },
            "text"
          );
        },

        SetUpPassType: function () {
          var self = this;
          $("#PassTypeSel").html(
            '<option selected="selected" data-eventid="0" value="0">' +
              Language.objLang.CHOOSEPASSTYPE +
              "</option>"
          );
          $.each(WidgetSettings.PassTypesJSON, function (index, value) {
            $("#PassTypeSel").append(
              $("<option></option>")
                .attr("value", value.Id)
                .text(value.PassType)
            );
          });

          if (WidgetSettings.PassTypesJSON.length > 0) {
            $("#LAZ_UsePassTypeRb").prop("disabled", false);
            if (
              WidgetSettings.WidgetType.indexOf(WidgetValues.DefaultMode) >= 0
            ) {
              $("#LAZ_UsePassTypeRb").trigger("click");
            }
          } else {
            $("#LAZ_UsePassTypeRb").prop("disabled", true);
          }
          LAZWidget.UI.SetUpPassTypeListeners();

          if ($("#LAZ_UsePassTypeRb").prop("checked") === true) {
            LAZWidget.UI.EnablePassTypeMode();
          } else {
            LAZWidget.UI.DisablePassTypeMode();
          }
        },
        // Builds the events drop down menu
        UpdateEventsMenu: function () {
          var locationstartDateTime = "";
          if (lazGoLocations.length > 0)
            locationstartDateTime = LAZWidget.UI.GetCurrentlocationTime();
          // Clear the events select menu's html
          if (WidgetSettings.eventdriven === true) {
            $("#ActiveEventsSel").html("");
            // Add the first element
            $("#ActiveEventsSel").append(
              '<option selected="selected" data-eventid="0" value="0">' +
                Language.objLang.SHOWEVENT +
                "</option>"
            );
            $("#ActiveEventsSel option").removeAttr("selected");
          } else {
            $("#ActiveEventsSel").html("");
            // Add the first element
            $("#ActiveEventsSel").append(
              '<option selected="selected" data-eventid="0" value="0">' +
                Language.objLang.CHOOSEEVENT +
                "</option>"
            );
            // Enable the radio button
            $("#LAZ_UseEventRb").prop("disabled", false);

            $("#ActiveEventsSel option").removeAttr("selected");
          }
          // Find events that begin with a space " " so they can be moved to the top of the list
          var _topEvents = $.grep(WidgetSettings.EventsJSON, function (e) {
            return e.EventName.substring(0, 1) === " ";
          });

          // Parse top event array and add them first
          for (var i = 0, item; (item = _topEvents[i]); i++) {
            var _tempDate = new Date(item.EventDate);

            if (WidgetSettings.eventdriven === true) {
              $("#ActiveEventsdrivenSel").append(
                $("<option></option>")
                  .attr("value", item.EventId)
                  .text(
                    item.EventName + " " + _tempDate.format("mm/dd/yy h:MMTT")
                  )
              );
            } else {
              $("#ActiveEventsSel").append(
                $("<option></option>")
                  .attr("value", item.EventId)
                  .text(
                    item.EventName + " " + _tempDate.format("mm/dd/yy h:MMTT")
                  )
              );
            }
          }

          // Find events that don't begin with a space " "
          var _regularEvents = $.grep(WidgetSettings.EventsJSON, function (e) {
            return e.EventName.substring(0, 1) !== " ";
          });

          // Append event to the drop down menu
          for (var i = 0, item; (item = _regularEvents[i]); i++) {
            var _tempDate = new Date(item.EventDate);
            var _soldOut = "";
            //if (Date.parse(locationstartDateTime) > Date.parse(new Date(item.SaleEndDate)))
            _soldOut = item.Status === "1" ? " Sold Out" : "";

            // Create the event name
            var _eventName = "";
            if (WidgetSettings.HideEventDate) _eventName = item.EventName;
            else
              _eventName =
                item.EventName + " " + _tempDate.format("mm/dd/yy h:MMTT");

            $("#ActiveEventsSel").append(
              $("<option></option>")
                .attr("value", item.EventId)
                .text(_eventName)
            );

            if (_soldOut !== "") {
              if ($("select#ActiveEventsSel").length > 0) {
                var length = $("select#ActiveEventsSel")[0].length;
                $("select#ActiveEventsSel")[0][length - 1].innerHTML =
                  _eventName +
                  " <span style='color:red'>" +
                  _soldOut +
                  "</span>";
              }
            }
          }
        },

        UpdatePresetsMenu: function () {
          // Clear the presets select menu's html
          $("#PresetTimesSel").html("");
          // Add the first element
          $("#PresetTimesSel").html(
            '<option selected="selected" value="0">' +
              Language.objLang.CHOOSEPRESET +
              "</option>"
          );
          // Enable the radio button
          $("#LAZ_UsePresetRb").prop("disabled", false);
          // Append event to the drop down menu
          for (var i = 0, item; (item = WidgetSettings.PresetsJSON[i]); i++) {
            $("#PresetTimesSel").append(
              $("<option></option>")
                .attr("value", item.Minutes)
                .text(item.Display)
            );
          }
        },
        UpdateFixedExpiryMenu: function () {
          // Clear the fixed access rates select menu's html
          $("#FixedExpirySel").html("");
          // Add the first element
          $("#FixedExpirySel").html(
            '<option selected="selected" value="0">' +
              Language.objLang.CHOOSEFIXEDEXPIRY +
              "</option>"
          );
          // Enable the radio button
          $("#LAZ_UseFixedExpiryRb").prop("disabled", false);
          // Sort the array
          var sortedProducts = WidgetSettings.FixedExpiryJSON.sort(
            LAZWidget.Helpers.SortById
          );
          // Append fixed access pass to the drop down menu
          for (
            var i = 0, item;
            (item = WidgetSettings.FixedExpiryJSON[i]);
            i++
          ) {
            $("#FixedExpirySel").append(
              $("<option></option>").attr("value", item.Id).text(item.RateName)
            );
          }
        },

        UpdateFixedAccessMenu: function () {
          // Clear the fixed access rates select menu's html
          $("#FixedAccessRates").html("");
          // Add the first element
          $("#FixedAccessRates").html(
            '<option selected="selected" value="0">' +
              Language.objLang.CHOOSEFIXEDACCESS +
              "</option>"
          );
          // Enable the radio button
          $("#LAZ_UseFixedAccessRb").prop("disabled", false);
          // Sort the array
          //var sortedProducts = WidgetSettings.FixedAccessJSON.sort(LAZWidget.Helpers.SortById);
          // Append fixed access pass to the drop down menu
          for (
            var i = 0, item;
            (item = WidgetSettings.FixedAccessJSON[i]);
            i++
          ) {
            $("#FixedAccessRates").append(
              $("<option></option>").attr("value", item.Id).text(item.RateName)
            );
          }
        },

        // Configures the widget so that all modes are enabled
        EnableAllModes: function () {
          LAZWidget.UI.EnableEventMode();
          LAZWidget.UI.EnableTimedMode();
          LAZWidget.UI.EnablePresetMode();
          LAZWidget.UI.EnableMultiUseMode();
          LAZWidget.UI.EnableMonthlyPassMode();
          LAZWidget.UI.EnableFixedExpiryMode();
          //LAZWidget.UI.EnablePassTypeMode();
        },

        // Configures the widget so that all modes are disabled (usually when there's no location selected)
        DisableAllModes: function (HideElements) {
          $("#btnGetRate")
            .attr("disabled", "disabled")
            .css("cursor", "default")
            .addClass("laz-ff-getRatesButtonDisabled");
          this.DisableMultiUseMode();
          this.DisablePresetMode();
          this.DisableMonthlyMode();
          this.DisableFixedExpiryMode();
          this.DisableFixedAccessMode();
          this.DisableEventMode();
          this.DisableTimedMode();
          //this.DisablePassTypeMode();
          WidgetValues.SelectedFAPID = 0;

          if (HideElements) {
            this._isMultiUseEnabled =
              this._isPresetEnabled =
              this._isMonthlyEnabled =
              this._isFixedExpiryEnabled =
                false;
            this._isFixedAccessEnabled =
              this._isEventEnabled =
              this._isTimedEnabled =
                false;
            $(
              "#LAZ_Rates,#LAZ_Preset,#LAZ_Events,#LAZ_MultiUsePass,#LAZ_Monthly,#LAZ_FixedExpiry,#LAZ_FixedAccess"
            ).hide();
            $(
              "#lblOr_MP,#lblOr_PM,#lblOr_ME,#lblOr_MA,#lblOr_AE,#lblOr_ER"
            ).hide();
          }
        },

        // Disables the locations drop down menu when there are 0 locations in the LocationsJSON array
        DisableLocationsDropDown: function () {
          $("#park-location")
            .attr("disabled", "disabled")
            .css({ opacity: 0.5 });
          $("#park-location").append(
            $("<option></option>")
              .attr("value", "0")
              .attr("selected", "selected")
              .text("No locations available")
          );
          this.DisableAllModes();
        },

        // Displays the get rate button
        EnableGetRateButton: function () {
          LAZWidget.UI.SetGetRateButtonText();
          $("#btnGetRate")
            .removeAttr("disabled")
            .css("cursor", "pointer")
            .removeClass("laz-ff-getRatesButtonDisabled");
        },

        // Hides the Get Rates button
        DisableGetRateButton: function () {
          LAZWidget.UI.SetGetRateButtonText();
          $("#btnGetRate")
            .attr("disabled", "disabled")
            .css("cursor", "default")
            .addClass("laz-ff-getRatesButtonDisabled");
        },

        SetGetRateButtonText: function () {
          if (WidgetSettings.eventdriven === true)
            $("#btnGetRate").val(Language.objLang.CONTINUE);
          else {
            if ($("#LAZ_UseMonthlyRb").prop("checked")) {
              $("#btnGetRate").val(Language.objLang.PURCHASEPASS);
            } else {
              $("#btnGetRate").val(Language.objLang.GETRATE);
            }
          }
        },

        // Configures the widget so that event mode is enabled
        EnableEventMode: function (initLoad) {
          LAZWidget.UI._isEventEnabled = true;
          // Show the event mode elements
          if (WidgetSettings.eventdriven === true) {
            $("#btnGetRate").val(Language.objLang.CONTINUE);
            $("#LAZ_Eventsdriven").show();
            $("#LAZ_Events").hide();
            $("#lblOr_ER").hide();
          } else {
            $("#btnGetRate").val(Language.objLang.GETRATE);
            $("#LAZ_Eventsdriven").hide();
            $("#LAZ_Events").show();
            //$("#lblOr_ER").show();
          }
          // Enable event mode if method isn't called for the first time
          if (initLoad !== true) {
            $("#LAZ_UseEventRb").prop("disabled", false);
            $("#LAZ_lblSelectEvent,#ActiveEventsSel,#LAZ_UseEventRb")
              .css({ opacity: 1 })
              .prop("disabled", false);
            $("#ActiveEventsSel").trigger("chosen:updated");
            if (WidgetSettings.eventdriven === false)
              $("#ActiveEventsSel").trigger("change");
          }
        },

        // Configures the widget so that event mode is disabled
        DisableEventMode: function () {
          // Select the first option in the select element when events are disabled
          //$('#ActiveEventsSel option:first-child').attr('selected', 'selected');
          //GRSDESK - 3339 - maintain selected index
          var index = $("#ActiveEventsSel").prop("selectedIndex");
          if ($("#ActiveEventsSel").prop("selectedIndex", index) !== undefined)
            $("#ActiveEventsSel")
              .prop("selectedIndex", index)
              .css({ opacity: 0.5 });
          // Change the CSS of the event specific elements
          $("#LAZ_lblSelectEvent,#ActiveEventsSel")
            .css({ opacity: 0.5 })
            .prop("disabled", true);
          // Trigger chosen:updated to force the chosen select element to inherit the properties
          // of the #ActiveEventsSel select element
          $("#ActiveEventsSel").trigger("chosen:updated");
        },

        // Configures the widget so that timed mode is enabled
        EnableTimedMode: function (initLoad) {
          LAZWidget.UI._isTimedEnabled = true;
          $("#btnGetRate").val(Language.objLang.GETRATE);
          // Show the timed mode elements
          $("#LAZ_Rates").show();
          // Enable timed mode if method isn't called for the first time
          //if (initLoad !== true) {
          if (
            WidgetSettings.StartDT === null &&
            WidgetSettings.EndDT === null &&
            WidgetSettings.StartTime !== ""
          ) {
            var currentDate = moment();
            var dateString = currentDate.format("YYYY-MM-DD");
            var startDateTime = moment(
              dateString + " " + WidgetSettings.StartTime,
              "YYYY-MM-DD hh:mm A"
            );
            var endDateTime = moment(
              dateString + " " + WidgetSettings.EndTime,
              "YYYY-MM-DD hh:mm A"
            );

            if (
              currentDate.isAfter(startDateTime) &&
              currentDate.isSame(startDateTime, "day")
            ) {
              // If the preset time is earlier than the current time, set the start date time to the current time
              var newStart = LAZWidget.Helpers.Round2NextHalfHour(
                currentDate.toDate()
              );
              var hourPart = newStart.split(":")[0];
              var minPart = newStart.split(":")[1];
              //
              var newDateStart = startDateTime.toDate();
              newDateStart.setHours(hourPart);
              newDateStart.setMinutes(minPart);
              //
              startDateTime = moment(newDateStart);
            }

            if (
              currentDate.isAfter(startDateTime) &&
              currentDate.isBefore(endDateTime)
            ) {
              // Set the start time to the current time if it's past the default start time
              startDateTime = moment(
                dateString + " " + currentDate.format("h:mm A"),
                "YYYY-MM-DD hh:mm A"
              );
            } else if (currentDate.isAfter(endDateTime)) {
              // Current date is past the default end time. Add one day to currentDate
              currentDate.add(1, "days");
              dateString = currentDate.format("YYYY-MM-DD");
              startDateTime = moment(
                dateString + " " + WidgetSettings.StartTime,
                "YYYY-MM-DD hh:mm A"
              );
              endDateTime = moment(
                dateString + " " + WidgetSettings.EndTime,
                "YYYY-MM-DD hh:mm A"
              );
            }

            WidgetSettings.StartDT =
              startDateTime.format("YYYY-MM-DD") +
              " " +
              startDateTime.format("h:mm A");
            WidgetSettings.EndDT =
              endDateTime.format("YYYY-MM-DD") +
              " " +
              endDateTime.format("h:mm A");
          }

          LAZWidget.UI.SetUpPickers();

          var adp = $A.reg["ArrivalDate"],
            ddp = $A.reg["DepartureDate"];

          //$('#LAZ_UseTimedRb').prop('checked', true).prop('disabled', false);
          //$('#LAZ_ArriveDateTb,#LAZ_DepartDateTb,#LAZ_ArriveTimeTb,#LAZ_DepartTimeTb,#LAZ_lblArriveDate,#LAZ_lblDepartDate').css({ 'opacity': 1 }).prop('disabled', false);

          var timezoneDateString = lazGoLocations[0].TimeZoneDate;
          timezoneDateString = timezoneDateString.split(".")[0];
          var timezoneDate = new Date(timezoneDateString);

          if (WidgetSettings.StartDT !== null)
            adp.setDate(
              adp,
              moment(WidgetSettings.StartDT, "YYYY-MM-DD h:m A").toDate()
            );
          else adp.setDate(adp, timezoneDate);

          if (WidgetSettings.EndDT !== null)
            ddp.setDate(
              ddp,
              moment(WidgetSettings.EndDT, "YYYY-MM-DD h:m A").toDate()
            );

          adp.runAfterClose(adp);

          //$('#LAZ_ArriveDateTb').val(moment(adp.date).format("ddd, MMMM DD, YYYY"));

          var $arriveTimePicker = $("#LAZ_ArriveTimeTb");
          LAZWidget.UI.SetDefaultTime($arriveTimePicker);

          var ADTE = adp.date.format(WidgetSettings.DateFormatLib),
            ADT = ADTE + " " + $("#LAZ_ArriveTimeTb").val();

          var _deptDate = new Date(
            $("#LAZ_DepartDateTb").val() + " " + $("#LAZ_DepartTimeTb").val()
          );
          var _arriveDate = new Date(
            $("#LAZ_ArriveDateTb").val() + " " + $("#LAZ_ArriveTimeTb").val()
          );
          if (_arriveDate > _deptDate)
            $("#LAZ_DepartTimeTb").val($("#LAZ_ArriveTimeTb").val());

          if (_arriveDate === "Invalid Date")
            LAZWidget.UI.SetDefaultTime($("#LAZ_DepartTimeTb"), ADT);

          LAZWidget.UI.EnableGetRateButton();
          //}
        },

        // Configures the widget so that timed mode is disabled
        DisableTimedMode: function () {
          $(
            "#LAZ_ArriveDateTb,#LAZ_DepartDateTb,#LAZ_ArriveTimeTb,#LAZ_DepartTimeTb"
          )
            .css({ opacity: 0.5 })
            .prop("disabled", true);
          $("#LAZ_lblArriveDate,#LAZ_lblDepartDate").css({ opacity: 0.5 });

          $("#LAZ_ArriveDateTb").val(Language.objLang.ARRIVALDATE);
          $("#LAZ_DepartDateTb").val(Language.objLang.DEPARTUREDATE);

          // Destroy time picker controls
          //$('#LAZ_ArriveDateTb,#LAZ_DepartDateTb').datepicker('destroy');
          WidgetValues.TimedModeBound = false;

          $("#LAZ_ArriveTimeTb,#LAZ_DepartTimeTb").val(Language.objLang.TIME);
        },

        // Configures the widget so that preset mode is enabled
        EnablePresetMode: function (initLoad) {
          LAZWidget.UI._isPresetEnabled = true;
          $("#btnGetRate").val(Language.objLang.GETRATE);
          // Show the preset mode elements
          $("#LAZ_Preset").show();
          if (initLoad !== true) {
            $("#LAZ_UsePresetRb").prop("disabled", false);
            $("#PresetTimesSel").css({ opacity: 1 }).prop("disabled", false);
          }
          $("#PresetTimesSel").trigger("chosen:updated");
        },

        // Configures the widget so that preset mode is disabled
        DisablePresetMode: function () {
          $("#PresetTimesSel").css({ opacity: 0.5 }).prop("disabled", true);
          $("#PresetTimesSel").trigger("chosen:updated");
        },

        // Configures the widget so that multiuse mode is enabled
        EnableMultiUseMode: function (initLoad) {
          if (WidgetSettings.PassTypesJSON.length <= 0) {
            $("#lblOr_MP").hide();
            $("#LAZ_MultiUsePass").hide();
          } else {
            LAZWidget.UI._isMultiUseEnabled = true;
            // Show the multiuse mode elements
            //$('#LAZ_MultiUsePass').show();
          }
          $("#MultiUseTb").val(Language.objLang.MULTIUSEPASSLBL);
          // Enable multiuse mode if method isn't called for the first time
          if (initLoad !== true) {
            $("#LAZ_UseMultiUsePassRb,#MultiUseTb")
              .prop("disabled", false)
              .css({ opacity: 1 });
            $("#btnGetRate")
              .val(Language.objLang.PURCHASEPASS)
              .removeAttr("disabled")
              .css({ opacity: 1, cursor: "pointer" })
              .removeClass("laz-ff-getRatesButtonDisabled")
              .show();
          }
        },

        // Configures the widget so that multiuse mode is disabled
        DisableMultiUseMode: function () {
          $("#LAZ_UseMultiUseRb,#btnMultiUsePass,#MultiUseTb")
            .css({ opacity: 0.5 })
            .prop("disabled", true);
        },

        // Configures the widget so that preset mode is enabled
        EnableMonthlyPassMode: function () {
          LAZWidget.UI._isMonthlyEnabled = true;
          LAZWidget.UI.DisableGetRateButton();
          $("#LAZ_Monthly").show();
          $("#LAZ_UseMonthlyRb,#LAZ_MonthlyDateTb")
            .css({ opacity: 1 })
            .prop("disabled", false);
          // Set binds for when an element is clicked
          $("#LAZ_MonthlyDateTb")
            .off()
            .on("click", function (e) {
              $("#LAZ_MonthlyDateTb").datepicker("destroy");
              // Only setup the picker controls if monthly mode isn't already bound
              if (WidgetValues.MonthlyModeBound === false) {
                WidgetValues.MonthlyModeBound = true;
                LAZWidget.UI.SetUpMonthlyPickers();
                // Trigger the focus event to open the control
                $(this).blur().trigger("focus");
              } else LAZWidget.UI.EnableGetRateButton();
            });
        },
        // Configures the widget so that preset mode is disabled
        DisableMonthlyMode: function () {
          $("#LAZ_MonthlyDateTb")
            .css({ opacity: 0.5 })
            .val(Language.objLang.CHOOSEMONTHLYPASS);
          $("#LAZ_MonthlyDateTb").datepicker("destroy");
          $("#LAZ_MonthlyDateTb").prop("disabled", true);
          WidgetValues.MonthlyModeBound = false;
        },

        // Configures the widget so that fixed expiry mode is enabled
        EnableFixedExpiryMode: function (initLoad) {
          LAZWidget.UI._isFixedExpiryEnabled = true;
          $("#LAZ_FixedExpiry").show();
          $("#btnGetRate").val(Language.objLang.GETRATE);
          if (initLoad !== true) {
            $("#LAZ_UseFixedExpiryRb").prop("disabled", false);
            $("#FixedExpirySel").css({ opacity: 1 }).prop("disabled", false);
          }
          $("#FixedExpirySel").trigger("chosen:updated");

          // Set element text
          //	$('#LAZ_FixedExpiryDateTb').val('Fixed expiry pass');

          // Enable fixed expiry mode if method isn't called for the first time
          // if (initLoad !== true) {
          // 	$('#LAZ_FixedExpiryDateTb').off().on('click', function (e) {
          // 		// Only setup the picker controls if monthly mode isn't already bound
          // 		if (WidgetValues.FixedExpiryModeBound === false) {
          // 			WidgetValues.FixedExpiryModeBound = true;
          // 			LAZWidget.UI.SetUpFixedExpiryPicker();
          // 			// Trigger the focus event to open the control
          // 			$(this).blur().trigger('focus');
          // 		}
          // 		LAZWidget.UI.EnableGetRateButton();
          // 	});
          // 	$('#LAZ_UseMultiUsePassRb,#LAZ_FixedExpiryDateTb').prop('disabled', false).css({ 'opacity': 1 });
          // }
        },

        // Configures the widget so that fixed expiry mode is disabled
        DisableFixedExpiryMode: function () {
          //$('#LAZ_FixedExpiryDateTb,#FixedAccessRates').css({ 'opacity': 0.5 }).prop('disabled', true).val('Fixed expiry pass');
          //$('#LAZ_FixedExpiryDateTb').datepicker('destroy');

          //GRSDESK - 3339 - maintain selected index
          var index = $("#FixedExpirySel").prop("selectedIndex");
          if ($("#FixedExpirySel").prop("selectedIndex", index) !== undefined)
            $("#FixedExpirySel")
              .prop("selectedIndex", index)
              .css({ opacity: 0.5 });
          $("#LAZ_FixedExpiry").removeClass("block-active");
          WidgetValues.FixedExpiryModeBound = false;
          $("#FixedExpirySel").css({ opacity: 0.5 }).prop("disabled", true);
          $("#FixedExpirySel").trigger("chosen:updated");
        },

        // Configures the widget so that fixed access mode is enabled
        EnableFixedAccessMode: function (initLoad) {
          LAZWidget.UI._isFixedAccessEnabled = true;

          // Show the multiuse mode elements
          $("#LAZ_FixedAccess").show();
          //LAZWidget.UI.DisableGetRateButton();

          // Set element text
          $("#LAZ_FixedAccessDateTb").val(Language.objLang.ARRIVALDATE);
          $("#LAZ_FixedAccessTimeTb").val(Language.objLang.TIME);

          // Enable fixed access mode if method isn't called for the first time
          if (initLoad !== true) {
            //GRSDESK-3268 the time picker click event casing the date picker date reset
            //So no need of the time picker click event
            $("#LAZ_FixedAccessDateTb")
              .off("click")
              .on("click", function (e) {
                // Only setup the picker controls if monthly mode isn't already bound
                if (WidgetValues.FixedAccessModeBound === false) {
                  //WidgetValues.FixedAccessModeBound = true;
                  LAZWidget.UI.SetUpFixedAccessPickers();
                  // Trigger the focus event to open the control
                  $(this).blur().trigger("focus");
                }
                if (WidgetValues.SelectedFAPID == 0) {
                  LAZWidget.UI.DisableFixedAccessMode(true);
                }
              });
            if (WidgetValues.SelectedFAPID == 0)
              $("#FixedAccessRates")
                .prop("disabled", false)
                .css({ opacity: 1 });
            else
              $(
                "#LAZ_FixedAccessDateTb,#LAZ_FixedAccessTimeTb,#FixedAccessRates"
              )
                .prop("disabled", false)
                .css({ opacity: 1 });

            $("#FixedAccessRates").trigger("chosen:updated");
          }
        },

        // Configures the widget so that fixed access mode is disabled
        DisableFixedAccessMode: function (ratesEnabled) {
          if (ratesEnabled)
            $("#LAZ_FixedAccessDateTb,#LAZ_FixedAccessTimeTb")
              .css({ opacity: 0.5 })
              .prop("disabled", true);
          else
            $("#LAZ_FixedAccessDateTb,#LAZ_FixedAccessTimeTb,#FixedAccessRates")
              .css({ opacity: 0.5 })
              .prop("disabled", true);

          $("#LAZ_FixedAccessDateTb").val(Language.objLang.ARRIVALDATE); //.datepicker('destroy');
          $("#LAZ_FixedAccessTimeTb").val(Language.objLang.TIME);
          $("#FixedAccessRates").trigger("chosen:updated");
          WidgetValues.FixedAccessModeBound = false;
        },

        // Configures the widget so that ratetype mode is disabled
        DisablePassTypeMode: function () {
          $("#PassTypeSel").css({ opacity: 0.5 }).prop("disabled", true);
        },
        EnablePassTypeMode: function () {
          $("#btnGetRate").val(Language.objLang.GETRATE);
          $("#PassTypeSel").css({ opacity: 1 }).prop("disabled", false);
        },

        SetUpFixedExpiryListeners: function () {
          $("#FixedExpirySel").chosen({
            disable_search: true,
          });

          $("#FixedExpirySel").on("change", function () {
            // Return if there are no fixed access passes available
            if (WidgetSettings.FixedExpiryJSON == []) return;

            // Search the array for a matching fixed access pass object
            var _rateId = parseInt(this.value);
            var _rate = $.grep(WidgetSettings.FixedExpiryJSON, function (x) {
              return x.Id == _rateId;
            });

            // Set the selected fixed expiry pass ID for when the user clicks the get rates button
            WidgetValues.SelectedFEPID = _rateId;

            if (
              WidgetValues.DefaultMode === "FEX" ||
              WidgetValues.DefaultMode === "FEP"
            )
              LAZWidget.UI.DisableGetRateButton();

            //GRSDESK - 3339 - enable/disable ratebutton
            if (WidgetValues.SelectedFEPID <= 0) {
              LAZWidget.UI.DisableGetRateButton();
            } else {
              LAZWidget.UI.EnableGetRateButton();
            }

            // Return if there are no matches
            if (_rate.length == 0) return;

            //WidgetValues.HideFixedAccessTime = _rate[0].FixedStartTime;

            // // Optionally show or hide the time picker based on the fixed start time property
            // if (_rate[0].FixedStartTime) {
            // 	$('#LAZ_FixedAccessTimeTb').hide();
            // 	$('#LAZ_FixedAccessDateTb').addClass('hiddenTime');
            // } else {
            // 	$('#LAZ_FixedAccessTimeTb').show();
            // 	$('#LAZ_FixedAccessDateTb').removeClass('hiddenTime');
            // }
          });

          $("#FixedExpirySel").trigger("change");
        },
        SetUpPassTypeListeners: function () {
          $("#PassTypeSel").on("change", function () {
            // Return if there are no fixed access passes available
            if (WidgetSettings.PassTypesJSON == []) return;
            // Search the array for a matching fixed access pass object
            var _passTypeId = parseInt(this.value);
            var _passType = $.grep(WidgetSettings.PassTypesJSON, function (x) {
              return x.Id == _passTypeId;
            });
            // Set the selected fixed expiry pass ID for when the user clicks the get rates button
            WidgetValues.SelectedPassTypeID = _passTypeId;

            //enable/disable ratebutton
            if (WidgetValues.SelectedPassTypeID <= 0) {
              LAZWidget.UI.DisableGetRateButton();
            } else {
              LAZWidget.UI.EnableGetRateButton();
            }
            // Return if there are no matches
            if (_passType.length == 0) return;
          });
        },
        SetUpFixedAccessListeners: function () {
          $("#FixedAccessRates").chosen({
            disable_search: true,
          });
          $("#FixedAccessRates").on("change", function () {
            // Return if there are no fixed access passes available
            if (WidgetSettings.FixedAccessJSON == []) return;
            // Search the array for a matching fixed access pass object
            var _rateId = parseInt(this.value);
            var _rate = $.grep(WidgetSettings.FixedAccessJSON, function (x) {
              return x.Id == _rateId;
            });

            // Set the selected fixed access pass ID for when the user clicks the get rates button
            WidgetValues.SelectedFAPID = _rateId;

            if (WidgetValues.DefaultMode === "FAP")
              LAZWidget.UI.DisableGetRateButton();

            //GRSDESK - 3339 - enable/disable ratebutton
            if (WidgetValues.SelectedFAPID <= 0) {
              LAZWidget.UI.DisableFixedAccessMode(true);
              LAZWidget.UI.DisableGetRateButton();
              //$('#chkCurrentTime').prop('checked',false);
            } else {
              LAZWidget.UI.EnableFixedAccessMode();
              //if ($('#chkCurrentTime').prop('checked') == true) {
              //	$('#LAZ_FixedAccessTimeTb').prop('disabled', true).css({ 'opacity': 0.5 });
              //	LAZWidget.UI.SetUpFixedAccessPickers();
              //	//LAZWidget.UI.SetDefaultTime($('#LAZ_FixedAccessTimeTb'));
              //	LAZWidget.UI.SetCurrentTime($('#LAZ_FixedAccessTimeTb'));
              //}
              if (isNaN(Date.parse($("#LAZ_FixedAccessDateTb").val())) === true)
                LAZWidget.UI.DisableGetRateButton();
              else LAZWidget.UI.EnableGetRateButton();
            }

            // Return if there are no matches
            if (_rate.length === 0) {
              //GRSDESK-3298 show/hide time control based on FixedStartTime value
              if (
                WidgetSettings.FixedAccessJSON !== null &&
                WidgetSettings.FixedAccessJSON.length > 0 &&
                WidgetSettings.FixedAccessJSON[0].FixedStartTime === true
              ) {
                $("#LAZ_FixedAccessTimeTb").hide();
                $("#LAZ_FixedAccessDateTb").addClass("hiddenTime");
              } else {
                $("#LAZ_FixedAccessTimeTb").show();
                $("#LAZ_FixedAccessDateTb").removeClass("hiddenTime");
              }
              return;
            }

            WidgetValues.HideFixedAccessTime = _rate[0].FixedStartTime;

            // Optionally show or hide the time picker based on the fixed start time property
            if (_rate[0].FixedStartTime) {
              $("#LAZ_FixedAccessTimeTb").hide();
              $("#LAZ_FixedAccessDateTb").addClass("hiddenTime");
            } else {
              $("#LAZ_FixedAccessTimeTb").show();
              $("#LAZ_FixedAccessDateTb").removeClass("hiddenTime");
            }
            LAZWidget.UI.SetUpFixedAccessPickers();
          });

          $("#FixedAccessRates").trigger("change");

          //$('#chkCurrentTime').on('change', function () {
          //	if (this.checked == true) {
          //		LAZWidget.UI.SetUpFixedAccessPickers();
          //		$('#LAZ_FixedAccessTimeTb').prop('disabled', true).css({ 'opacity': 0.5 });
          //		//LAZWidget.UI.SetDefaultTime($('#LAZ_FixedAccessTimeTb'));
          //		LAZWidget.UI.SetCurrentTime($('#LAZ_FixedAccessTimeTb'));
          //	}
          //	else
          //		$('#LAZ_FixedAccessTimeTb').prop('disabled', false).css({ 'opacity': 1 });
          //});
        },

        // Sets up event listener specifically related to the 'presets' section
        SetUpPresetsListeners: function () {
          $("#PresetTimesSel").chosen({
            disable_search: true,
          });

          $("#PresetTimesSel").on("change", function () {
            //GRSDESK - 3339 - enable/disable ratebutton
            var _Optionval = parseInt(this.value);

            if (_Optionval <= 0) LAZWidget.UI.DisableGetRateButton();
            else LAZWidget.UI.EnableGetRateButton();

            WidgetSettings.PresetOffset = _Optionval;
          });

          $("#PresetTimesSel").trigger("change");
        },

        // Sets up event listeners specifically related to the 'locations' section
        SetUpLocationListeners: function () {
          if (!WidgetSettings.ForceNativeControls) {
            $("#park-location").chosen({
              disable_search: true,
            });
          }

          if (WidgetSettings.UseMap) {
            $("#park-location").on(
              "chosen:showing_dropdown",
              function (evt, params) {
                LAZWidget.UI.NormalizeMarkerIcons();
                LAZWidget.UI.BuildMap();
                LAZWidget.UI.ResetMap();
              }
            );

            $("#LAZ_Locations_Select").on(
              "mouseenter",
              ".active-result",
              function () {
                // Reset all marker icons to the default
                LAZWidget.UI.NormalizeMarkerIcons();

                var _index = $(this).attr("data-option-array-index");
                if (_index == 0 && lazGoLocations.length > 1) return;
                else if (_index !== 0 && lazGoLocations.length > 1)
                  _index = _index - 1;

                lazGoMap.markers[_index].setIcon(
                  "//grs.lazparking.com/facilityfinder/images/laz_icon_rollover.png"
                );
              }
            );

            $("#LAZ_Locations_Select").on(
              "mouseleave",
              ".active-result",
              function () {
                var _index = $(this).attr("data-option-array-index");
                if (_index == 0 && lazGoLocations.length > 1) return;
                else if (_index !== 0 && lazGoLocations.length > 1)
                  _index = _index - 1;

                LAZWidget.UI.NormalizeMarkerIcons(_index);
              }
            );

            /*if ($('.chosen-container').length > 0) {
							$('.chosen-container').on('touchstart', function(e){
								e.stopPropagation(); e.preventDefault();
								// Trigger the mousedown event.
								$(this).trigger('mousedown');
							});
						}*/
          }

          $("#park-location").on("change", function () {
            // Hide the error div in case it's open
            $("#LAZ_RateError").hide();

            // Clear event object array
            WidgetSettings.EventsJSON = [];

            // Clear preset object array
            WidgetSettings.PresetsJSON = [];

            // Assign the selected location ID to the widget settings for later use
            WidgetValues.SelectedLID = this.value;
            lazGoLID = this.value;

            // If the location's ID is 0 then disable all widget modes and exit the function
            if (this.value == 0) {
              LAZWidget.UI.SelectLocationDefault();
              return;
            }

            //load label text based on selected location language
            LAZWidget.UI.SetUpLanguageLabels();

            // Set widget type
            var _LocObj = $.grep(WidgetSettings.LocationsJSON, function (e) {
              return e.ID == WidgetValues.SelectedLID;
            })[0];
            WidgetSettings.WidgetType = _LocObj.WidgetType;

            // Set the selected location string
            //selectedLocation = _LocObj.Name + ', ' + _LocObj.City;

            if (WidgetSettings.eventdriven === true) {
              $("#btnGetRate").val(Language.objLang.CONTINUE);
              if (_LocObj.Status === "1") LAZWidget.UI.DisableGetRateButton();
              else LAZWidget.UI.EnableGetRateButton();
            } else LAZWidget.UI.HandleWidgetType(_LocObj.WidgetType);
          });
        },

        //load label text based on selected location langauge
        SetUpLanguageLabels: function () {
          Language.getLang(
            WidgetSettings.ISOCode,
            $("#park-location").val(),
            function () {
              $("label.lblHdrMultiItem").html(
                WidgetSettings.IsCombinedProducts
                  ? ""
                  : Language.Translate("LABELSELECTPARKOPTION")
              );
              $("label.css-or").html(Language.Translate("LABELOR"));

              $("#MultiUseTb").val(Language.objLang.MULTIUSEPASSLBL);
              $("#mmbLink").html(Language.Translate("MANAGEMYBOOKING"));
              $("#btnMultiUsePass").val(Language.Translate("PURCHASEPASS"));

              var getRateLabel = Language.Translate("GETRATE");
              var updateGetRateLabel = true;
              if (
                WidgetValues.DefaultMode === "MUP" &&
                (getRateLabel === "GET RATES" ||
                  getRateLabel === "GET RATE" ||
                  getRateLabel === "Get Rate" ||
                  getRateLabel === "Get Rates")
              )
                updateGetRateLabel = false;

              if (updateGetRateLabel === true) {
                if (WidgetSettings.eventdriven === true)
                  $("#btnGetRate").val(Language.objLang.CONTINUE);
                else $("#btnGetRate").val(Language.Translate("GETRATE"));
              }

              $("#btnParkNow").val(Language.Translate("PARKNOW"));
              $("#btnBookAdvance").val(Language.Translate("BOOKADVANCE"));

              $(
                "[name='arrive-date'],[name='depart-date'],[name='season-date']"
              ).val(Language.Translate("ARRIVE"));
              $("[name='depart-date']").val(Language.Translate("DEPART"));
              $(
                "[name='arrive-time'],[name='depart-time'],[name='season-time']"
              ).val(Language.Translate("TIME"));

              if ($('#park-location option[value="0"]').length == 1) {
                $('#park-location option[value="0"]').text(
                  Language.Translate(
                    WidgetSettings.IsCombinedProducts
                      ? "SELECTCAMPUS"
                      : "SELECTLOCATION"
                  )
                );
              }

              if ($('#PresetTimesSel option[value="0"]').length == 1) {
                $('#PresetTimesSel option[value="0"]').text(
                  Language.Translate("NOPRESETTIME")
                );
              } else if ($('#PresetTimesSel option[value="00M"]').length == 1) {
                $('#PresetTimesSel option[value="00M"]').text(
                  Language.Translate("PARKRIGHTNOW")
                );
              }

              if ($('#MonthlySel option[value="No MPS"]').length == 1) {
                $('#MonthlySel option[value="No MPS"]').text(
                  Language.Translate(
                    WidgetSettings.IsAreaEnabled
                      ? "NOLOCKER"
                      : "NOMONTHLYTICKET"
                  )
                );
              } else if ($('#MonthlySel option[value="0"]').length == 1) {
                $('#MonthlySel option[value="0"]').text(
                  Language.Translate(
                    WidgetSettings.IsAreaEnabled
                      ? "CHOOSELOCKER"
                      : "CHOOSEMONTHLYTICKET"
                  )
                );
              }

              if ($('#FixedExpirySel option[value="No FEP"]').length == 1) {
                $('#FixedExpirySel option[value="No FEP"]').text(
                  LanguageTranslate("NOFIXEDEXPIRYTICKET")
                );
              } else if ($('#FixedExpirySel option[value="0"]').length == 1) {
                $('#FixedExpirySel option[value="0"]').text(
                  Language.Translate("CHOOSEFIXEDEXPIRYTICKET")
                );
              }

              if ($('#FixedAccessSel option[value="No FAP"]').length == 1) {
                $('#FixedAccessSel option[value="No FAP"]').text(
                  Language.Translate("NOFIXEDACCESSTICKET")
                );
              } else if ($('#FixedAccessSel option[value="0"]').length == 1) {
                $('#FixedAccessSel option[value="0"]').text(
                  Language.Translate("CHOOSEFIXEDACCESSTICKET")
                );
              }

              if ($('#ActiveEventsSel option[value="No Events"]').length == 1) {
                $('#ActiveEventsSel option[value="No Events"]').text(
                  Language.Translate("NOEVENTSTHISTIME")
                );
              }
            }
          );
        },

        NormalizeMarkerIcons: function (index) {
          var _iconPath =
            "//grs.lazparking.com/facilityfinder/images/laz_icon.png";
          if (index !== undefined) {
            lazGoMap.markers[index].setIcon(_iconPath);
          } else {
            for (i = 0; i < lazGoMap.markers.length; i++) {
              var _marker = lazGoMap.markers[i];
              _marker.setIcon(_iconPath);
            }
          }
        },

        ResetMap: function () {
          if (lazGoMap.map == null) return;
          lazGoMap.map.setCenter(LAZWidget.UI.GetMapBounds().getCenter());
          lazGoMap.map.setZoom(parseInt(lazGoMap.zoom));
        },

        GetMapBounds: function () {
          var bound = new google.maps.LatLngBounds();

          for (i = 0; i < lazGoLocations.length; i++) {
            bound.extend(
              new google.maps.LatLng(
                lazGoLocations[i].Latitude,
                lazGoLocations[i].Longitude
              )
            );
          }

          if (lazGoMap.placeLat !== 0 && lazGoMap.placeLng !== 0)
            bound.extend(
              new google.maps.LatLng(lazGoMap.placeLat, lazGoMap.placeLng)
            );

          return bound;
        },

        BuildMap: function () {
          if (lazGoMap.map !== null) {
            var _marker = $.grep(lazGoMap.markers, function (m) {
              return m.id == parseInt(WidgetValues.SelectedLID);
            });
            if (_marker.length !== 0)
              _marker[0].setIcon(
                "//grs.lazparking.com/facilityfinder/images/laz_icon_rollover.png"
              );
            return;
          }
          if (WidgetSettings.LocationIDs.length > 1) {
            lazGoMap.zoom = LAZWidget.UI.ZoomLevel();
          }
          lazGoMap.map = new google.maps.Map($("#lazGoMapDiv").get(0), {
            center: LAZWidget.UI.GetMapBounds().getCenter(),
            zoom: parseInt(lazGoMap.zoom),
            zoomControl: true,
          });

          if (lazGoMap.placeLat !== 0 && lazGoMap.placeLng !== 0) {
            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(
                lazGoMap.placeLat,
                lazGoMap.placeLng
              ),
              map: lazGoMap.map,
              title: lazGoMap.placeTxt,
            });
          }

          var _imageBase =
            "//grs.lazparking.com/facilityfinder/images/laz_icon";
          for (i = 0; i < lazGoLocations.length; i++) {
            var _loc = lazGoLocations[i];

            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(
                lazGoLocations[i].Latitude,
                lazGoLocations[i].Longitude
              ),
              map: lazGoMap.map,
              title: lazGoLocations[i].Name,
              icon:
                WidgetValues.SelectedLID == _loc.ID
                  ? _imageBase + "_rollover.png"
                  : _imageBase + ".png",
              id: lazGoLocations[i].ID,
              index: i,
            });
            marker.addListener("mouseover", function () {
              LAZWidget.UI.NormalizeMarkerIcons();
              $("#LAZ_Locations_Select .active-result").removeClass(
                "highlighted"
              );
              var _index = this.index;
              if (lazGoLocations.length > 1) _index = _index + 1;
              $($("#LAZ_Locations_Select .active-result")[_index]).addClass(
                "highlighted"
              );
              lazGoMap.markers[this.index].setIcon(
                "//grs.lazparking.com/facilityfinder/images/laz_icon_rollover.png"
              );
            });
            marker.addListener("mouseout", function () {
              $("#LAZ_Locations_Select .active-result").removeClass(
                "highlighted"
              );
              var _index = this.index;
              if (lazGoLocations.length > 1) _index = _index + 1;
              LAZWidget.UI.NormalizeMarkerIcons(this.index);
            });
            marker.addListener("click", function (e) {
              window.event.preventDefault();
              $("#park-location").val(this.id);
              $("#park-location").trigger("chosen:updated");
              $("#park-location").trigger("change");
              $("#park-location").trigger("chosen:close");
            });
            lazGoMap.markers.push(marker);
          }
        },

        ZoomLevel: function () {
          var lowerDistance = 0;
          var higherDistance = 0;
          var zoomLevel = 12;
          for (i = 0; i < lazGoLocations.length; i++) {
            var lat1 = lazGoLocations[i].Latitude;
            var lon1 = lazGoLocations[i].Longitude;
            if (lazGoLocations.length - 1 > i) {
              var lat2 = lazGoLocations[i + 1].Latitude;
              var lon2 = lazGoLocations[i + 1].Longitude;
              //distance in kilometer
              var distance = LAZWidget.UI.distance(lat1, lon1, lat2, lon2);
              if (lowerDistance === 0 && higherDistance === 0) {
                lowerDistance = distance;
                higherDistance = distance;
              }

              lowerDistance =
                distance < lowerDistance ? distance : lowerDistance;
              higherDistance =
                distance > higherDistance ? distance : higherDistance;
            }
          }
          if (higherDistance > 5 && higherDistance <= 8) zoomLevel = 10;
          else if (higherDistance > 8 && higherDistance <= 12) zoomLevel = 9;
          else if (higherDistance > 12 && higherDistance <= 15) zoomLevel = 8;
          else if (higherDistance > 15) zoomLevel = 7;
          else zoomLevel = 12;
          return zoomLevel;
        },
        distance: function (lat1, lon1, lat2, lon2) {
          // The math module contains a function named toRadians
          // which converts from degrees to radians.
          lon1 = LAZWidget.UI.toRadians(lon1);
          lon2 = LAZWidget.UI.toRadians(lon2);
          lat1 = LAZWidget.UI.toRadians(lat1);
          lat2 = LAZWidget.UI.toRadians(lat2);
          var dlon = lon2 - lon1;
          var dlat = lat2 - lat1;
          // Haversine formula
          var a =
            Math.pow(Math.sin(dlat / 2), 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
          var c = 2 * Math.asin(Math.sqrt(a));
          // Radius of earth in kilometers. Use 3956 for miles
          var r = 6371;
          // calculate the result
          return c * r;
        },
        toRadians: function (angleIn10thofaDegree) {
          return (angleIn10thofaDegree * Math.PI) / 180;
        },
        // Sets up event listeners specifically related to the 'events' section
        SetUpEventListeners: function () {
          // Unbind any existing binds since we're reloading a template within the main view
          this.UnBindEventListeners();

          if (!WidgetSettings.ForceNativeControls) {
            $("#ActiveEventsSel").chosen({
              disable_search: true,
            });
          }

          $("#ActiveEventsSel").on("change", function () {
            //GRSDESK - 3339 - enable/disable ratebutton
            WidgetValues.SelectedEVID = parseInt(this.value);
            if (WidgetValues.SelectedEVID <= 0) {
              if (WidgetSettings.eventdriven === true) {
                //$("#LAZ_Locations_Select").empty();
                WidgetSettings.LocationsJSON = [];
                $.get(
                  WidgetSettings.TemplateBase +
                    "templates/LAZDefault_Locations.html",
                  function (template) {
                    $("#park-location")
                      .attr("disabled", "disabled")
                      .css({ opacity: 0.5 });
                    $("#LAZ_Locations_Select").html(
                      "<select id='park-location' disabled='disabled' class='park-location' title='Parking location'><option value='000'>" +
                        Language.objLang.SELECTLOCATION +
                        "</option></select>"
                    );
                  },
                  "text"
                );
              }
              LAZWidget.UI.DisableGetRateButton();
            } else {
              if (WidgetSettings.eventdriven === true) {
                WidgetSettings.issoldout = false;
                $(WidgetSettings.EventsJSON).each(function (index, item) {
                  if (parseInt(item.EventId) === WidgetValues.SelectedEVID) {
                    if (item.Status === "1") WidgetSettings.issoldout = true;
                  }
                });
                WidgetSettings.LocationsJSON = [];
                LAZWidget.Network.GetData(
                  "GetLocations",
                  "ClientId=" +
                    WidgetSettings.ClientId +
                    "&ArrayeDataLocationId=[" +
                    WidgetSettings.LocationIDs.join() +
                    "]&evid=" +
                    WidgetValues.SelectedEVID +
                    "&WidgetKey=" +
                    WidgetSettings.WidgetKey,
                  function () {
                    if (WidgetSettings.issoldout === true)
                      LAZWidget.UI.DisableGetRateButton();
                  }
                );
              } else LAZWidget.UI.EnableGetRateButton();
            }
          });
        },

        // Set element and control visibility based on config values
        SetUpVisibility: function () {
          if (!WidgetSettings.ShowWidgetBgImage)
            $("#WidgetFaceDiv").attr(
              "style",
              "background-image:none!important"
            );

          if (!WidgetSettings.ShowWidgetLangSelect)
            $("#WidgetFaceDiv #LanguageSelector").attr(
              "style",
              "display:none!important"
            );
        },

        // Method to control the UI based on the widget type (Preset,Timed,Event,Multiuse or a combination)
        HandleWidgetType: function (WidgetType, stop) {
          var self = this;
          if (WidgetSettings.eventdriven === false)
            LAZWidget.UI.DisableAllModes(true);

          // Split widget types string into an array
          var WidgetTypes = WidgetType.split("|");

          // Define cases and their functions
          var TypeCases = {
            ALL: self.EnableAllModes,
            TMD: self.EnableTimedMode,
            EVT: self.EnableEventMode,
            PST: self.EnablePresetMode,
            MUP: self.EnableMultiUseMode,
            MPS: self.EnableMonthlyPassMode,
            FAP: self.EnableFixedAccessMode,
            FEX: self.EnableFixedExpiryMode,
            FEP: self.EnableFixedExpiryMode,
          };

          // Enable widget types
          for (var t in WidgetTypes) {
            if (TypeCases[WidgetTypes[t]]) TypeCases[WidgetTypes[t]](true);
          }

          // Stopping widget setup here will prevent elements visibility from being set
          if (stop) {
            $("#lblOr_ER").hide();
            return;
          }

          // Set default mode. Zero index is the default type
          var _widgetMode = WidgetTypes[0];

          // Override the model
          if (WidgetSettings.Mode !== "" && WidgetSettings.Mode !== "All")
            _widgetMode = WidgetSettings.Mode.toUpperCase();

          if (WidgetSettings.eventdriven === false) {
            switch (_widgetMode) {
              case "MUP":
                $("#LAZ_UseMultiUsePassRb").trigger("click");
                break;
              case "PST":
                $("#LAZ_UsePresetRb").trigger("click");
                break;
              case "MPS":
                $("#LAZ_UseMonthlyRb").trigger("click");
                break;
              case "FEX":
              case "FEP":
                $("#LAZ_UseFixedExpiryRb").trigger("click");
                break;
              case "FAP":
                $("#LAZ_UseFixedAccessRb").trigger("click");
                break;
              case "TMD":
                $("#LAZ_UseTimedRb").trigger("click");
                break;
              case "EVT":
                $("#LAZ_UseEventRb").trigger("click");
                break;
            }
          }
          WidgetValues.DefaultMode = _widgetMode;
          var locationParam = "eDataLocationId=" + WidgetValues.SelectedLID;
          if (WidgetSettings.eventdriven === false) {
            if (WidgetSettings.WidgetType.indexOf("PST") > -1)
              LAZWidget.Network.GetData("GetPresets", locationParam);

            if (WidgetSettings.WidgetType.indexOf("EVT") > -1)
              LAZWidget.Network.GetData(
                "GetEvents",
                locationParam + "&widgetkey=" + WidgetSettings.WidgetKey
              );

            if (WidgetSettings.WidgetType.indexOf("FAP") > -1) {
              var fapParam =
                locationParam +
                "&IsMPS=false&IsFEP=false&IsFAP=true&AgentId=" +
                WidgetSettings.AgentId +
                "&widgetkey=" +
                WidgetSettings.WidgetKey;
              LAZWidget.Network.GetData("GetFixedAccessPasses", fapParam);
            }

            if (
              WidgetSettings.WidgetType.indexOf("FEX") > -1 ||
              WidgetSettings.WidgetType.indexOf("FEP") > -1
            ) {
              var fexParam =
                locationParam +
                "&IsMPS=false&IsFEP=true&IsFAP=false&AgentId=" +
                WidgetSettings.AgentId +
                "&widgetkey=" +
                WidgetSettings.WidgetKey;
              LAZWidget.Network.GetData("GetFixedExpiry", fexParam);
            }
            //var passTypeParam = locationParam + '&IsMPS=false&IsFEP=false&IsFAP=true&AgentId=' + WidgetSettings.AgentId + "&widgetkey=" + WidgetSettings.WidgetKey;
            if (WidgetSettings.WidgetKey !== "")
              locationParam += "&widgetkey=" + WidgetSettings.WidgetKey;

            if (WidgetSettings.WidgetType.indexOf("MUP") > -1)
              LAZWidget.Network.GetData("GetPasses", locationParam);
          }
          self.ConfigureLabels(self);
        },

        // Shows the labels that separate each widget type based on the enabled widget types
        ConfigureLabels: function (self) {
          var Mup = self._isMultiUseEnabled ? 1 : 0,
            Pst = self._isPresetEnabled ? 1 : 0,
            Mnt = self._isMonthlyEnabled ? 1 : 0,
            Fex = self._isFixedExpiryEnabled ? 1 : 0,
            Fap = self._isFixedAccessEnabled ? 1 : 0,
            Evt = self._isEventEnabled ? 1 : 0,
            Tmd = self._isTimedEnabled ? 1 : 0;

          // Calculate the total number of enabled modes
          var TotalEnabled = Mup + Pst + Mnt + Fex + Fap + Evt + Tmd;

          if (TotalEnabled <= 1) return;

          // Loop to the count of enabled modes
          for (var x = 0; x < TotalEnabled; x++) {
            if (Mup && !$("#lblOr_MP").is(":visible")) $("#lblOr_MP").show();
            else if (Pst && !$("#lblOr_PM").is(":visible"))
              $("#lblOr_PM").show();
            else if (Mnt && !$("#lblOr_ME").is(":visible"))
              $("#lblOr_ME").show();
            else if (Fex && !$("#lblOr_MA").is(":visible"))
              $("#lblOr_MA").show();
            else if (Fap && !$("#lblOr_AE").is(":visible"))
              $("#lblOr_AE").show();
            else if (Evt && !$("#lblOr_ER").is(":visible"))
              $("#lblOr_ER").show();
          }
        },

        // Unbind any event listeners currently attached to the 'events' section for re-usability
        UnBindEventListeners: function () {
          $("#ActiveEventsSel").off("change");
        },

        // Sets up the jquery event listeners for the main template
        SetUpListeners: function () {
          if (!WidgetSettings.ForceNativeControls) {
            $("#LanguageSelector").chosen({
              disable_search: true,
            });
          }

          $("#LanguageSelector").on("change", function () {
            Language.getLang(
              this.value,
              $("#park-location").value,
              function () {
                LAZWidget.SysEvents.LocationsLoaded(false, function () {
                  LAZWidget.Helpers.Log("Language changed");
                });
              }
            );
          });

          $("#mmbLink").on("click", function () {
            var URL = Language.objLang.MANAGEMYBOOKING_URL;
            if (URL !== undefined) LAZWidget.Helpers.OpenCustomWindow(URL);
          });

          $(".mmbEditLink").on("click", function () {
            var URL = Language.objLang.EDITRESERVATION_URL;
            if (URL !== undefined) LAZWidget.Helpers.OpenCustomWindow(URL);
          });

          $(".mmbCancelLink").on("click", function () {
            var URL = Language.objLang.CANCELRESERVATION_URL;
            if (URL !== undefined) LAZWidget.Helpers.OpenCustomWindow(URL);
          });

          $(
            "#LAZ_UseMultiUsePassRb,#LAZ_UsePresetRb,#LAZ_UseMonthlyRb,#LAZ_UseFixedExpiryRb,#LAZ_UseFixedAccessRb,#LAZ_UseEventRb,#LAZ_UseTimedRb,#LAZ_UsePassTypeRb"
          ).prop("checked", false);

          $("#LAZ_UseMultiUsePassRb").on("click", function () {
            $(
              "#LAZ_UsePresetRb,#LAZ_UseMonthlyRb,#LAZ_UseFixedExpiryRb,#LAZ_UseFixedAccessRb,#LAZ_UseEventRb,#LAZ_UseTimedRb,#LAZ_UsePassTypeRb"
            ).prop("checked", false);
            // LAZWidget.UI.DisableAllModes();
            LAZWidget.UI.InitDropdown();
            LAZWidget.UI.EnableMultiUseMode();
          });

          $("#LAZ_UsePresetRb").on("click", function () {
            $(
              "#LAZ_UseMultiUsePassRb,#LAZ_UseMonthlyRb,#LAZ_UseFixedExpiryRb,#LAZ_UseFixedAccessRb,#LAZ_UseEventRb,#LAZ_UseTimedRb,#LAZ_UsePassTypeRb"
            ).prop("checked", false);
            //LAZWidget.UI.DisableAllModes();
            LAZWidget.UI.InitDropdown();
            LAZWidget.UI.EnablePresetMode();
            //GRSDESK - 3339 - enable/disable ratebutton
            if (parseInt($("#PresetTimesSel option:selected").val()) <= 0) {
              LAZWidget.UI.DisableGetRateButton();
            } else {
              LAZWidget.UI.EnableGetRateButton();
            }
          });

          $("#LAZ_UseMonthlyRb").on("click", function () {
            $(
              "#LAZ_UseMultiUsePassRb,#LAZ_UsePresetRb,#LAZ_UseFixedExpiryRb,#LAZ_UseFixedAccessRb,#LAZ_UseEventRb,#LAZ_UseTimedRb,#LAZ_UsePassTypeRb"
            ).prop("checked", false);
            //LAZWidget.UI.DisableAllModes();
            LAZWidget.UI.InitDropdown();
            LAZWidget.UI.EnableMonthlyPassMode();
          });

          $("#LAZ_UseFixedExpiryRb").on("click", function () {
            $(
              "#LAZ_UseMultiUsePassRb,#LAZ_UsePresetRb,#LAZ_UseMonthlyRb,#LAZ_UseFixedAccessRb,#LAZ_UseEventRb,#LAZ_UseTimedRb,#LAZ_UsePassTypeRb"
            ).prop("checked", false);
            //GRSDESK - 3339 - enable/disable ratebutton
            LAZWidget.UI.InitDropdown();
            LAZWidget.UI.EnableFixedExpiryMode();
            if (parseInt($("#FixedExpirySel option:selected").val()) <= 0) {
              LAZWidget.UI.DisableGetRateButton();
            } else {
              LAZWidget.UI.EnableGetRateButton();
            }
          });

          $("#LAZ_UseFixedAccessRb").on("click", function () {
            $(
              "#LAZ_UseMultiUsePassRb,#LAZ_UsePresetRb,#LAZ_UseMonthlyRb,#LAZ_UseFixedExpiryRb,#LAZ_UseEventRb,#LAZ_UseTimedRb,#LAZ_UsePassTypeRb"
            ).prop("checked", false);
            //LAZWidget.UI.DisableAllModes();
            LAZWidget.UI.InitDropdown();
            LAZWidget.UI.EnableFixedAccessMode();
            if ($("#FixedAccessRates").val() != "0")
              $("#FixedAccessRates").trigger("change");
          });

          $("#LAZ_UseEventRb").on("click", function () {
            $(
              "#LAZ_UseMultiUsePassRb,#LAZ_UsePresetRb,#LAZ_UseMonthlyRb,#LAZ_UseFixedExpiryRb,#LAZ_UseFixedAccessRb,#LAZ_UseTimedRb,#LAZ_UsePassTypeRb"
            ).prop("checked", false);
            //GRSDESK - 3339 - enable/disable ratebutton
            LAZWidget.UI.InitDropdown();
            LAZWidget.UI.EnableEventMode();
            if (parseInt($("#ActiveEventsSel option:selected").val()) <= 0) {
              LAZWidget.UI.DisableGetRateButton();
            } else {
              LAZWidget.UI.EnableGetRateButton();
            }
          });

          $("#LAZ_UseTimedRb").on("click", function () {
            $(
              "#LAZ_UseMultiUsePassRb,#LAZ_UsePresetRb,#LAZ_UseMonthlyRb,#LAZ_UseFixedExpiryRb,#LAZ_UseFixedAccessRb,#LAZ_UseEventRb,#LAZ_UsePassTypeRb"
            ).prop("checked", false);
            //GRSDESK - 3339 - enable/disable ratebutton
            LAZWidget.UI.InitDropdown();
            //LAZWidget.UI.EnableTimedMode();
            $("#LAZ_UseTimedRb").prop("checked", true).prop("disabled", false);
            $(
              "#LAZ_ArriveDateTb,#LAZ_DepartDateTb,#LAZ_ArriveTimeTb,#LAZ_DepartTimeTb,#LAZ_lblArriveDate,#LAZ_lblDepartDate"
            )
              .css({ opacity: 1 })
              .prop("disabled", false);
          });

          $("#btnGetRate,#btnMultiUsePass").on("click", function () {
            LAZWidget.Main.InvokeRates();
          });
          $("#LAZ_UsePassTypeRb").on("click", function () {
            $(
              "#LAZ_UseMultiUsePassRb,#LAZ_UsePresetRb,#LAZ_UseMonthlyRb,#LAZ_UseFixedExpiryRb,#LAZ_UseFixedAccessRb,#LAZ_UseEventRb,#LAZ_UseTimedRb"
            ).prop("checked", false);
            LAZWidget.UI.InitDropdown();
            $("#PassTypeSel").css({ opacity: 1 }).prop("disabled", false);
            //$('#RateTypeSel').css({ 'opacity': 1 }).prop('disabled', false);
          });
        },
        //GRSDESK - 3339 - cached selected value
        InitDropdown: function () {
          var _PresetTimesSelIndex = 0;
          var _FixedExpirySelIndex = 0;
          var _FixedAccessRatesSelIndex = 0;
          var _ActiveEventsSelIndex = 0;
          var _RateTypeSelIndex = 0;

          LAZWidget.UI.DisableAllModes();
          $("#PresetTimesSel").prop("selectedIndex", _PresetTimesSelIndex);
          $("#FixedExpirySel").prop("selectedIndex", _FixedExpirySelIndex);
          $("#FixedAccessRates").prop(
            "selectedIndex",
            _FixedAccessRatesSelIndex
          );
          $("#ActiveEventsSel").prop("selectedIndex", _ActiveEventsSelIndex);
          $("#RateTypeSel").prop("selectedIndex", _RateTypeSelIndex);

          $("#PresetTimesSel_chosen a.chosen-single span").text(
            $("#PresetTimesSel option:selected").text()
          );
          $("#FixedExpirySel_chosen a.chosen-single span").text(
            $("#FixedExpirySel option:selected").text()
          );
          $("#FixedAccessRates_chosen a.chosen-single span").text(
            $("#FixedAccessRates option:selected").text()
          );
          $("#ActiveEventsSel_chosen a.chosen-single span").text(
            $("#ActiveEventsSel option:selected").text()
          );
        },
        // Sets up the date and time pickers of the widget
        SetUpPickers: function () {
          // Don't re-init if we already have done so
          if (
            $A.reg["ArrivalDate"] !== undefined &&
            $A.reg["DepartureDate"] !== undefined
          )
            return;

          var timezoneDateString = lazGoLocations[0].TimeZoneDate;
          timezoneDateString = timezoneDateString.split(".")[0];
          timezoneDate = new Date(timezoneDateString);
          var $arriveTimePicker = $("#LAZ_ArriveTimeTb"),
            $departTimePicker = $("#LAZ_DepartTimeTb");

          var MIN_TIME = "12:00 AM",
            MAX_TIME = "11:30 PM",
            SETAMINUTES = 0,
            padded1HourTimeframe = LAZWidget.Helpers.Round2ClosestHalfHour(
              LAZWidget.Helpers.AddMinutes(timezoneDate, 30),
              false
            ),
            padded2HourTimeframe = LAZWidget.Helpers.Round2ClosestHalfHour(
              LAZWidget.Helpers.AddMinutes(timezoneDate, +120),
              false
            );
          padded1HourTimeframe =
            LAZWidget.UI.SetupBeforeTime(padded1HourTimeframe);
          $A.setCalendar(
            "ArrivalDate",
            document.getElementById("LAZ_ArriveDateTb"),
            document.getElementById("LAZ_ArriveDateTb"),
            false,
            undefined,
            {
              offsetTop: 30,
              minDate: timezoneDate,
              condenseYear: true,
              drawFullCalendar: true,
              pageUpDownNatural: true,
              months: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
              days: [
                {
                  s: "S",
                  l: "Sun",
                },
                {
                  s: "M",
                  l: "Mon",
                },
                {
                  s: "T",
                  l: "Tue",
                },
                {
                  s: "W",
                  l: "Wed",
                },
                {
                  s: "T",
                  l: "Thu",
                },
                {
                  s: "F",
                  l: "Fri",
                },
                {
                  s: "S",
                  l: "Sat",
                },
              ],
              wdOffset: 0,
              inputDateFormat: "dddd, MMMM D, YYYY",
              runAfterClose: function (dc) {
                LAZWidget.UI.Setwidgetheight();
                var ddp = $A.reg["DepartureDate"];
                ddp.setMinDate(ddp, dc.date);

                if (moment(dc.date).isAfter(moment(ddp.date))) ddp.setDate(ddp);

                ddp.runOnceBefore(ddp, ddp.date);
                var timezoneDateString = lazGoLocations[0].TimeZoneDate;
                timezoneDateString = timezoneDateString.split(".")[0];
                timezoneDate = new Date(timezoneDateString);
                //GRSDESK-3537
                if (
                  Date.parse(timezoneDate.format("yyyy-mm-dd")) <
                  Date.parse($A.reg["ArrivalDate"].date.format("yyyy-mm-dd"))
                ) {
                  LAZWidget.UI.SetTime($arriveTimePicker, MIN_TIME);
                }

                var adp = new Date($("#LAZ_ArriveDateTb").val());
                if (adp.toString() === "Invalid Date") {
                  $("#LAZ_ArriveDateTb").val(
                    moment(new Date()).format("ddd, MMMM D, YYYY")
                  );
                }
                var _deptDate = new Date(
                  $("#LAZ_DepartDateTb").val() +
                    " " +
                    $("#LAZ_DepartTimeTb").val()
                );
                var _arrivalDate = new Date(
                  $("#LAZ_ArriveDateTb").val() +
                    " " +
                    $("#LAZ_ArriveTimeTb").val()
                );

                if (_deptDate === "Invalid Date" || _deptDate < _arrivalDate) {
                  $("#LAZ_DepartDateTb").val($("#LAZ_ArriveDateTb").val());
                }

                //check arrive and depart datetime
                if (
                  isNaN(Date.parse($("#LAZ_ArriveDateTb").val())) === false &&
                  isNaN(Date.parse($("#LAZ_DepartDateTb").val())) === false
                ) {
                  var adv = new Date($("#LAZ_ArriveDateTb").val()).format(
                    "yyyy-mm-dd"
                  );
                  var ddv = new Date($("#LAZ_DepartDateTb").val()).format(
                    "yyyy-mm-dd"
                  );
                  var isSamedate = LAZWidget.UI.IsSameDate(adv, ddv);
                  if (isSamedate === false) {
                    //set default time
                    LAZWidget.UI.SetTime(
                      $departTimePicker,
                      MIN_TIME,
                      $arriveTimePicker.val()
                    );
                  } else {
                    //for same date, depart time will come after arrive time
                    if ($arriveTimePicker.val().split(" ").length > 0) {
                      var _mintime = LAZWidget.UI.GetMinTime($arriveTimePicker);
                      LAZWidget.UI.SetTime(
                        $departTimePicker,
                        _mintime,
                        $arriveTimePicker.val()
                      );
                      if (
                        Date.parse(timezoneDate.format("yyyy-mm-dd")) ===
                        Date.parse(
                          new Date($("#LAZ_ArriveDateTb").val()).format(
                            "yyyy-mm-dd"
                          )
                        )
                      ) {
                        _mintime = LAZWidget.Helpers.Round2NextHalfHour(
                          LAZWidget.Helpers.AddMinutes(timezoneDate, 30),
                          false
                        );
                        _mintime = LAZWidget.UI.SetupBeforeTime(_mintime);
                        LAZWidget.UI.SetTime(
                          $arriveTimePicker,
                          _mintime,
                          _mintime
                        );
                      } else {
                        LAZWidget.UI.SetTime(
                          $arriveTimePicker,
                          MIN_TIME,
                          _mintime
                        );
                      }
                      LAZWidget.UI.SetCurrentTime($arriveTimePicker);
                      //LAZWidget.UI.SetDepartTime(adv, $arriveTimePicker, $departTimePicker);
                    }
                  }
                } else {
                  //for same day
                  if (
                    isNaN(Date.parse($("#LAZ_ArriveDateTb").val())) === false
                  ) {
                    if (
                      Date.parse(new Date().format("yyyy-mm-dd")) ===
                      Date.parse(
                        new Date($("#LAZ_ArriveDateTb").val()).format(
                          "yyyy-mm-dd"
                        )
                      )
                    ) {
                      var _mintime = LAZWidget.Helpers.Round2NextHalfHour(
                        LAZWidget.Helpers.AddMinutes(timezoneDate, 30),
                        false
                      );
                      _mintime = LAZWidget.UI.SetupBeforeTime(_mintime);
                      LAZWidget.UI.SetTime(
                        $arriveTimePicker,
                        _mintime,
                        _mintime
                      );
                      LAZWidget.UI.SetCurrentTime($arriveTimePicker);
                    }
                  }
                }
                //$('#LAZ_DepartDateTb').val($("#LAZ_ArriveDateTb").val());
                //GRSDESK-3583
                if (isNaN(Date.parse($("#LAZ_ArriveDateTb").val())) === false) {
                  LAZWidget.UI.EnableGetRateButton();
                  var currentTime = LAZWidget.UI.GetCurrentTime();
                  if (currentTime !== "") {
                    $("#LAZ_ArriveTimeTb").val(currentTime);
                    if (
                      new Date(Date.parse($("#LAZ_ArriveDateTb").val())) >
                      new Date()
                    )
                      $("#LAZ_ArriveTimeTb").val("Time");
                  }
                } else {
                  LAZWidget.UI.DisableGetRateButton();
                }
              },
              initialDate: moment(timezoneDate).format("ddd, MMMM D, YYYY"),
            }
          );

          $("#LAZ_ArriveDateTb").on("focus", function (e, d) {
            $(this).trigger("click");
            LAZWidget.UI.EnableTimedMode();
          });

          $arriveTimePicker
            .timepicker({
              minTime: padded1HourTimeframe,
              maxTime: MAX_TIME,
              scrollDefaultTime: LAZWidget.Helpers.Round2NextHalfHour(
                LAZWidget.Helpers.AddMinutes(timezoneDate, -30),
                false
              ),
              timeFormat: WidgetSettings.TimeFormat,
              forceRoundTime: true,
              showDuration: false,
            })
            .on("changeTime", function () {
              var startInt = $arriveTimePicker.timepicker(
                "getSecondsFromMidnight"
              );

              var adp = $A.reg["ArrivalDate"],
                ddp = $A.reg["DepartureDate"],
                am = moment(
                  adp.date.format("yyyy-MM-dd") + " " + $arriveTimePicker.val(),
                  "YYYY-MM-DD hh:mm A"
                ),
                dm = moment(
                  ddp.date.format("yyyy-MM-dd") + " " + $departTimePicker.val(),
                  "YYYY-MM-DD hh:mm A"
                );

              var arrivalDate = Date.parse(
                $("#LAZ_ArriveDateTb").val() + " " + $arriveTimePicker.val()
              );
              var departureDate = Date.parse(
                $("#LAZ_DepartDateTb").val() + " " + $departTimePicker.val()
              );
              var dt = $arriveTimePicker.timepicker("getTime");
              dt.setHours(dt.getHours() + defaultHours);

              if (arrivalDate >= departureDate) {
                //if (am.isSameOrAfter(dm)) {
                $departTimePicker
                  .timepicker("option", {
                    minTime: startInt,
                    scrollDefaultTime: $arriveTimePicker.val(),
                    forceRoundTime: true,
                    showDuration: false,
                  })
                  .timepicker("setTime", dt);
                //}).timepicker('setTime', $arriveTimePicker.timepicker('getTime'));
              } else if (am.isBefore(dm)) {
                LAZWidget.UI.SetTime(
                  $departTimePicker,
                  MIN_TIME,
                  $arriveTimePicker.val()
                );
              }
              //GRSDESK - 3573
              //check arrive and depart datetime
              if (
                isNaN(Date.parse($("#LAZ_ArriveDateTb").val())) === false &&
                isNaN(Date.parse($("#LAZ_DepartDateTb").val())) === false
              ) {
                var adv = new Date($("#LAZ_ArriveDateTb").val()).format(
                  "yyyy-mm-dd"
                );
                var ddv = new Date($("#LAZ_DepartDateTb").val()).format(
                  "yyyy-mm-dd"
                );
                var isSamedate = LAZWidget.UI.IsSameDate(adv, ddv);
                if (isSamedate === true) {
                  //for same date,depart time will come after arrive time
                  if ($arriveTimePicker.val().split(" ").length > 0) {
                    var _mintime = LAZWidget.UI.GetMinTime($arriveTimePicker);
                    LAZWidget.UI.SetTime(
                      $departTimePicker,
                      _mintime,
                      $arriveTimePicker.val()
                    );
                    //LAZWidget.UI.SetDepartTime(adv, $arriveTimePicker, $departTimePicker);
                  }
                }
              }
              $arriveTimePicker.blur();
            });

          $A.setCalendar(
            "DepartureDate",
            document.getElementById("LAZ_DepartDateTb"),
            document.getElementById("LAZ_DepartDateTb"),
            false,
            undefined,
            {
              offsetTop: 30,
              condenseYear: true,
              drawFullCalendar: true,
              pageUpDownNatural: true,
              months: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
              days: [
                {
                  s: "S",
                  l: "Sun",
                },
                {
                  s: "M",
                  l: "Mon",
                },
                {
                  s: "T",
                  l: "Tue",
                },
                {
                  s: "W",
                  l: "Wed",
                },
                {
                  s: "T",
                  l: "Thu",
                },
                {
                  s: "F",
                  l: "Fri",
                },
                {
                  s: "S",
                  l: "Sat",
                },
              ],
              wdOffset: 0,
              inputDateFormat: "dddd, MMMM D, YYYY",
              runAfterClose: function (dc) {
                LAZWidget.UI.Setwidgetheight();
                var AD = moment($("#LAZ_ArriveDateTb").val()).format(
                    "YYYY-MM-DD"
                  ), //moment($A.reg['ArrivalDate'].date).format('YYYY-MM-DD'),
                  AT = $arriveTimePicker.val(),
                  DD = moment($("#LAZ_DepartDateTb").val()).format(
                    "YYYY-MM-DD"
                  ), //moment($A.reg['DepartureDate'].date).format('YYYY-MM-DD'),
                  DT = $departTimePicker.val();
                AT = AT.toLowerCase() === "time" ? "00:00" : AT;
                DT = DT.toLowerCase() === "time" ? "00:00" : DT;

                //var am = moment(AD + ' ' + AT, 'YYYY-MM-DD hh:mm A');
                //var dm = moment(DD + ' ' + DT, 'YYYY-MM-DD hh:mm A');

                var am = Date.parse(AD + " " + AT);
                var dm = Date.parse(DD + " " + DT);

                if (am >= dm) {
                  //if (am.isSameOrAfter(dm)) {
                  dt = $arriveTimePicker.timepicker("getTime");
                  dt.setHours(dt.getHours() + defaultHours);
                  // Set depart time picker to arrive time picker if arrive date and time are greater than departure date and time
                  $departTimePicker
                    .timepicker("option", {
                      minTime: $arriveTimePicker.timepicker("getTime"),
                    })
                    .timepicker("setTime", dt);
                } else if (am < dm && Date.parse(AD) !== Date.parse(DD)) {
                  // Set depart time picker's minimum time to arrival time's current time
                  //LAZWidget.UI.SetTime($departTimePicker, MIN_TIME, AT);
                  $departTimePicker
                    .timepicker("option", {
                      minTime: $arriveTimePicker.timepicker("getTime"),
                    })
                    .timepicker(
                      "setTime",
                      $arriveTimePicker.timepicker("getTime")
                    );
                }
                var adp = new Date($("#LAZ_ArriveDateTb").val());
                //if (adp.toString() === "Invalid Date") {
                //	$("#LAZ_ArriveDateTb").val(moment(new Date()).format('ddd, MMMM D, YYYY'));
                //	adp = new Date($('#LAZ_ArriveDateTb').val());
                //}

                var ddp = new Date($("#LAZ_DepartDateTb").val());
                if (ddp.toString() === "Invalid Date") {
                  $("#LAZ_DepartDateTb").val(
                    moment(new Date()).format("ddd, MMMM D, YYYY")
                  );
                  ddp = new Date($("#LAZ_DepartDateTb").val());
                }

                //if depart date is lower than arrival date, set depart date as arrival date
                if (
                  adp.toString().toLowerCase() !== "invalid date" &&
                  isNaN(Date.parse(adp)) === false &&
                  Date.parse(ddp) < Date.parse(adp)
                )
                  //$('#LAZ_ArriveDateTb').val(new Date($('#LAZ_DepartDateTb').val()).format("ddd, mmmm dd, yyyy"));
                  $("#LAZ_DepartDateTb").val(
                    new Date($("#LAZ_ArriveDateTb").val()).format(
                      "ddd, mmmm dd, yyyy"
                    )
                  );

                if (
                  moment(DD, "YYYY-MM-DD").isAfter(moment(AD, "YYYY-MM-DD"))
                ) {
                  LAZWidget.UI.SetTime($departTimePicker, MIN_TIME, AT);
                } else if (
                  moment(DD, "YYYY-MM-DD").isSame(moment(AD, "YYYY-MM-DD"))
                ) {
                  LAZWidget.UI.SetTime(
                    $departTimePicker,
                    AT,
                    $arriveTimePicker.val()
                  );
                }
                var timezoneDate_tmp =
                  lazGoLocations[0].TimeZoneDate.split(".")[0];
                var timezoneDate = new Date(timezoneDate_tmp);
                //GRSDESK - 3573
                //check arrive and depart datetime
                if (
                  isNaN(Date.parse($("#LAZ_ArriveDateTb").val())) === false &&
                  isNaN(Date.parse($("#LAZ_DepartDateTb").val())) === false
                ) {
                  var adv = new Date($("#LAZ_ArriveDateTb").val()).format(
                    "yyyy-mm-dd"
                  );
                  var ddv = new Date($("#LAZ_DepartDateTb").val()).format(
                    "yyyy-mm-dd"
                  );
                  var isSamedate = LAZWidget.UI.IsSameDate(adv, ddv);
                  if (isSamedate === false) {
                    LAZWidget.UI.SetTime(
                      $departTimePicker,
                      MIN_TIME,
                      $arriveTimePicker.val()
                    );
                  } else {
                    //for same date,depart time will come after arrive time
                    if ($arriveTimePicker.val().split(" ").length > 0) {
                      var _mintime = LAZWidget.UI.GetMinTime($arriveTimePicker);
                      LAZWidget.UI.SetTime(
                        $departTimePicker,
                        _mintime,
                        $arriveTimePicker.val()
                      );
                      //check same day
                      if (
                        Date.parse(timezoneDate.format("yyyy-mm-dd")) ===
                        Date.parse(
                          new Date($("#LAZ_ArriveDateTb").val()).format(
                            "yyyy-mm-dd"
                          )
                        )
                      ) {
                        var _mintime = LAZWidget.Helpers.Round2NextHalfHour(
                          LAZWidget.Helpers.AddMinutes(timezoneDate, 30),
                          false
                        );
                        _mintime = LAZWidget.UI.SetupBeforeTime(_mintime);
                        LAZWidget.UI.SetTime(
                          $arriveTimePicker,
                          _mintime,
                          _mintime
                        );
                      }
                    }
                  }
                }

                //GRSDESK-3583
                if (isNaN(Date.parse($("#LAZ_DepartDateTb").val())) === false) {
                  LAZWidget.UI.EnableGetRateButton();
                } else {
                  LAZWidget.UI.DisableGetRateButton();
                }
              },
            }
          );

          $("#LAZ_DepartDateTb").on("focus", function () {
            $(this).trigger("click");
          });

          $departTimePicker
            .timepicker({
              minTime: MIN_TIME,
              maxTime: MAX_TIME,
              scrollDefaultTime: LAZWidget.Helpers.Round2NextHalfHour(
                LAZWidget.Helpers.AddMinutes(new Date(), -30),
                false
              ),
              timeFormat: WidgetSettings.TimeFormat,
              showDuration: true,
              forceRoundTime: true,
            })
            .on("changeTime", function () {
              var _mintime = LAZWidget.UI.GetMinTime($arriveTimePicker);
              LAZWidget.UI.SetTime(
                $departTimePicker,
                _mintime,
                $arriveTimePicker.val()
              );
              $departTimePicker.blur();
            });

          LAZWidget.UI.SetTime(
            $departTimePicker,
            $arriveTimePicker.val(),
            $arriveTimePicker.val()
          );

          $(".init-time-depart")
            .off("focus")
            .on("focus", function () {
              var adp = $A.reg["ArrivalDate"];
              var ddp = $A.reg["DepartureDate"];

              var arrivalDT = new Date(
                adp.date.format(WidgetSettings.DateFormatLib) +
                  " " +
                  $arriveTimePicker.val()
              );
              var departDateStr = ddp.date.format(WidgetSettings.DateFormatLib);
              var days = 0,
                hrs = 0,
                mins = 0;

              setTimeout(function () {
                $(".ui-timepicker-wrapper .ui-timepicker-list li").each(
                  function () {
                    $(this).find("span").remove();
                    var departDT = new Date(
                        departDateStr + " " + $(this).html()
                      ),
                      interval = departDT.getTime() - arrivalDT.getTime(),
                      arr = LAZWidget.Helpers.DateDurations(interval);
                    days = arr[0];
                    hrs = arr[1];
                    mins = arr[2];
                    if (days >= 0)
                      $(this).append(
                        "<span class=dayCount> " +
                          days +
                          " d " +
                          hrs +
                          " hr " +
                          mins +
                          " m </span> "
                      );
                  }
                );
              }, 25);
            });
        },

        // Sets up the monthly date picker of the widget
        SetUpMonthlyPickers: function () {
          // Don't re-init if we already have done so
          if ($A.reg["MonthlyDate"] !== undefined)
            $A.reg["MonthlyDate"].unsetTrigger(); //return;

          var timezoneDate_tmp = lazGoLocations[0].TimeZoneDate.split(".")[0];
          var timezoneDate = new Date(timezoneDate_tmp);
          $A.setCalendar(
            "MonthlyDate",
            document.getElementById("LAZ_MonthlyDateTb"),
            document.getElementById("LAZ_MonthlyDateTb"),
            false,
            undefined,
            {
              offsetTop: 30,
              condenseYear: true,
              drawFullCalendar: true,
              pageUpDownNatural: true,
              months: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
              days: [
                {
                  s: "S",
                  l: "Sun",
                },
                {
                  s: "M",
                  l: "Mon",
                },
                {
                  s: "T",
                  l: "Tue",
                },
                {
                  s: "W",
                  l: "Wed",
                },
                {
                  s: "T",
                  l: "Thu",
                },
                {
                  s: "F",
                  l: "Fri",
                },
                {
                  s: "S",
                  l: "Sat",
                },
              ],
              wdOffset: 0,
              inputDateFormat: "dddd, MMMM D, YYYY",
              minDate: timezoneDate,
              runAfterClose: function (dc) {
                LAZWidget.UI.Setwidgetheight();
              },
            }
          );
        },

        // Sets up the date picker for the fixed expiry widget type
        SetUpFixedExpiryPicker: function () {
          // Don't re-init if we already have done so
          if ($A.reg["FixedExpiryDate"] !== undefined) return;

          var timezoneDate_tmp =
            lazGoLocations[0].TimeZoneDate.toLocaleString();
          var timezoneDate = new Date(timezoneDate_tmp);

          $A.setCalendar(
            "FixedExpiryDate",
            document.getElementById("LAZ_FixedExpiryDateTb"),
            document.getElementById("LAZ_FixedExpiryDateTb"),
            false,
            undefined,
            {
              offsetTop: 30,
              condenseYear: true,
              drawFullCalendar: true,
              pageUpDownNatural: true,
              months: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
              days: [
                {
                  s: "S",
                  l: "Sun",
                },
                {
                  s: "M",
                  l: "Mon",
                },
                {
                  s: "T",
                  l: "Tue",
                },
                {
                  s: "W",
                  l: "Wed",
                },
                {
                  s: "T",
                  l: "Thu",
                },
                {
                  s: "F",
                  l: "Fri",
                },
                {
                  s: "S",
                  l: "Sat",
                },
              ],
              wdOffset: 0,
              inputDateFormat: "dddd, MMMM D, YYYY",
              minDate: timezoneDate,
              runAfterClose: function (dc) {
                LAZWidget.UI.Setwidgetheight();
              },
            }
          );
        },

        // Sets up the date picker for the fixed expiry widget type
        SetUpFixedAccessPickers: function () {
          // Don't re-init if we already have done so
          if ($A.reg["FixedAccessDate"] !== undefined)
            $A.reg["FixedAccessDate"].unsetTrigger(); //return;

          $arriveTimePicker = $("#LAZ_FixedAccessTimeTb");
          var timezoneDate_tmp = lazGoLocations[0].TimeZoneDate.split(".")[0];
          var timezoneDate = new Date(timezoneDate_tmp);

          var MIN_TIME = "12:00 AM",
            MAX_TIME = "11:30 PM",
            SETAMINUTES = 0,
            padded1HourTimeframe = LAZWidget.Helpers.Round2ClosestHalfHour(
              LAZWidget.Helpers.AddMinutes(timezoneDate, 30),
              false
            ),
            padded2HourTimeframe = LAZWidget.Helpers.Round2ClosestHalfHour(
              LAZWidget.Helpers.AddMinutes(timezoneDate, +120),
              false
            );

          $arriveTimePicker
            .timepicker({
              minTime: padded1HourTimeframe,
              maxTime: MAX_TIME,
              scrollDefaultTime: LAZWidget.Helpers.Round2NextHalfHour(
                LAZWidget.Helpers.AddMinutes(timezoneDate, -30),
                false
              ),
              timeFormat: WidgetSettings.TimeFormat,
              forceRoundTime: true,
              showDuration: false,
            })
            .on("changeTime", function () {
              LAZWidget.UI.EnableGetRateButton();
              $arriveTimePicker.blur();
            });
          //LAZWidget.UI.SetDefaultTime($arriveTimePicker);

          $A.setCalendar(
            "FixedAccessDate",
            document.getElementById("LAZ_FixedAccessDateTb"),
            document.getElementById("LAZ_FixedAccessDateTb"),
            false,
            undefined,
            {
              offsetTop: 30,
              condenseYear: true,
              drawFullCalendar: true,
              pageUpDownNatural: true,
              months: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
              days: [
                {
                  s: "S",
                  l: "Sun",
                },
                {
                  s: "M",
                  l: "Mon",
                },
                {
                  s: "T",
                  l: "Tue",
                },
                {
                  s: "W",
                  l: "Wed",
                },
                {
                  s: "T",
                  l: "Thu",
                },
                {
                  s: "F",
                  l: "Fri",
                },
                {
                  s: "S",
                  l: "Sat",
                },
              ],
              wdOffset: 0,
              inputDateFormat: "dddd, MMMM D, YYYY",
              minDate: timezoneDate,
              runAfterClose: function (dc) {
                LAZWidget.UI.Setwidgetheight();
                var timezoneDate_tmp =
                  lazGoLocations[0].TimeZoneDate.split(".")[0];
                var timezoneDate = new Date(timezoneDate_tmp);
                var fad = new Date($("#LAZ_FixedAccessDateTb").val());
                if (fad.toString() === "Invalid Date")
                  $("#LAZ_FixedAccessDateTb").val(
                    moment(new Date()).format("ddd, MMMM D, YYYY")
                  );

                if (
                  Date.parse(timezoneDate.format("yyyy-mm-dd")) <
                  Date.parse(
                    new Date($("#LAZ_FixedAccessDateTb").val()).format(
                      "yyyy-mm-dd"
                    )
                  )
                ) {
                  $arriveTimePicker.timepicker("option", {
                    minTime: MIN_TIME,
                  });
                } else {
                  //GRSDESK-3573
                  if (
                    Date.parse(timezoneDate.format("yyyy-mm-dd")) ===
                    Date.parse(
                      new Date($("#LAZ_FixedAccessDateTb").val()).format(
                        "yyyy-mm-dd"
                      )
                    )
                  ) {
                    var _mintime = LAZWidget.Helpers.Round2NextHalfHour(
                      LAZWidget.Helpers.AddMinutes(timezoneDate, 30),
                      false
                    );
                    if (WidgetSettings.WidgetType !== "FAP")
                      _mintime = LAZWidget.UI.SetupBeforeTime(_mintime);
                    LAZWidget.UI.SetTime($arriveTimePicker, _mintime, _mintime);
                  } else {
                    var _mintime = LAZWidget.Helpers.Round2NextHalfHour(
                      LAZWidget.Helpers.AddMinutes(timezoneDate, 30),
                      false
                    );
                    LAZWidget.UI.SetTime($arriveTimePicker, _mintime, _mintime);
                  }
                }

                if (WidgetValues.HideFixedAccessTime == false) {
                  // && $('#LAZ_FixedAccessTimeTb').val() == Language.objLang.TIME)
                  LAZWidget.UI.SetDefaultTime($("#LAZ_FixedAccessTimeTb"));
                  var currentTime = LAZWidget.UI.GetCurrentTime();
                  if (currentTime !== "")
                    $("#LAZ_FixedAccessTimeTb").val(currentTime);
                }
                LAZWidget.UI.EnableGetRateButton();
              },
            }
          );
        },

        GetCurrentTime: function () {
          var timezoneDateString =
            lazGoLocations.length > 0 ? lazGoLocations[0].TimeZoneDate : "";
          var currentTime = "";
          if (timezoneDateString !== "") {
            timezoneDateString = timezoneDateString.split(".")[0];
            timezoneDate = new Date(timezoneDateString);
            var minutes = LAZWidget.UI.TimeDiff();
            timezoneDate.setMinutes(timezoneDate.getMinutes() + minutes);
            currentTime = timezoneDate
              .format(WidgetSettings.TimeFormatLib)
              .toLocaleString();
          }
          return currentTime;
        },

        SetDefaultTime: function (control, arrivalDateTime) {
          var arriveDepart =
            arrivalDateTime == null
              ? WidgetSettings.StartDT
              : WidgetSettings.EndDT;
          var timezoneDateString = lazGoLocations[0].TimeZoneDate;
          timezoneDateString = timezoneDateString.split(".")[0];

          var timezoneDate = new Date(timezoneDateString);
          var minutes = LAZWidget.UI.TimeDiff();
          timezoneDate.setMinutes(timezoneDate.getMinutes() + minutes);
          //var timezoneDate_tmp = lazGoLocations[0].TimeZoneDate.toLocaleString();
          //var timezoneDate = new Date(timezoneDate_tmp);
          if (arriveDepart !== null) {
            control.timepicker(
              "setTime",
              moment(arriveDepart, "YYYY-MM-DD h:m A").toDate()
            );
          } else {
            var minutesToAdd = 0;
            if (arrivalDateTime == null) {
              minutesToAdd =
                WidgetSettings.TimeOffsetArrive == 0
                  ? 30
                  : WidgetSettings.TimeOffsetArrive;
              minutesToAdd = LAZWidget.Helpers.Round2NextHalfHour(
                LAZWidget.Helpers.AddMinutes(timezoneDate, minutesToAdd),
                false
              );
            } else {
              minutesToAdd =
                WidgetSettings.TimeOffsetDepart == 0
                  ? 60
                  : WidgetSettings.TimeOffsetDepart;
              minutesToAdd = LAZWidget.Helpers.Round2NextHalfHour(
                LAZWidget.Helpers.AddMinutes(arrivalDateTime, minutesToAdd),
                false
              );
            }

            control.timepicker("setTime", minutesToAdd);
          }
        },

        //SetCurrentTime: function (control, arrivalDateTime) {
        //	var arriveDepart = (arrivalDateTime == null) ? WidgetSettings.StartDT : WidgetSettings.EndDT;
        //	var timezoneDateString = lazGoLocations[0].TimeZoneDate;
        //	timezoneDateString = timezoneDateString.split('.')[0];
        //	var timezoneDate = new Date(timezoneDateString);
        //	var minutes = LAZWidget.UI.TimeDiff();
        //	timezoneDate.setMinutes(timezoneDate.getMinutes() + minutes);
        //	if (arriveDepart !== null) {
        //		control.timepicker('setTime', moment(arriveDepart, 'YYYY-MM-DD h:m A').toDate());
        //	} else {
        //		var minutesToAdd = 0; var date;
        //		if (arrivalDateTime == null) {
        //			minutesToAdd = (WidgetSettings.TimeOffsetArrive == 0) ? 0 : WidgetSettings.TimeOffsetArrive;
        //			date = LAZWidget.Helpers.AddMinutes(timezoneDate, minutesToAdd);
        //			minutesToAdd = date.getHours('H') + ':' + date.getMinutes('i');
        //		} else {
        //			minutesToAdd = (WidgetSettings.TimeOffsetDepart == 0) ? 0 : WidgetSettings.TimeOffsetDepart;
        //			date = LAZWidget.Helpers.AddMinutes(arrivalDateTime, minutesToAdd);
        //			minutesToAdd = date.getHours('H') + ':' + date.getMinutes('i');
        //		}
        //		control.timepicker('setTime', minutesToAdd);
        //	}
        //},

        SetCurrentTime: function (control) {
          LAZWidget.UI.SetDefaultTime(control);
          var timezoneDateString =
            lazGoLocations.length > 0 ? lazGoLocations[0].TimeZoneDate : "";
          if (timezoneDateString !== "") {
            timezoneDateString = timezoneDateString.split(".")[0];
            timezoneDate = new Date(timezoneDateString);
            var minutes = LAZWidget.UI.TimeDiff();
            timezoneDate.setMinutes(timezoneDate.getMinutes() + minutes);
            var currentTime = timezoneDate
              .format(WidgetSettings.TimeFormatLib)
              .toLocaleString();
            $(control).val(currentTime);
          }
        },
        SetDepartTime: function (adv, $arriveTimePicker, $departTimePicker) {
          // set 2 hours ahead from arrival time.
          var adt = new Date(adv + " " + $arriveTimePicker.val());
          adt.setHours(adt.getHours() + 2);
          $departTimePicker.val(adt.format("hh:MM TT"));
        },
        // Displays the ajax loading icon
        ShowLoader: function () {
          $("div.loader").show();
        },

        // Hides the ajax loading icon
        CloseLoader: function () {
          $("div.loader").fadeOut("normal");
        },

        ShowRateError: function () {
          $("#LAZ_RateError").text("Invalid date/time selection").show();
        },

        HideRateError: function () {
          $("#LAZ_RateError").text("").hide();
        },

        // Method to put the widget into a default state when the 'Select parking location' option is selected
        SelectLocationDefault: function () {
          if (WidgetSettings.eventdriven === false) {
            LAZWidget.UI.DisableAllModes(true);
            $("#btnGetRate").val(Language.objLang.CONTINUE);
          } else $("#btnGetRate").val(Language.objLang.GETRATE);
        },

        SetUpMap: function () {
          if (WidgetSettings.UseMap)
            $("#LAZ_Locations_Select .chosen-drop").prepend(
              $("<div>", {
                id: "lazGoMapDiv",
                style: "height:150px;width:97%;margin:0 1.5% 1.5%;",
              })
            );
        },
        //GRSDESK-3583
        GetControlId: function (wtmode) {
          var cid = "";
          switch (wtmode.toUpperCase()) {
            case "TMD":
              cid = "LAZ_UseTimedRb";
              break;
            case "EVT":
              cid = "LAZ_UseEventRb";
              break;
            case "FAP":
              cid = "LAZ_UseFixedAccessRb";
              break;
            case "FEP":
              cid = "LAZ_UseFixedExpiryRb";
              break;
            case "MPS":
              cid = "LAZ_UseMonthlyRb";
              break;
            case "PST":
              cid = "LAZ_UsePresetRb";
              break;
            case "MUP":
              cid = "LAZ_UseMultiUsePassRb";
              break;
            default:
              cid = "LAZ_UseTimedRb";
              break;
          }
          return cid;
        },

        //GRSDESK-3573
        //add 30 min. to given time
        GetMinTime: function (timePicker) {
          var _mintime = "Time";
          var timezoneDate_tmp =
            lazGoLocations[0].TimeZoneDate.toLocaleString();
          var timezoneDate = new Date(timezoneDate_tmp);
          var _hh = timePicker.val().split(" ")[0].split(":")[0];
          var _mm = timePicker.val().split(" ")[0].split(":")[1];
          if (_mm === null || _mm === undefined)
            return LAZWidget.Helpers.Round2NextHalfHour(
              LAZWidget.Helpers.AddMinutes(timezoneDate, 60),
              false
            );
          if (parseInt(_mm) === 0) {
            _mintime = _hh + ":30" + " " + timePicker.val().split(" ")[1]; //AM/PM
          } else {
            _mintime =
              (parseInt(_hh) + 1).toString() +
              ":00" +
              " " +
              timePicker.val().split(" ")[1]; //AM/PM
          }
          return _mintime;
        },
        //GRSDESK-3573
        IsSameDate: function (arrivalDate, departureDate) {
          return Date.parse(arrivalDate) === Date.parse(departureDate);
          //&& (Date.parse(new Date().format("yyyy-mm-dd")) === Date.parse(arrivalDate.date.format("yyyy-mm-dd"))));
        },
        //GRSDESK-3573
        SetTime: function (tp, mintime, scrollTime) {
          var forceRoundTime = true;
          if (WidgetSettings.WidgetType === "FAP") forceRoundTime = false;
          scrollTime =
            scrollTime === null ||
            scrollTime === undefined ||
            scrollTime === "" ||
            scrollTime === "Time"
              ? LAZWidget.Helpers.Round2NextHalfHour(
                  LAZWidget.Helpers.AddMinutes(new Date(), -30),
                  false
                )
              : scrollTime;
          tp.timepicker("option", {
            minTime: mintime,
            forceRoundTime: forceRoundTime,
            showDuration: false,
            scrollDefaultTime: scrollTime,
          });
        },
        //GRSDESK-3628
        SetupBeforeTime: function (padded1HourTimeframe) {
          if (parseInt(padded1HourTimeframe.split(":")[1]) == 0) {
            padded1HourTimeframe =
              (parseInt(padded1HourTimeframe.split(":")[0]) - 1).toString() +
              ":" +
              WidgetSettings.BeforeReservationTime;
          } else {
            padded1HourTimeframe = padded1HourTimeframe.split(":")[0];
          }
          return padded1HourTimeframe;
        },
        //GRSDESK-2790
        TimeDiff: function () {
          var currentDate = appStartTime.toLocaleString();
          var milliseconds =
            Date.parse(new Date().toLocaleString()) - Date.parse(currentDate);
          var minutes = Math.floor(milliseconds / 60000);
          return minutes;
        },

        Setwidgetheight: function () {
          var iscalexpand = $("body").find("table").hasClass("calendar");
          var isdropexpand = $("body")
            .find(".chosen-container")
            .hasClass("chosen-with-drop");
          if (iscalexpand === true || isdropexpand === true)
            $("#LAZ_Widget").css("height", "70%");
          else $("#LAZ_Widget").css("height", "40%");
        },

        GetCurrentlocationTime: function () {
          var minutes = LAZWidget.UI.TimeDiff();
          var locationDateString = lazGoLocations[0].TimeZoneDate;
          locationDateString = locationDateString.split(".")[0];
          var locationstartDateTime = new Date(locationDateString);
          locationstartDateTime.setMinutes(
            locationstartDateTime.getMinutes() + minutes
          );
          return locationstartDateTime;
        },
      };

      LAZWidget.Main.Initialize();
    };

    function SetListeners() {
      // Extend jQuery object to include LAZParkingWidget
      (function ($) {
        $.fn.LAZParkingWidget = function (options) {
          //--- set a reference to the object that has the facility finder attached to it
          //if (typeof(options) == 'undefined') { };

          options = $.extend(
            {
              StartDateTime: null,
              EndDateTime: null,
              TimeOffsetArrive: 120,
              TimeOffsetDepart: 240,
              FacilityID: ["8714"],
              Mode: "Timed",
            },
            options
          );
          //---

          // Execute anonymous self-contained function
          LAZWidget(options);
        };
      })(jQuery);

      $(function () {
        var WidgetDiv = jQuery(".parkingwidget");
        WidgetDiv.first().attr("id", "LAZ_Widget");
        $("#LAZ_Widget").LAZParkingWidget();
      });
    }
  }
);
//GRSDESK-3438 jQuery file is conflicting in some client widget.
jQuery("body").on("click", "#hamburger_icon", function () {
  jQuery(".side-menu").toggleClass("open");
});

jQuery("body").on("click", function (e) {
  if (
    jQuery(e.target).closest(".side-menu").length == 0 &&
    jQuery(".side-menu").hasClass("open") &&
    jQuery(e.target).closest("#hamburger_icon").length == 0
  ) {
    jQuery(".side-menu").toggleClass("open");
  }
});
