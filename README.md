# halbone

An [isomorphic](http://nerds.airbnb.com/isomorphic-javascript-future-web-apps/) library for setting up Backbone models from a HAL API. Uses [Traverson](https://github.com/basti1302/traverson) underneath.

## Example

````javascript
var api = require('halbone')("http://api.com");

var Comments = Backbone.Collection.extend({});

api.intercept(function(req) {
  req.withRequestOptions({ headers: 'X-ACCESS-TOKEN': 'foo-token' });
});
api.get(Sections, 'posts[0].comments', function(err, comments) {
  comments.fetch //...
  comments.save //...
});
````

## Contributing

Please fork the project and submit a pull request with tests. Install node modules `npm install` and run tests with `npm test`.

## License

MIT
