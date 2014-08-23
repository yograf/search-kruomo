var pref = require("sdk/simple-prefs").prefs;
var { ToggleButton } = require("sdk/ui/button/toggle");
var self = require("sdk/self");
var clipboard = require("sdk/clipboard");
var notifications = require("sdk/notifications");
var tabs = require("sdk/tabs");
var button = ToggleButton({
  id: "style-tab",
  label: "Style Tab",
  icon: "./icon-16.png",
  onChange: function(state) {
    worker = tabs.activeTab.attach({
      contentScriptFile: [self.data.url("jquery-1.4.4.min.js"), self.data.url("my-script.js")],
       contentScriptOptions: pref,
    });
    worker.port.on("my-addon-message", function(response) {
      clipboard.set(response);
      var skIconURL = self.data.url("icon-32.png");
      notifications.notify({
        text: response + " copied to clipboard.",
        iconURL: skIconURL
      });
    });
  }
});
