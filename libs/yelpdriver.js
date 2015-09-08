 var env = require('node-env-file');
 	//call in our secret env
 	env(__dirname + '/../.env');
var querystring = require('querystring');
var OAuth = require('oauth').OAuth;

var yelpApi = {
  oauthToken : process.env.YELP_TOKEN,

  oauthTokenSecret: process.env.YELP_TOKEN_SECRET,
// Instanciate a new Oauth Provider (much of this is based off the npm yelp package)
  oauth: new OAuth(
    null,
    null,
    process.env.YELP_CONSUMER_KEY,
    process.env.YELP_CONSUMER_SECRET,
    "1.0",
    null,
    'HMAC-SHA1'
  ),

  setParams: function (queryObj) {
      params = {
          'll': [parseFloat(queryObj.location.lat), parseFloat(queryObj.location.lng)].join(','),
          'category_filter': queryObj.filterType,
          'radius_filter': (queryObj.distance || 8000),
          'limit': 10
        };
      return querystring.stringify(params);
  },

  getAll: function (params, callback) {
      //make a oauth1 get request peppered with all the client deets above.
      var base_url = "http://api.yelp.com/v2/";
      self = this;
    return this.oauth.get(
        base_url + 'search' + '?' + self.setParams(params),
        self.oauthToken,
        self.oauthTokenSecret,
        function (error, data, response) {
          var result;
          if(!error && data){
            return callback(null, JSON.parse(data));
          } else {
            return callback(error);
          }

        }
      );
  }
};

module.exports = yelpApi;