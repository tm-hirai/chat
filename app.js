var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var session = require('express-session');

var User = require('./models/user');
var Channel = require('./models/channel');
var Message = require('./models/message');
(async () => {
  const values = await Promise.all([User.sync(), Channel.sync()]);
  // MessageはUserとChannelの従属エントリ
  Message.belongsTo(User, { foreignKey: 'postedBy' });
  Message.belongsTo(Channel, { foreignKey: 'channelId' });
  Message.sync();
})();


passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
var GITHUB_CLIENT_ID = "39d2ae6e44430dfa51c7";
var GITHUB_CLIENT_SECRET = "7044c2241eb22fbbe988b1f2ef2379c934810ec4";
passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:8000/auth/github/callback"
},
  function (accessToken, refreshToken, profile, done) {
    // console.log(profile);
    process.nextTick(function () {
      User.upsert({
        userId: profile.id,
        username: profile.username,
        avatarUrl: profile._json.avatar_url ? profile._json.avatar_url : ''
      }).then(() => {
        done(null, {
          userId: profile.id,
          username: profile.username,
          avatarUrl: profile._json.avatar_url ? profile._json.avatar_url : ''
        });
      });
    });
  }
));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var channelsRouter = require('./routes/channels');
var loginRouter = require('./routes/login');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(helmet());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(function (req, res, next) {
  res.io = io;
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'Wri-0s@8p7Eswu#+ip@6', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/channels', channelsRouter);
app.use('/login', loginRouter);

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection', (socket) => {
  console.log('connect');
}
);

module.exports = {
  app: app,
  server: server
};
