'use strict';

var pg = require('pg');

const client = new pg.Client('postgres://master:!ChangeM3!@greenscore.cmszhobo0jb9.us-east-1.rds.amazonaws.com:5432/GreenScore');
client.connect();


module.exports.hello = (event, context, callback) => {
  /*
    rating: 111
    rate: 4
  */


  var query = client.query('UPDATE public."TRANSPORTATION" SET "RATING" = '+event.rating+' WHERE "TRANSPORTATION_ID" = '+event.transportation_id+';');
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
      console.log("RRRESULT",result);
        var jsonString = JSON.stringify(result.rows);
        var jsonObj = JSON.parse(jsonString);
        console.log("JSONSTRING",jsonString);
        context.succeed({"status":200});
    });

  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'Go Serverless v1.0! Your function executed successfully!',
  //     input: event,
  //   }),
  // };
  //
  // callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
