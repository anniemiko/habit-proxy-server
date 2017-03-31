var express = require('express');
var request = require('request');
var app = express();
var cors = require('cors');

app.use(cors()); //allows overriding cross origin policy (use npm install if needed)

app.get('/test', function(req, res){ // listens for request on /api route
 console.log('working!');
 res.send('working!'); // if no errors, send the body of data back to front end
});

/* PUT YOUR CODE BETWEEN COMMENTS */

var config = {
 url: {
   request: "https://getpocket.com/v3/oauth/request",
   authorize: "https://getpocket.com/v3/oauth/authorize",
   gett: "https://getpocket.com/v3/get"
 },
 headers: {
   "content-type": "application/x-www-form-urlencoded",
   "X-Accept": "application/json"
 }
}

// STEP 1: OBTAIN A PLATFORM CONSUMER KEY; TYPE STRING

const CONSUMER_KEY = '64685-8fb9b370179438511c36a982';

// var request_token;

// STEP 2: OBTAIN A REQUEST TOKEN

app.get('/request', function(req, res) {
 var options = {
   headers: config.headers,
   url: config.url.request,
   body: "consumer_key=" + CONSUMER_KEY + "&redirect_uri=" + config.url.redirect,
 };

 request.post(options, function(error, response, body) {
   var request_token = JSON.parse(body).code;
   var url = "https://getpocket.com/auth/authorize" + '?request_token=' + request_token + '&redirect_uri=' + 'https://anniemiko.github.io/Final-Project/#habitdetail/' + req.query.habitId;

   res.send({
     url,
     request_token
   });
 });
});

// STEP 3

// STEP 4: CONVERT YOUR REQUEST TOKEN INTO A POCKET ACCESS TOKEN

app.get('/token', function(req, res) {
 var options = {
   headers: config.headers,
   url: config.url.authorize,
   body: "consumer_key=" + CONSUMER_KEY + "&code=" + req.query.request_token + '&redirect_uri=' + config.url.redirect
 }

 request.post(options, function(error,response, body){
   var access_token = JSON.parse(body).access_token;
   res.send(access_token)
 });
});

// STEP 6: USE POCKET ACCESS TOKEN TO RETRIEVE FROM POCKET

app.get('/gett', function(req, res) {
 var options = {
   headers: config.headers,
   url: config.url.gett,
   body: "consumer_key=" + CONSUMER_KEY + "&access_token=" + req.query.access_token + "&tag=" + req.query.tag
 };

  request.post(options, function(error, response, body){
    res.send(JSON.parse(body))
  })
 })

/* PUT YOUR CODE ABOVE THIS COMMENT */

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Server running on port 3000');
