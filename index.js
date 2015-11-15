'use strict';

const mongodb = require('mongodb');
const client = mongodb.MongoClient;

module.exports = bot;

function bot(config) {
  /* Bot that helps to import your data into db
   * @param {object} config
   *  {
   *    fields: [],                 // {array} data to import
   *    db: 'name',                 // {string} name of db
   *    collection: 'collection'    // {string} name of collection
   *    host: 'localhost:27017',    // {string} [optional] by default is 27017
   *    username: 'sofish',         // {string} [optional]
   *    password: '***'             // {string} [optional]
   *    callback: (err, db) => {}   // {function} [optional]
   *  }
   */

  if(!config.host) config.host = '127.0.0.1:27027';
  if(!config.callback) config.callback = () => {};

  var callback = config.callback;
  var auth = config.username ? `${config.username}:${config.password}@` : '';
  client.connect(`mongodb://${auth}${config.host}/${config.db}`, (err, db) => {
    if(err) return callback(err);

    if(!config.fields || !config.fields.length) {
      callback(null);
      return db.close();
    }

    db.collection(config.collection).insertMany(config.fields, (err, ret) => {
      if(err) return callback(err);
      db.close();
      callback(null, ret);
    });
  });
};