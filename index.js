//
// A small isomorphic wrapper around Traverson that DRYs up HAL-style
// fetching code & model creation for Backbone. Simplifies Traverson API, and
// injects the model with the crawled url for `save`, `destroy` etc. to work as
// expected.
//

var _ = require('underscore'),
    traverson = require('traverson'),
    url = require('url');

var hydrateModel = function(Model, data, callback) {
  // Set up the model and inject the url for save/destroy/fetch to work
  var model = new Model(data);
  if (_.isArray(data)) {
    // TODO: See if there's some kind of convention for getting the root
    // link out of embedded resources
  } else {
    var uri = url.parse(data._links.self.href);
    model.url = uri.protocol + '//' + uri.host + uri.pathname;
  }
  if (callback) callback(null, model);
}

module.exports = function(API_URL) {

  var api = traverson.jsonHal.from(API_URL),
      interceptCallback;

  // Create a new halbone API
  var methods = {

    intercept: function(callback) {
      return interceptCallback = callback;
    },

    get: function(Model, labels, options, callback) {
      if (!options) var options = {};

      // If there's bootstrapped data with a url just callback with that
      if (options.bootstrap && options.bootstrap._links && options.bootstrap._links.self
          && options.bootstrap._links.self.href)
        return hydrateModel(Model, options.bootstrap, callback);

      // Build the Traverson follow query
      var follows = [];
      _.each(labels.split('.'), function(label) {
        // Is accessing an array so split the label into something more
        // Traverson appropriate.
        if (label.match(/]$/)) {
          follows.push(label.split('[')[0]);
          follows.push(label);
        } else {
          follows.push(label);
        }
      });

      // Build the request
      var req = api.newRequest().follow(follows);
      if (interceptCallback) interceptCallback(req);

      // Optionally exclude options and let the last arg be the callback
      if (_.isFunction(options)) {
        callback = options;

      // Otherwise allow extra request build up through options
      } else {
        if (options.params) req.withTemplateParameters(options.params);
        if (options.headers) req.withRequestOptions({ headers: options.headers });
        if (options.qs) req.withRequestOptions({ qs: options.qs });
      }

      // Crawl the links and end the request
      req.getResource(function(err, resource){
        if (err && callback) return callback(err);
        if (options.bootstrap) {
          hydrateModel(Model, _.pick(resource, '_links'), callback);
        } else {
          hydrateModel(Model, resource, callback);
        }
      });
    }
  };
  return methods;
};