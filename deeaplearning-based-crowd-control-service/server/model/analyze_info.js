const connection = require('./db');

const AnalyzeInfo = {
  getAll: (callback) => {
    connection.query('SELECT * FROM analyze_info', callback);
  },
  getById: (exhb_id, callback) => {
    connection.query(`SELECT SUM(analyze_info.population) AS total_population 
    FROM analyze_info
    JOIN zone ON analyze_info.zone_id = zone.zone_id
    JOIN exhibition ON zone.user_id = exhibition.user_id AND zone.exhb_id = exhibition.exhb_id
    WHERE exhibition.exhb_id = ?`, [exhb_id], callback);
  },
  create: (analyzeInfoData, callback) => {
    connection.query('INSERT INTO analyze_info SET ?', analyzeInfoData, callback);
  },
  // 기타 메서드들 추가 가능
};

module.exports = AnalyzeInfo;
