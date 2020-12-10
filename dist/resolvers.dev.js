"use strict";

var db = require('./db');

var _require = require('apollo-server-express'),
    UserInputError = _require.UserInputError;

var Query = {
  jobs: function jobs() {
    return db.jobs.list();
  },
  job: function job(root, _ref) {
    var id = _ref.id;
    return db.jobs.get(id);
  },
  company: function company(root, _ref2) {
    var id = _ref2.id;
    return !db.companies.get(id) ? new UserInputError("could not find a company with id of ".concat(id)) : db.companies.get(id);
  }
};
var Job = {
  company: function company(job) {
    db.companies.get(job.companyId);
  }
};
module.exports = {
  Query: Query,
  Job: Job
};