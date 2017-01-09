var admin = require("firebase-admin");
var properties = require ("properties");
var schedule = require('node-schedule');
var dateFormat = require('dateformat');
const fs = require('fs');

const backupOutputPath = "backup_output/";
if (!fs.existsSync(backupOutputPath)) {
  fs.mkdirSync(backupOutputPath);
}

// Load settings.properties
properties.parse("settings.properties", { path: true }, function (error, obj){
  if (error) return console.error (error);
  console.log (obj);
  afterSettingsLoaded(obj);
});



var afterSettingsLoaded = function(settings) {
  admin.initializeApp({
    credential: admin.credential.cert("firebase-adminsdk.json"),
    databaseURL: settings.databaseURL
  });

  // schedule.scheduleJob('0 * * * * *', backupFirebase);
  backupFirebase();

}

var backupFirebase = function() {
  var rootRef = admin.database().ref();
  rootRef.once('value', function(snapshot) {
      var value = snapshot.val();
      var jsonValue = JSON.stringify(value, null, 2);
      console.log("value : " + jsonValue);

      var now = new Date();
      var strDate = dateFormat(now, "yyyy_mm_dd_hh_MM_ss");
      console.log("time : " + strDate);

      var path = backupOutputPath + strDate + ".json";

      fs.writeFile(path, jsonValue, function(error) {
          if (error) {
            console.error("write error:  " + error.message);
          } else {
            console.log("Successful Write to " + path);
          }
      });
  });
}

console.log("Running ...");