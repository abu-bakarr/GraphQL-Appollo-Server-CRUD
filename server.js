const {gql, ApolloServer} = require('apollo-server-express')
const fs = require('fs')
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();


const jwtSecret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

const app = express();
app.use(cors(), bodyParser.json(), expressJwt({
  secret: jwtSecret,
  credentialsRequired: false
}));

const typeDefs = gql(fs.readFileSync('./schema.graphql', {encoding: 'utf8'}))

const resolvers = require('./resolvers')


const apolloServer = new ApolloServer({ typeDefs, resolvers })
apolloServer.applyMiddleware({app, path: "/graphql"})


app.listen(process.env.PORT, () => 
    console.info(`Server started on PORT ${process.env.PORT}`)
);
