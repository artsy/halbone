var express = require('express'),
    bodyParser = require('body-parser');

var app = module.exports = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api', function(req, res) {
  res.send({
     "_links":{
        "articles":{
           "href":"http://localhost:5000/api/articles"
        },
        "article":{
           "href":"http://localhost:5000/api/articles/{id}"
        }
     }
  });
});

app.get('/api/articles/:id', function(req, res) {
  res.send({
     "id":1,
     "title":"Not Easy Being Green",
     "lede":null,
     "_links":{
        "self":{
           "href":"http://localhost:5000/api/articles/1?token=da44e3a6f0163982324a1267"
        },
        "articles":{
           "href":"http://localhost:5000/api/articles?token=da44e3a6f0163982324a1267"
        }
     }
  });
});

app.put('/api/articles/:id', function(req, res) {
  res.send({
     "id":1,
     "saved": true,
     "title":req.body.title,
     "lede":null,
     "_links":{
        "self":{
           "href":"http://localhost:5000/api/articles/1?token=da44e3a6f0163982324a1267"
        },
        "articles":{
           "href":"http://localhost:5000/api/articles?token=da44e3a6f0163982324a1267"
        }
     }
  });
});

app.get('/api/articles', function(req, res) {
  res.send({
    "headers": req.headers,
    "query": req.query,
    "_embedded":{
      "articles":[
         {
            "id":2,
            "title":"10 Kittens who just can't right now",
            "lede":null,
            "_links":{
               "self":{
                  "href":"http://localhost:5000/api/articles/2?token=da44e3a6f0163982324a1267"
               }
            }
         }
      ]
    },
    "_links":{
      "self":{
         "href":"http://localhost:5000/api/articles?page=1&amp;token=da44e3a6f0163982324a1267"
      },
      "next":{
         "href":"http://localhost:5000/api/articles?page=2&amp;token=da44e3a6f0163982324a1267"
      }
    },
    "total_count":51
  });
});