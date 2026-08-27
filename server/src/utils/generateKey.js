const crypto = require('crypto');

// Characters that cannot be confused with each other when read out loud or
// copied from an email (no 0/O, no 1/I/L).
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const randomBlock = (length) => {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[crypto.randomInt(0, ALPHABET.length)];
  }
  return out;
};

// Trainee keys look like CC-TRN-7K29PX, trainer keys like CC-TNR-4M91QZ
const generateKey = (type) => {
  const prefix = type === 'Trainer' ? 'CC-TNR' : 'CC-TRN';
  return `${prefix}-${randomBlock(6)}`;
};

// Keys are unique in the database, so keep trying until we find a free pair.
const generateUniqueKeys = async (Organization) => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const traineeAccessKey = generateKey('Trainee');
    const trainerAccessKey = generateKey('Trainer');

    const clash = await Organization.findOne({
      $or: [
        { traineeAccessKey: { $in: [traineeAccessKey, trainerAccessKey] } },
        { trainerAccessKey: { $in: [traineeAccessKey, trainerAccessKey] } }
      ]
    });

    if (!clash) {
      return { traineeAccessKey, trainerAccessKey };
    }
  }

  throw new Error('Could not generate unique access keys, please try again.');
};

module.exports = { generateKey, generateUniqueKeys };
