'use strict';

module.exports = function(Biblio) {

  /**
   * Search using ElasticSearch Query String Query instead of
   * using the JSON filter syntax by Loopback
   */
  Biblio.query = function (q, from, size, cb) {
    var connector = Biblio.dataSource.connector
    var modelName = Biblio.definition.name;
    var idName = connector.idName(modelName)

    console.log('Query: "' + q + '" idname: ' + idName, ' modelName: ' + modelName)

    connector.db.search({
      index: 'okapi',
      q: q,
      from: from || 0,
      size: size || 50,
    }, function (error, response) {
      if (error) console.error(error);

      var results = [];
      var total = 0;
      if (response.hits) {
        total = response.hits.total;
        response.hits.hits.forEach(function (item) {
          results.push(connector.dataSourceToModel(modelName, item, idName));
        });
      }
      cb(error, {
        total: total,
        data: results
      });
    });
  };

  Biblio.remoteMethod('query', {
    http: { verb: 'get' },
    description: 'Find instances matching an ElasticSearch Query String Query (instead of using the Loopback JSON filter syntax)',
    accepts: [
      {arg: 'q', type: 'string'},
      {arg: 'from', type: 'integer'},
      {arg: 'size', type: 'integer'}
    ],
    returns: [{
      root: true,
      arg: 'data',
      type: [Biblio.definition.name],
    }, {
      arg: 'total',
      type: 'integer'
    }]
  });

};
