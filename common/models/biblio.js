'use strict';

module.exports = function(Biblio) {

  /**
   * Search using ElasticSearch Query String Query instead of
   * using the JSON filter syntax by Loopback
   */
  Biblio.query = function (q, from, size, scroll, sort, order, cb) {
    var connector = Biblio.dataSource.connector
    var modelName = Biblio.definition.name;
    var idName = connector.idName(modelName)

    console.log(`Query: ${q}, idName: ${idName}, modelName: ${modelName}, from: ${from}, size: ${size}`)

    var args = {
      index: 'okapi',
      q: q,
      from: from || 0,
      size: size || 50

    if (sort) {
      order = order || 'desc'
      args.sort = `${sort}:${order}`
    }

    if (scroll) {
      args.scroll = '1m'   // no need for any longer
    }

    connector.db.search(args, function (error, response) {
      if (error) {
        console.error(error)
        return cb(error, null);
      }

      var results = [];
      var total = 0;
      if (response.hits) {
        total = response.hits.total;
        response.hits.hits.forEach(function (item) {
          results.push(connector.dataSourceToModel(modelName, item, idName));
        });
      }
      var out = {
        total: total,
        data: results
      }
      if (response._scroll_id) {
        out._scroll_id = response._scroll_id
      }
      cb(error, out);
    });
  }

  Biblio.validatesInclusionOf('order', {in: ["asc", "desc"]});
  Biblio.remoteMethod('query', {
    http: { verb: 'get' },
    description: 'Find instances matching an ElasticSearch Query String Query (instead of using the Loopback JSON filter syntax)',
    accepts: [
      {arg: 'q', type: 'string'},
      {arg: 'from', type: 'integer'},
      {arg: 'size', type: 'integer', description: 'Result set size. If a set larger than 10000 is needed, use scroll.'},
      {arg: 'scroll', type: 'boolean', description: 'Set to true to return a "scroll_id" that you can use with the scroll API to return large datasets. The returned ID is always valid for 1 minute.'},
      {arg: 'sort', type: 'string', description: 'Field to sort by.'},
      {arg: 'order', type: 'string', description: 'Sort order ("asc" or "desc").'},
    ],
    returns: [{
      root: true,
      arg: 'data',
      type: [Biblio.definition.name],
    }, {
      arg: 'total',
      type: 'integer'
    }]
  })

  /**
   * Interface to ElasticSearch Scroll Api
   */
  Biblio.scroll = function (scrollId, cb) {
    var connector = Biblio.dataSource.connector
    var modelName = Biblio.definition.name
    var idName = connector.idName(modelName)
    console.log('Scroll ID:', scrollId)

    connector.db.scroll({
      scroll_id: scrollId,
      scroll: '1m',
    }, function (error, response) {
      if (error) console.error(error);

      var results = [];
      var total = 0;
      console.log(response)
      if (response.hits) {
        total = response.hits.total;
        response.hits.hits.forEach(function (item) {
          results.push(connector.dataSourceToModel(modelName, item, idName));
        });
      }
      var out = {
        total: total,
        data: results
      }
      if (response._scroll_id) {
        out._scroll_id = response._scroll_id
      }
      cb(error, out);
    });
  }

  Biblio.remoteMethod('scroll', {
    http: { verb: 'get' },
    description: 'Retrieve large dataset using the Elasticsearch scroll API',
    accepts: [
      {arg: 'scroll_id', type: 'string', description: 'A "scroll_id" that you get from a "query" response.'},
    ],
    returns: [{
      root: true,
      arg: 'data',
      type: [Biblio.definition.name],
    }, {
      arg: 'total',
      type: 'integer'
    }]
  })

};
