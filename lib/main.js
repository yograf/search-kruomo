var pref = require("sdk/simple-prefs").prefs;
var {ToggleButton} = require("sdk/ui/button/toggle");
var self = require("sdk/self");
var clipboard = require("sdk/clipboard");
var notifications = require("sdk/notifications");
var pageMod = require("sdk/page-mod");
var workers = [];
var button = ToggleButton({
  id: "search-krumo",
  label: "Search Krumo",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png"
  },
  onClick: function(state) {
    if (!state.disabled && !state.checked) {
      console.log(workers);
      // Get the active tab's title.
    }
    else {
      pageMod.PageMod({
        include: ["*"],
        contentScriptWhen: 'ready',
        attachTo: ["existing", "top"],
        contentScriptOptions: pref,
        contentScriptFile: [self.data.url("jquery-1.4.4.min.js"), self.data.url("my-script.js")],
        contentStyleFile: self.data.url("search-krumo.css"),
        onAttach: function(worker) {
          worker.port.on("checkKrumo", function(krumo) {
            if (krumo) {
              workers.push(worker);
            }
            else {
              worker.destroy();
              return void 0;
            }
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
    }
  }
});
