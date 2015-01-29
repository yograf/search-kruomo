var pref = require("sdk/simple-prefs").prefs;
var buttons = require('sdk/ui/button/action');
var self = require("sdk/self");
var clipboard = require("sdk/clipboard");
var notifications = require("sdk/notifications");
var tabs = require("sdk/tabs");
var { attach, detach } = require('sdk/content/mod');
var { Style } = require('sdk/stylesheet/style');
var style = Style({
  uri: './search-krumo.css'
});
var button = buttons.ActionButton({
  id: "search-krumo",
  label: "Search Krumo",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png"
  },
  onClick: function() {
    var worker = tabs.activeTab.attach({
      contentScriptOptions: pref,
      contentScriptFile: [self.data.url("jquery-1.4.4.min.js"), self.data.url("search-krumo.js")]
    });
    attach(style, tabs.activeTab);
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
