var plugin = {},
  common = require("../../../api/utils/common.js"),
  plugins = require("../../pluginManager.js");

(function(plugin) {
  plugins.register("/i/my-metric", function(ob) {
    //get parameters
    var params = ob.params; //request params
    var validate = ob.validateUserForDataWriteAPI; //user validation
    validate(params, function(params) {
      if (
        params.qstring &&
        params.qstring.app_key &&
        params.qstring.device_id &&
        params.qstring.my_metric &&
        params.qstring.my_metric_count
      ) {
        var data = params.qstring;
        common.db.collection("my-metric").insert(data, function(err, app) {
          if (err) common.returnMessage(params, 200, err);
          else common.returnMessage(params, 200, "Success");
        });
      } else {
        common.returnMessage(params, 400, "Invalid query");
      }
    });
    //need to return true, so core does not repond that path does not exist
    return true;
  });

  plugins.register("/o", function(ob) {
    var params = ob.params;
    var validateUserForDataReadAPI = ob.validateUserForDataReadAPI;

    //if user requested to read our metric
    if (params.qstring.method == "my-metric") {
      //validate user and output data using fetchTimeObj method
      validateUserForDataReadAPI(params, fetch.fetchTimeObj, "my-metric");

      //return true, we responded to this request
      return true;
    }

    //else we are not interested in this request
    return false;
  });
})(plugin);

module.exports = plugin;
