const connection = require('./db');

const AnalyzeInfo = {
  getAll: (callback) => {
    connection.query('SELECT * FROM analyze_info', callback);
  },
  getById: (user_id, callback) => {
    connection.query('SELECT * FROM analyze_info WHERE sequence = ?', [user_id], callback);
  },
  create: (analyzeInfoData, callback) => {
    connection.query('INSERT INTO analyze_info SET ?', analyzeInfoData, callback);
  },
  // 기타 메서드들 추가 가능
};

module.exports = AnalyzeInfo;
