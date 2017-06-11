'use strict';

module.exports = function(Authority) {

  Authority.complete = function (q, cb) {
    var connector = Authority.dataSource.connector
    var modelName = 'authority';
    var idName = connector.idName(modelName)

    if (!q) {
      cb(null, [])
      return;
    }

    console.log('Complete: "' + q + '" idname: ' + idName)
    connector.db.search({
      index: 'authority',
      type: 'record',
      body: {
        suggest: {
          'term' : {
            prefix : q,
            completion : {
              field : 'suggest'
            }
          }
        }
      }
    }, function (error, response) {
      if (error) console.error(error);

      console.log('Got data')
      if (!response.suggest) {
        cb(error, []);
      }
      console.log(response.suggest.term)

      var results = [];
      if (response.hits) {
        response.suggest.term[0].options.forEach(function (item) {
          results.push(item._source);
        });
      }
      cb(error, results);
    });
  };

  Authority.remoteMethod('complete', {
    http: { verb: 'get' },
    description: 'Find autocomplete suggestions',
    accepts: {arg: 'q', type: 'string'},
    returns: {arg: 'data', type: ['object'], root: true}
  });

};
