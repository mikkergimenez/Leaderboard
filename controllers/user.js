var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
var secrets = require('../config/secrets');

/**
 * GET /login
 * Login page.
 */

exports.getLogin = function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 * @param email
 * @param password
 */

exports.postLogin = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      req.flash('errors', { msg: info.message });
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */

exports.getSignup = function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('account/signup', {
    title: 'Create Account',
    countries: { 'AF':'Afghanistan', 'AX':'Åland Islands', 'AL':'Albania', 'DZ':'Algeria', 'AS':'American Samoa', 'AD':'Andorra', 'AO':'Angola', 'AI':'Anguilla', 'AQ':'Antarctica', 'AG':'Antigua and Barbuda', 'AR':'Argentina', 'AM':'Armenia', 'AW':'Aruba', 'AU':'Australia', 'AT':'Austria', 'AZ':'Azerbaijan', 'BS':'Bahamas', 'BH':'Bahrain', 'BD':'Bangladesh', 'BB':'Barbados', 'BY':'Belarus', 'BE':'Belgium', 'BZ':'Belize', 'BJ':'Benin', 'BM':'Bermuda', 'BT':'Bhutan', 'BO':'Bolivia', 'BA':'Bosnia and Herzegovina', 'BW':'Botswana', 'BV':'Bouvet Island', 'BR':'Brazil', 'IO':'British Indian Ocean Territory', 'BN':'Brunei Darussalam', 'BG':'Bulgaria', 'BF':'Burkina Faso', 'BI':'Burundi', 'KH':'Cambodia', 'CM':'Cameroon', 'CA':'Canada', 'CV':'Cape Verde', 'KY':'Cayman Islands', 'CF':'Central African Republic', 'TD':'Chad', 'CL':'Chile', 'CN':'China', 'CX':'Christmas Island', 'CC':'Cocos (Keeling) Islands', 'CO':'Colombia', 'KM':'Comoros', 'CG':'Congo', 'CD':'Congo, The Democratic Republic of The', 'CK':'Cook Islands', 'CR':'Costa Rica', 'CI':"Cote D'ivoire", 'HR':'Croatia', 'CU':'Cuba', 'CY':'Cyprus', 'CZ':'Czech Republic', 'DK':'Denmark', 'DJ':'Djibouti', 'DM':'Dominica', 'DO':'Dominican Republic', 'EC':'Ecuador', 'EG':'Egypt', 'SV':'El Salvador', 'GQ':'Equatorial Guinea', 'ER':'Eritrea', 'EE':'Estonia', 'ET':'Ethiopia', 'FK':'Falkland Islands (Malvinas)', 'FO':'Faroe Islands', 'FJ':'Fiji', 'FI':'Finland', 'FR':'France', 'GF':'French Guiana', 'PF':'French Polynesia', 'TF':'French Southern Territories', 'GA':'Gabon', 'GM':'Gambia', 'GE':'Georgia', 'DE':'Germany', 'GH':'Ghana', 'GI':'Gibraltar', 'GR':'Greece', 'GL':'Greenland', 'GD':'Grenada', 'GP':'Guadeloupe', 'GU':'Guam', 'GT':'Guatemala', 'GG':'Guernsey', 'GN':'Guinea', 'GW':'Guinea-bissau', 'GY':'Guyana', 'HT':'Haiti', 'HM':'Heard Island and Mcdonald Islands', 'VA':'Holy See (Vatican City State)', 'HN':'Honduras', 'HK':'Hong Kong', 'HU':'Hungary', 'IS':'Iceland', 'IN':'India', 'ID':'Indonesia', 'IR':'Iran, Islamic Republic of', 'IQ':'Iraq', 'IE':'Ireland', 'IM':'Isle of Man', 'IL':'Israel', 'IT':'Italy', 'JM':'Jamaica', 'JP':'Japan', 'JE':'Jersey', 'JO':'Jordan', 'KZ':'Kazakhstan', 'KE':'Kenya', 'KI':'Kiribati', 'KP':"Korea, Democratic People's Republic of", 'KR':'Korea, Republic of', 'KW':'Kuwait', 'KG':'Kyrgyzstan', 'LA':"Lao People's Democratic Republic", 'LV':'Latvia', 'LB':'Lebanon', 'LS':'Lesotho', 'LR':'Liberia', 'LY':'Libyan Arab Jamahiriya', 'LI':'Liechtenstein', 'LT':'Lithuania', 'LU':'Luxembourg', 'MO':'Macao', 'MK':'Macedonia, The Former Yugoslav Republic of', 'MG':'Madagascar', 'MW':'Malawi', 'MY':'Malaysia', 'MV':'Maldives', 'ML':'Mali', 'MT':'Malta', 'MH':'Marshall Islands', 'MQ':'Martinique', 'MR':'Mauritania', 'MU':'Mauritius', 'YT':'Mayotte', 'MX':'Mexico', 'FM':'Micronesia, Federated States of', 'MD':'Moldova, Republic of', 'MC':'Monaco', 'MN':'Mongolia', 'ME':'Montenegro', 'MS':'Montserrat', 'MA':'Morocco', 'MZ':'Mozambique', 'MM':'Myanmar', 'NA':'Namibia', 'NR':'Nauru', 'NP':'Nepal', 'NL':'Netherlands', 'AN':'Netherlands Antilles', 'NC':'New Caledonia', 'NZ':'New Zealand', 'NI':'Nicaragua', 'NE':'Niger', 'NG':'Nigeria', 'NU':'Niue', 'NF':'Norfolk Island', 'MP':'Northern Mariana Islands', 'NO':'Norway', 'OM':'Oman', 'PK':'Pakistan', 'PW':'Palau', 'PS':'Palestinian Territory, Occupied', 'PA':'Panama', 'PG':'Papua New Guinea', 'PY':'Paraguay', 'PE':'Peru', 'PH':'Philippines', 'PN':'Pitcairn', 'PL':'Poland', 'PT':'Portugal', 'PR':'Puerto Rico', 'QA':'Qatar', 'RE':'Reunion', 'RO':'Romania', 'RU':'Russian Federation', 'RW':'Rwanda', 'SH':'Saint Helena', 'KN':'Saint Kitts and Nevis', 'LC':'Saint Lucia', 'PM':'Saint Pierre and Miquelon', 'VC':'Saint Vincent and The Grenadines', 'WS':'Samoa', 'SM':'San Marino', 'ST':'Sao Tome and Principe', 'SA':'Saudi Arabia', 'SN':'Senegal', 'RS':'Serbia', 'SC':'Seychelles', 'SL':'Sierra Leone', 'SG':'Singapore', 'SK':'Slovakia', 'SI':'Slovenia', 'SB':'Solomon Islands', 'SO':'Somalia', 'ZA':'South Africa', 'GS':'South Georgia and The South Sandwich Islands', 'ES':'Spain', 'LK':'Sri Lanka', 'SD':'Sudan', 'SR':'Suriname', 'SJ':'Svalbard and Jan Mayen', 'SZ':'Swaziland', 'SE':'Sweden', 'CH':'Switzerland', 'SY':'Syrian Arab Republic', 'TW':'Taiwan, Province of China', 'TJ':'Tajikistan', 'TZ':'Tanzania, United Republic of', 'TH':'Thailand', 'TL':'Timor-leste', 'TG':'Togo', 'TK':'Tokelau', 'TO':'Tonga', 'TT':'Trinidad and Tobago', 'TN':'Tunisia', 'TR':'Turkey', 'TM':'Turkmenistan', 'TC':'Turks and Caicos Islands', 'TV':'Tuvalu', 'UG':'Uganda', 'UA':'Ukraine', 'AE':'United Arab Emirates', 'GB':'United Kingdom', 'US':'United States', 'UM':'United States Minor Outlying Islands', 'UY':'Uruguay', 'UZ':'Uzbekistan', 'VU':'Vanuatu', 'VE':'Venezuela', 'VN':'Viet Nam', 'VG':'Virgin Islands, British', 'VI':'Virgin Islands, U.S.', 'WF':'Wallis and Futuna', 'EH':'Western Sahara', 'YE':'Yemen', 'ZM':'Zambia', 'ZW':'Zimbabwe'}
  });
};

