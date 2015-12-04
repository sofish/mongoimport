'use strict';

const mongoimport = require('../');
var host = '127.0.0.1:27017';
var db = 'mongoimport';
var collection = function(fields) {
  return fields[0].name;
};
var fields = [{ name: 'sofish', createdAt: '1986', isBot: 'guess me', isFun: 'try me' }];
var config = {host, db, collection, callback, fields}

mongoimport(config, callback);

function callback(err, ret) {
  if(err) {
    if(err.message.match('ECONNREFUSED')) console.log('✘  make sure you have started mongodb server');
    if(err.message.match('Authentication')) console.log('✘  make sure the username/password pair is matched');
    console.log('=  done!\n');
    throw err.message;
  }

  console.log('✔  %d records inserted', ret.insertedCount);
  console.log('=  done!\n');
}