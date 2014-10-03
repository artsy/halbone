# halbone

An [isomorphic](http://nerds.airbnb.com/isomorphic-javascript-future-web-apps/) library for setting up Backbone models from a HAL API. Uses [Traverson](https://github.com/basti1302/traverson) underneath.

## Example

````javascript
var api = require('halbone')("http://api.com");

var Comments = Backbone.Collection.extend({
  // ...
});

api.intercept(function(req) {
  req.withRequestOptions({ headers: 'X-ACCESS-TOKEN': 'foo-token' });
});
api.get(Comments, 'posts[0].comments', function(err, comments) {
  comments.fetch //...
  comments.save //...
});
````

## Options

You may optionally pass an options object as the third arugment...

````javascript
api.get(Post, 'posts[0]',{
  bootstrap: POST_DATA,
  qs: { querystring: true },
  headers: { token: 'auth-me' },
  params: { 'some-hal': 'template-params' }
}, function(err, post) {
    //...
});
````

### qs & headers

Convenience aliases for Traverson's [qs & headers options](https://github.com/basti1302/traverson#headers-http-basic-auth-oauth-and-whatnot).

### params

Alias for Traverson's [URI Templates](https://github.com/basti1302/traverson#uri-templates).

### api.bootstrap

It's a common practice to [bootstrap](http://backbonejs.org/#FAQ-bootstrap) data you fetched on the server to the client to avoid making extra requests. By passing the bootstrapped data into the `bootstrap` option, halbone will  immediately return the hydrated model without making extra requests if it finds `_links.self.href`, otherwise be sure to pass in the "root" link of the resource and it'll continue to fetch the model like normal. e.g.

````
POST_DATA = {}; // A new resource so empty data
api.get(Post, 'posts', { bootstrap: POST_DATA }, functionn(err, post) {
    // post is a single resource with a url drawn from the 'posts' link.
    // Allowing you to POST to it with a normal post.save
});
````

## Contributing

Please fork the project and submit a pull request with tests. Install node modules `npm install` and run tests with `npm test`.

## License

MIT
