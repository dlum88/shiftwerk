/* eslint-disable camelcase */
const { google } = require('googleapis');
const db = require('../db');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

const verifyToken = (req, res, next) => {
  const { id_token } = req.query;
  if (!req.user) {
    req.user = {};
  }
  return oauth2Client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  })
    .then(ticket => ticket.getPayload())
    .then((payload) => {
      req.user.googleId = payload.sub;
      next();
    })
    .catch((err) => {
      console.error(err);
      return res.status(403).send('Unauthenticated user');
    });
};

const checkLogin = (req, res, next) => {
  const { googleId } = req.user;
  const model = req.user.type === 'werker' ? db.models.Werker : db.models.Maker;
  return model.findOne({
    where: {
      google_id: googleId,
    },
  })
    .then((foundUser) => {
      if (foundUser) {
        req.user.id = foundUser.id;
        return next();
      }
      return res.status(403).send('Unauthenticated user');
    })
    .catch((err) => {
      console.error(err);
      return res.status(403).send('Unauthenticated user');
    });
};

const checkUser = (req, res, next) => {
  const { id } = req.user;
  const attemptedId = req.user.type === 'werker' ? req.params.werkerId : req.params.MakerId;
  if (id === attemptedId) {
    return next();
  }
  return res.status(403).send('Attempt to access unauthorized resources');
};

module.exports = {
  oauth2Client,
  verifyToken,
  checkLogin,
  checkUser,
};