/**
 * POST /signup
 * Create a new local account.
 * @param email
 * @param password
 */

exports.postSignup = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('country', 'Please select a country form the list.').len(2);
  req.assert('username', 'Username must be at least 4 characters long').len(4);
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  var user = new User({
    email: req.body.email,
    username: req.body.username,
    country: req.body.country,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/signup');
    }
    user.save(function(err) {
      if (err) return next(err);
      req.logIn(user, function(err) {
        if (err) return next(err);
        res.redirect('/');
      });
    });
  });
};

/**
 * GET /account
 * Profile page.
 */

exports.getAccount = function(req, res) {
  res.render('account/profile', {
    title: 'Account Management'
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */

exports.postUpdateProfile = function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);
    user.email = req.body.email || '';
    user.username = req.body.username || '';
    user.profile.name = req.body.name || '';
    user.profile.gender = req.body.gender || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';

    user.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Profile information updated.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 * @param password
 */

exports.postUpdatePassword = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user.password = req.body.password;

    user.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */

exports.postDeleteAccount = function(req, res, next) {
  User.remove({ _id: req.user.id }, function(err) {
    if (err) return next(err);
    req.logout();
    req.flash('info', { msg: 'Your account has been deleted.' });
    res.redirect('/');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 * @param provider
 */

exports.getOauthUnlink = function(req, res, next) {
  var provider = req.params.provider;
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user[provider] = undefined;
    user.tokens = _.reject(user.tokens, function(token) { return token.kind === provider; });

    user.save(function(err) {
      if (err) return next(err);
      req.flash('info', { msg: provider + ' account has been unlinked.' });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */

exports.getReset = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({ resetPasswordToken: req.params.token })
    .where('resetPasswordExpires').gt(Date.now())
    .exec(function(err, user) {
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 * @param token
 */

exports.postReset = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  async.waterfall([
    function(done) {
      User
        .findOne({ resetPasswordToken: req.params.token })
        .where('resetPasswordExpires').gt(Date.now())
        .exec(function(err, user) {
          if (!user) {
            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('back');
          }

          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function(err) {
            if (err) return next(err);
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
    },
    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: secrets.sendgrid.user,
          pass: secrets.sendgrid.password
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'hackathon@starter.com',
        subject: 'Your Hackathon Starter password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
        done(err);
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
};

/**
 * GET /forgot
 * Forgot Password page.
 */

exports.getForgot = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 * @param email
 */

exports.postForgot = function(req, res, next) {
  req.assert('email', 'Please enter a valid email address.').isEmail();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email.toLowerCase() }, function(err, user) {
        if (!user) {
          req.flash('errors', { msg: 'No account with that email address exists.' });
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: secrets.sendgrid.user,
          pass: secrets.sendgrid.password
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'hackathon@starter.com',
        subject: 'Reset your password on Hackathon Starter',
        text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('info', { msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
};
