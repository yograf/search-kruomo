var pref = require("sdk/simple-prefs").prefs;
var { ToggleButton } = require("sdk/ui/button/toggle");
var self = require("sdk/self");
var clipboard = require("sdk/clipboard");
var notifications = require("sdk/notifications");
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var button = ToggleButton({
  id: "my-button",
  label: "my button",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png"
  },
  onClick: function(state) {
    pageMod.PageMod({
      include: ["*"],
      contentScriptWhen: 'ready',
      attachTo: ["existing", "top"],
      contentScriptOptions: pref,
      contentScriptFile: [self.data.url("jquery-1.4.4.min.js"), self.data.url("my-script.js")],
      contentStyleFile: self.data.url("search-krumo.css"),
      onAttach: function(worker) {

        worker.port.on("my-addon-message", function(response) {
          clipboard.set(response);
          var skIconURL = self.data.url("icon-32.png");
          notifications.notify({
            text: response + " copied to clipboard.",
            iconURL: skIconURL
          });
        });
        worker.port.on("no-krumo", function(response) {
          if (response) {

          button.state('window', {disabled: false, checked: true});
          }
          else {

          button.state('window', {disabled: true});
          }
        });
      }
    });
  }
});
