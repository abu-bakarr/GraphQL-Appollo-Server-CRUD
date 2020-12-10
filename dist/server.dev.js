"use strict";

var _require = require('apollo-server-express'),
    gql = _require.gql,
    ApolloServer = _require.ApolloServer;

var fs = require('fs');
var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var db = require('./db');

var jwtSecret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');
var app = express();
app.use(cors(), bodyParser.json(), expressJwt({
  secret: jwtSecret,
  credentialsRequired: false
}));
var typeDefs = gql(fs.readFileSync('./schema.graphql', {
  encoding: 'utf8'
}));

var resolvers = require('./resolvers');

var apolloServer = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers
});
apolloServer.applyMiddleware({
  app: app,
  path: "/graphql"
});

app.post('/login', function (req, res) {
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password;
  var user = db.users.list().find(function (user) {
    return user.email === email;
  });

  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }

  var token = jwt.sign({
    sub: user.id
  }, jwtSecret);
  res.send({
    token: token
  });
});


app.listen(port, function () {
  return console.info("Server started on port ".concat(port));
});