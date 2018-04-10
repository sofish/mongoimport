'use strict';

const {promisify} = require('util');

const {MongoClient} = require('mongodb');

require('promise.prototype.finally').shim();


function ignoreNamespaceNotFound(error)
{
  if(error.codeName !== 'NamespaceNotFound') return Promise.reject(error)
}


/**
 * Helper function to import your data into a MongoDB database
 *
 * @param {object} config
 *  {
 *    fields: [],               // {array} data to import
 *    database: 'name',         // {string} name of database
 *    collection: 'collection'  // {string|function} name of collection, or return a name
 *    host: 'localhost:27017',  // {string} [optional] by default is 27017
 *    username: 'sofish',       // {string} [optional]
 *    password: '***'           // {string} [optional]
 *  }
 */
function bot({collection, database, drop, fields, host = '127.0.0.1:27027',
              password, username})
{
  if(!fields) {
    return;
  }

  // remove empty fields;
  fields = fields.filter(item => !!item);
  if(!fields.length) return;  // fields can be empty

  // map collection
  const collections = {};
  if(typeof collection === 'function') {
    fields.forEach(function(item)
    {
      const name = collection(item);

      let col = collections[name]
      if(!col) collections[name] = col = [];
      col.push(item);
    })
  } else if(typeof collection === 'string') {
    collections[collection] = fields;
  } else {
    throw new Error('`collection` is not specified');
  }

  const auth = username ? `${username}:${password}@` : '';

  return MongoClient.connect(`mongodb://${auth}${host}/${database}`)
  .then(function(client)
  {
    const promises = Object.keys(collections).map(function(key)
    {
      const collection = this.collection(key);

      const promisedDrop       = promisify(collection.drop      .bind(collection))
      const promisedInsertMany = promisify(collection.insertMany.bind(collection))

      function insertMany()
      {
        return promisedInsertMany(collections[key]);
      }

      if(!drop) return insertMany();

      return promisedDrop()
      .catch(ignoreNamespaceNotFound)
      .then(insertMany)
    },
    client.db(database));

    return Promise.all(promises).finally(client.close.bind(client));
  });
};


module.exports = bot;
