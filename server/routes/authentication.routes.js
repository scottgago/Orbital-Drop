const authController = require('../controllers/authController.js')
const       passport = require('passport');
const        session = require('express-session');
const         config = require('../config/auth.js')
require('../config/passport.js')(passport);

module.exports = function(app, express) {
  
  app.use(session(config.secret)
  app.use(passport.initialize());
  app.use(passport.session());

  const helpers = authController(passport)

  app.get('/', helpers.serveLogin);
  app.get('/login', helpers.serveLogin)
  app.get('/login/github', helpers.githubRedirect);
  app.get('/login/github/return', helpers.githubReturn);

}