'use strict';

const {MongoClient} = require('mongodb');


/* Helper function to import your data into a MongoDB database
 * @param {object} config
 *  {
 *    fields: [],                    // {array} data to import
 *    database: 'name',              // {string} name of database
 *    collection: 'collection'       // {string|function} name of collection, or return a name
 *    host: 'localhost:27017',       // {string} [optional] by default is 27017
 *    username: 'sofish',            // {string} [optional]
 *    password: '***'                // {string} [optional]
 *    callback: (err, client) => {}  // {function} [optional]
 *  }
 */
function bot({callback = () => {}, collection, database, fields,
host = '127.0.0.1:27027', password, username}) {
  const auth = username ? `${username}:${password}@` : '';

  MongoClient.connect(`mongodb://${auth}${host}/${database}`, (err, client) => {
    if(err) return callback(err);

    const db = client.db(database)

    if(!(fields && fields.length)) {
      client.close();
      return callback();
    }

    // remove empty fields;
    fields = fields.filter(item => !!item);
    if(!fields.length) return client.close();  // fields can be empty

    // map collection
    const collections = {};
    if(typeof collection === 'function') {
      fields.forEach(item => {
        const name = collection(item);
        if(collections[name]) return collections[name].push(item);
        collections[name] = [item];
      })
    } else if(typeof collection === 'string') {
      collections[collection] = fields;
    } else {
      return callback({messsage: 'not matched, no `collection` is specific'});
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


module.exports = bot;
