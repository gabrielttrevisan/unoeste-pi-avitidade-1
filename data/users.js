/**
 * @typedef {Object} User
 * @prop {string} name
 * @prop {string} pass
 */

/**
 * @type {Map.<string, User>}
 */
const USERS = new Map([
  [
    "admin@teste.com",
    {
      name: "Almirante Patacoada",
      pass: "123456",
    },
  ],
]);

export default USERS;
