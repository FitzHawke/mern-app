const passport = require('passport');

module.exports = {
  protect: function (req, res, next) {
    passport.authenticate('jwt', { session: false, failureRedirect: '/login' })(
      req,
      res,
      next
    );
  },
};
