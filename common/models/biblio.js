'use strict';

module.exports = function(Biblio) {

  Biblio.query = function (q, cb) {
    var connector = Biblio.dataSource.connector
    var modelName = 'biblio';
    var idName = connector.idName(modelName)

    console.log('Query: "' + q + '" idname: ' + idName)
    connector.db.search({
      index: 'okapi',
      q: q,
      from: 0,
      size: 100,
    }, function (error, response) {
      if (error) console.error(error);

      var results = [];
      if (response.hits) {
        response.hits.hits.forEach(function (item) {
          results.push(connector.dataSourceToModel(modelName, item, idName));
        });
      }
      cb(error, results);
    });
  };

  Biblio.remoteMethod('query', {
    http: { verb: 'get' },
    description: 'ElasticSearch query string query',
    accepts: {arg: 'q', type: 'string'},
    returns: {arg: 'data', type: ['Biblio'], root: true}
  });

};
