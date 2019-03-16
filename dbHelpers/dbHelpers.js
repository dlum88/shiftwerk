/* eslint-disable camelcase */
// const sequelize = require('sequelize');
const db = require('../db/index');

/**
 * Adds an array of items to Positions table or updates if they exist
 * @param {Object} positions - key: position, val: string, key: payment_amnt, val: Number
 */
const bulkAddNewPositionsToShift = (shift, positions) => Promise.all(positions
  .map(position => db.models.Position.upsert(position, { returning: true })
    // eslint-disable-next-line no-unused-vars
    .then(([newPosition, updated]) => db.models.ShiftPosition.create({
      ShiftId: shift.id,
      PositionId: newPosition.id,
      payment_amnt: position.payment_amnt,
    }))));
/**
 * Function used to create a new shift
 * @param {string} name - the name of the shift
 * @param {date} time_date - the time and date of the shift
 * @param {number} duration - the duration of the shift in minutes
 * @param {number} lat - the latitude of the shift
 * @param {number} long - the longitude of the shift
 * @param {string} description - a short description of the shift
 * @param {Array<object>} positions - has properties "position" and "payment_amnt"
 * @param {string} payment_type - what format the pay is in, e.g. cash, digital, check
 */
const createShift = ({
  MakerId,
  name,
  time_date,
  duration,
  lat,
  long,
  description,
  positions,
  payment_type,
}) => db.models.Shift.create({
  MakerId,
  name,
  time_date,
  duration,
  lat,
  long,
  description,
  payment_type,
})
  .then(newShift => bulkAddNewPositionsToShift(newShift, positions));

/**
 * adds any number of certifications to a werker
 *
 * @param {Object} werker - werker model instance
 * @param {Object[]} certifications
 * @param {string} certifications.name
 * @param {string} certifications.url_photo
 */
const bulkAddCertificationToWerker = (werker, certifications) => Promise.all(certifications
  .map(certification => db.models.Certification.upsert(certification, { returning: true })
    // eslint-disable-next-line no-unused-vars
    .then(([newCert, updated]) => db.models.WerkerCertification.create({
      WerkerId: werker.id,
      CertificationId: newCert.id,
      url_Photo: certification.url_Photo,
    }))));

/**
 * adds any number of new positions to db and werker
 *
 * @param {Object} werker - werker model instance
 * @param {Object[]} positions
 * @param {string} positions.position
 */
const bulkAddPositionToWerker = (werker, positions) => Promise.all(positions
  .map(position => db.models.Position.upsert(position, { returning: true })
    // eslint-disable-next-line no-unused-vars
    .then(([newPosition, updated]) => db.models.WerkerPosition.create({
      WerkerId: werker.id,
      PositionId: newPosition.id,
    }))));

/**
 * adds new werker to DB, including certifications and positions
 *
 * @param {Object} info
 * @param {string} info.name_first
 * @param {string} info.name_last
 * @param {string} info.email
 * @param {string} info.url_photo
 * @param {string} info.bio
 * @param {number} info.phone
 * @param {boolean} info.last_minute
 * @param {Object[]} info.certifications
 * @param {string} info.certifications.cert_name
 * @param {string} info.certifications.url_photo
 * @param {Object[]} info.positions
 * @param {string} info.positions.position
 */
const addWerker = info => db.models.create(info)
  .then(newWerker => bulkAddCertificationToWerker(newWerker, info.certifications));

/**
 * Function used to apply for a shift - updates the shift status to 'Pending'
 * @param {number} shiftId - the id of the shift to be applied to
 * @param {number} werkerId - the of the werker applying to the shift
 */
const applyForShift = (shiftId, werkerId) => db.models.InviteApply.update({
  status: 'Pending',
  where: {
    shiftId,
    werkerId,
  },
});

/**
 * Function used to accept shifts - updates the shift status to 'Accepted'
 * @param {number} shiftId - the id of the shift to be accepted
 * @param {number} werkerId - the id of the werker accepting the shift
 */
const acceptShift = (shiftId, werkerId) => db.models.InviteApply.update({
  status: 'Accepted',
}, {
  where: {
    shiftId,
    werkerId,
  },
});

/**
 * Function to decline shifts - updates the shift status to 'Declined'
 * @param {number} shiftId - the id of shift to be declined
 * @param {number} werkerId - the id of the werker declining the shift
 */
// function to decline shifts
const declineShift = (shiftId, werkerId) => db.models.InviteApply.update({
  status: 'Declined',
}, {
  where: {
    shiftId,
    werkerId,
  },
});

/**
 * Function to search for shifts by keywords
 * @param {object} data - an object with search terms
 */
const getShiftsBySearchTermsAndVals = data => db.models.ShiftPosition.find({
  where: { id: data.PositionId, payment_amnt: data.payment_amnt },
  include: [db.models.Shift, db.models.Position],
});

/**
 * Function to search for werkers by position
 * @param {object} data - an object with search terms
 */
const getWerkersByTerm = data => db.models.Werker.find({
  where: { id: data.PositionId },
  include: [db.models.Position],
});

/**
 * Function to invite a werker to a shift - creates a new invitation
 * @param {number} shiftId - the id of the shift that the werker will be invited to
 * @param {object} data - the data needed to create the new invitation
 */
const inviteWerker = (shiftId, data) => db.models.InviteApply.create({
  idWerker: data.idWerker,
  idShift: shiftId,
  idPosition: data.idPosition,
  status: data.status,
  expiration: data.expiration,
  type: data.type,
});

/**
 * Function to get a user profile
 * @param {object} data - object containing the user's id
 */
const getProfile = data => db.models.Werker.findOne({
  where: {
    id: data.id,
  },
});

/**
 * Function to get a shift by it's id
 * @param {number} shiftId - id of the shift to be found
 */
const getShiftsById = shiftId => db.models.Shift.findOne({
  where: {
    id: shiftId,
  },
});

/**
 * gets ten shifts from the DB, sorted by time_date
 * and offset by a given amount
 *
 * @param {Number} offset - number of pages (by ten) to offset entries by
 *
 * @returns {Promise<any[]>} - array of ten sequelize model instances
 */
const getAllShifts = (offset = 0) => db.models.Shift.findAll({
  limit: 10,
  offset: offset * 10,
  order: [['time_date', 'DESC']],
  include: [
    {
      model: db.models.Maker,
      attributes: [
        'name',
      ],
    },
    {
      model: db.models.Position,
      through: {
        attributes: [
          'payment_amnt',
          'position',
          'filled',
        ],
      },
    },
    {
      model: db.models.Werker,
      through: {
        attributes: [
          'id',
          'name',
        ],
      },
    },
  ],
});

/**
 * deletes a shift from the database by id
 *
 * @param {number} id
 * @returns {Promise<number>} - number of models destroyed
 */
const deleteShift = id => db.models.Shift.destroy({
  where: { id },
});

module.exports = {
  getProfile,
  inviteWerker,
  getWerkersByTerm,
  getShiftsBySearchTermsAndVals,
  declineShift,
  acceptShift,
  createShift,
  applyForShift,
  getShiftsById,
  getAllShifts,
  deleteShift,
  bulkAddNewPositionsToShift,
  addWerker,
  bulkAddCertificationToWerker,
  bulkAddPositionToWerker,
};
