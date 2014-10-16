var Backbone = require('backbone'),
    api = require('./')("https://artsy.net/api");

// Copy & paste the xapp token Artsy gives you. You can find it here:
// https://developers.artsy.net/start
var xappToken = '';

// Models
var Artwork = Backbone.Model.extend({
});
var Artists = Backbone.Collection.extend({
});

// Add the xapp token to every request
api.intercept(function(req) {
  req.withRequestOptions({ headers: { 'X-Xapp-Token': xappToken } });
});

// Fetch the first artwork and first artist
api.get(Artwork, 'artworks[0]', function(err, artwork) {
  api.get(Artists, 'artworks[0].artists.artists', function(err, artists) {
    console.log('The first public artwork at Artsy is ' +
      artwork.get('title') + ' by ' + artists.pluck('name').join(', ')
    );
  });
});