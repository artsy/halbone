var benv = require('../'),
    express =require('express'),
    apiApp = require('./api'),
    halbone = require('../'),
    Backbone = require('backbone'),
    superSync = require('backbone-super-sync');

Backbone.sync = superSync;

describe('halbone', function() {

  var server, api;

  before(function(done){
    server = apiApp.listen(5000, done);
    api = halbone('http://localhost:5000/api');
    api.intercept(function(req) {
      req.withRequestOptions({ headers: { 'X-ACCESS-TOKEN': 'foo-token' } });
    });
  });

  after(function() {
    server.close();
  });

  it('crawls links and instantiates a Backbone object', function(done) {
    api.get(Backbone.Model, 'articles[0]', function(err, article) {
      article.get('title').should.equal("10 Kittens who just can't right now");
      done();
    });
  });

  it('can pass in headers from `intercept`', function(done) {
    api.get(Backbone.Model, 'articles', function(err, res) {
      res.get('headers')['x-access-token'].should.equal('foo-token');
      done();
    });
  });

  it('can pass in headers from options', function(done) {
    api.get(Backbone.Model, 'articles', {
      headers: { foo: 'bar' }
    }, function(err, res) {
      res.get('headers')['foo'].should.equal('bar');
      done();
    });
  });

  it('can pass in query string from options', function(done) {
    api.get(Backbone.Model, 'articles', {
      qs: { foo: 'bar' }
    }, function(err, res) {
      res.get('query')['foo'].should.equal('bar');
      done();
    });
  });

  it('can pass in template options from options', function(done) {
    api.get(Backbone.Model, 'article', {
      params: { id: 'foo' }
    }, function(err, article) {
      article.get('title').should.equal('Not Easy Being Green');
      done();
    });
  });

  it('injects the url to let save work', function(done) {
    api.get(Backbone.Model, 'article', {
      params: { id: 'foo' }
    }, function(err, article) {
      article.save({ title: "Moo goes the cow." }, {
        success: function(model, res) {
          article.url.should.containEql('http://localhost:5000/api/articles/1');
          article.get('title').should.equal('Moo goes the cow.');
          done();
        }
      });
    });
  });
});