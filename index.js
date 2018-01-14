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
   *    collection: 'collection'    // {string|function} name of collection, or return a name
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
  client.connect(`mongodb://${auth}${config.host}/${config.db}`, (err, client) => {
    if(err) return callback(err);

    const db = client.db(config.db)

    if(!config.fields || !config.fields.length) {
      callback(null);
      return client.close();
    }

    // remove empty fields;
    let fields = config.fields.filter(item => !!item);
    if(!fields.length) return client.close(); // fields can be empty

    var c = config.collection;
    var collections = {};

    // map collection
    if(typeof c === 'function') {
      fields.forEach(item => {
        var name = c(item);
        if(collections[name]) return collections[name].push(item);
        collections[name] = [item];
      })
    } else if(typeof c === 'string') {
      collections[c] = fields;
    } else {
      callback({messsage: 'not matched, no `collection` is specific'});
    }

    var i = 0, l = Object.keys(collections).length - 1;
    for(let c in collections) {
      db.collection(c).insertMany(collections[c], (err, ret) => {
        if(i++ === l) client.close();
        if(err) return callback(err);
        callback(null, ret);
      });
    }
  });
};
