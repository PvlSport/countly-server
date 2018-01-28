var plugin = {},
  countlyConfig = require("../../../frontend/express/config");

(function(plugin) {
  plugin.init = function(app, countlyDb, express) {
    //add your middleware or process requests here
    app.get(countlyConfig.path + "/my-metric", function(req, res, next) {
      //get url parameters
      var parts = req.url.split("/");
      var id = parts[parts.length - 1];

      //read data from db using countlyDB
      countlyDb
        .collection("my-metric")
        .findOne({ _id: id }, function(err, plugindata) {
          //if no data available
          if (err || !att) res.send("404: Page not Found", 404);
          else {
            //render template with data
            res.render(
              "../../../plugins/my-metric/frontend/public/templates/my-metric",
              {
                path: countlyConfig.path || "",
                cdn: countlyConfig.cdn || "",
                data: plugindata
              }
            );
          }
        });
    });
  };
})(plugin);

module.exports = plugin;
