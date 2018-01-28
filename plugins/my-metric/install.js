var async = require("async"),
  pluginManager = require("../pluginManager.js"),
  countlyDb = pluginManager.dbConnection();
console.log("Installing my-metric plugin");
countlyDb
  .collection("apps")
  .find({})
  .toArray(function(err, apps) {
    if (!apps || err) {
      return;
    }

    function upgrade(app, done) {
      console.log("Adding indexes to " + app.name);
      countlyDb
        .collection("app_users" + app._id)
        .ensureIndex({ name: 1 }, done);
    }

    async.forEach(apps, upgrade, function() {
      console.log("My Metric plugin installation finished");
      countlyDb.close();
    });
  });
