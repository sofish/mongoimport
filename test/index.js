'use strict';

const mongoimport = require('..');

const host = '127.0.0.1:27017';
const database = 'mongoimport';
const collection = function(field) {
  return field.name;
};
const fields = [
  { name: 'sofish', createdAt: '1986', isBot: 'guess me', isFun: 'try me' },
  { name: 'perf', foo: 'bar' },
  { name: 'error', hello: 'world' }
];

mongoimport({host, database, collection, callback, fields});

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
