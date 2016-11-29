'use strict';
var pg = require('pg');

const client = new pg.Client('postgres://master:!ChangeM3!@greenscore.cmszhobo0jb9.us-east-1.rds.amazonaws.com:5432/GreenScore');
client.connect();

var CONSUMPTION = {
  "bus":160,
  "subway":90,
  "tram":90,
  "bike":0
}

module.exports.hello = (event, context, callback) => {

  console.log("event",event)

//   {
//     "subway":{
//   "distance":"4",
//   "start_station":"Union square"
//   "end_station":"Powell"
// },
//     "bus":"4",
//     "bike":"10",
//     "driving":"10"
//   }

// var jsonRESP={
//   "subway":"0.80",
//   "bus":"0.70",
//   "bike":"1",
//   "driving":"0.50"
// }
// context.succeed(jsonRESP)

//FOR CAR
// G = distance*CO2

if(event.type == "TRANSIT"){
  console.log("HERE TRANSIT")
  event.bus = {
    "route_id":1
  };
  var query = client.query('SELECT "ROUTE","AVE_RIDERS" FROM public."ROUTE_AVERAGE" WHERE "ROUTE" = \''+event.bus.route_id+'\' ');
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        var jsonString = JSON.stringify(result.rows[0]);
        var jsonObj = JSON.parse(jsonString);
        console.log("JSONSTRING",jsonString);
        var greenscore = (event.distance*CONSUMPTION["bus"])/(jsonObj["AVE_RIDERS"]/24)
        // client.end();
        context.succeed({"GS":greenscore});
    });
}else if(event.type == "DRIVING"){
  event.car = {
    "model":"Volt",
    "make":"Chevrolet",
    "year":2011
  };

  var query = client.query('SELECT "MAKE","MODEL","YEAR","CO2" FROM public."CAR_INFO" WHERE "MAKE"= \''+event.car.make+'\' AND "MODEL"= \''+event.car.model+'\' AND "YEAR"= '+event.car.year+' ');
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        var jsonString = JSON.stringify(result.rows[0]);
        var jsonObj = JSON.parse(jsonString);
        var greenscore = event.distance*jsonObj["CO2"]
        console.log(greenscore);
        context.succeed({"GS":greenscore});
    });
}else if(event.type == "SUBWAY"){
  event.subway = {
    "station":"Midway Airport"
  }
  var query = client.query('SELECT "STATION","AVERAGE_RIDE" FROM public."STATION_AVERAGE" WHERE "STATION" = \''+event.subway.station+'\' ');
      query.on("row", function (row, result) {
          result.addRow(row);
      });
      query.on("end", function (result) {
          var jsonString = JSON.stringify(result.rows[0]);
          var jsonObj = JSON.parse(jsonString);
          var greenscore = (event.distance*CONSUMPTION["subway"])/(jsonObj["AVERAGE_RIDE"]/24)
          console.log(greenscore);
        context.succeed({"GS":greenscore});
      });
}else if(event.type == "BICYCLING"){
  var greenscore =Math.abs(Math.random() * (0.35 - (-0.35)) + (-0.35)) //RANDOM
  context.succeed({"GS":greenscore});
}

  //IF TRANSPORT = BUS



    //IF TRANSPORT = CAR
    //

    //IF TRANSPORT = SUBWAY
    //

  // callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });


};
