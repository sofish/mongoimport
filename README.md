![build status](https://travis-ci.org/sofish/mongoimport.svg?branch=master)

# mongoimport

import JSON to mongodb, associate with [sofish/log2json](https://github.com/sofish/log2json) to manage nginx logs.

```php
$ npm install mongoimport --save
```

## Usage

Install the package with npm, and bring it to your project.

```js
var mi = require('mongoimport');
mi(config);
```

Follow the codes below to create a config object:

  ```js
var config = {
  fields: [],                     // {array} data to import
  db: 'name',                     // {string} name of db
  collection: 'collection'        // {string|function} name of collection, or use a function to
                                  //  return a name, accept one param - [fields] the fields to import

  // they're options
  host: 'localhost:27017',        // {string} [optional] by default is 27017
  username: 'sofish',             // {string} [optional]
  password: '***'                 // {string} [optional]
  callback: (err, db) => {}       // {function} [optional]
};
```

## Test

Simply run `npm test` to see what happens.
