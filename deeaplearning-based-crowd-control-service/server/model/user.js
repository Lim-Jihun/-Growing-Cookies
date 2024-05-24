const connection = require('./db');

const User = {
  getAll: (callback) => {
    connection.query('SELECT * FROM user', callback);
  },
  getById: (userId, userPW, callback) => {
    connection.query('SELECT user_id, com FROM user WHERE user_id = ? AND user_pw = ?', [userId, userPW] ,callback);
  },
  create: (userData, callback) => {
    connection.query('INSERT INTO user SET ?', userData, callback);
  },
  
};

module.exports = User;
