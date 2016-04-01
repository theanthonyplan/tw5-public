var express = require('express'),
  httpProxy = require('http-proxy'),
  passport = require('passport'),
  nconf = require('nconf'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var logger = require('express-logger'),
  cookieParser = require('cookie-parser'),
  expressSession = require('express-session');


var proxy = httpProxy.createProxyServer({}),
    url = require('url');

// CONFIG GOES HERE
config = {
    "client_id": "SOMECLIENTKEY",
    "client_secret": "SOMECLIENTSECRET",
    "domain": "example.com",
    "mount_point": "http://www.example.com",
    "session_secret": "8sd32dRANDOMSTRINGo31fj13",
    "target_port": 8080,
    "auth_port": 8081
}

// admin definition here
ADMIN = {
  "id": "ADMINS_GOOGLE_CLIENT_ID",
  "email":'ADMINS_GOOGLE_EMAIL'
}

// constant stuff
const ADMIN_ID = ADMIN.id;     
const ADMIN_EMAIL = ADMIN.email;
const TARGET_PORT = config.target_port;
const HOST_PORT = config.auth_port;





// Setup passport
passport.serializeUser(function(user, done) {
  // serialize the _json field
  // Hint: serialize the user_id here
  done(null, user._json);
});

passport.deserializeUser(function(obj, done) {
  // Hint: deserialize the user by its id.
  done(null, obj);
});

console.log('TESTING DATA STATE: ', config.client_id );


passport.use(new GoogleStrategy({
    clientID: config.client_id,
    clientSecret: config.client_secret,
    callbackURL: config.mount_point + '/auth/google/callback'
  }, function(accessToken, refreshToken, profile, done) {
    // Hint: find or create the user in the DB
    // asynchronous verification, for effect...
    process.nextTick(function () {
      return done(null, profile);
    });
  })
);

function isAuthorized(req, user) {
  // Override me for your own need!
  //var domain = nconf.get('domain');
  //var pattern = new RegExp('.*@' + domain.replace('.', '\\.'));
  var email = user.emails[0].value;


  console.log("user:", user);
  console.log("email:", email);

  // return true if admin ID and Email match what google sends back
  // if not, return false and proxy back to the public wiki
  //
  //FEEL FREE TO OVERRIDE HERE
  //
  return (user.id == ADMIN_ID) && (email == ADMIN_EMAIL);
}

// Setup express application
var app = express()
  //.use(logger())
  .use(cookieParser())
  .use(expressSession({secret: config.session_secret}))
  .use(passport.initialize())
  .use(passport.session());








// Router
app.get('/auth/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }), function(req, res){
    // handled by google.
  }
);

app.get('/auth/google/callback',
  passport.authenticate('google'),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.all('/*', function(req, res, next) {
  if (req.method == 'GET' || req.method == 'HEAD' || (
      req.isAuthenticated() &&
      isAuthorized(req, req.user))) {
    return next();
  } else {
    res.send(401);
  }
});





var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  // configure stuff here
  //app.use(app.router);   // depreciated in 4
  // proxy to TW5 as fallback.

  app.use(function(req, res) {

    // report some data
    var hostname = req.headers.host.split(":")[0];
    var pathname = url.parse(req.url).pathname;
    var target_url =  'http://localhost:'+config.target_port;
    
    console.log('Hostname: ', hostname);
    console.log('Pathname: ', pathname);
    console.log('TW5 Public Port: ', config.target_port );
    console.log('URL Target: ', target_url);



    proxy.web(req, res, {
      target: target_url,
      host: config.target_port,   // should be tw5-auth
      port: config.auth_port   // should be tw5
    });
  });
}





console.log('Now Listening on port: ',config.auth_port);
// listen on localhost:auth_port
app.listen(config.auth_port, 'localhost');
