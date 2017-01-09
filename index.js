var admin = require("firebase-admin");
var properties = require ("properties");

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

  var rootRef = admin.database().ref();
  rootRef.once('value', function(snapshot) {
      var value = snapshot.val();
      console.log("value : " + JSON.stringify(value));
  });
}

console.log("Test run");