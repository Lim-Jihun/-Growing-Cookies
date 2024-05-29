const connection = require('./db');

const Exhibition = {
  getAll: (callback) => {
    connection.query('SELECT * FROM exhibition', callback);
  },
  getById: (userId, exhbId, callback) => {
    connection.query('SELECT * FROM exhibition WHERE user_id = ? AND exhb_id = ?', [userId, exhbId], callback);
  },
  create: (exhibitionData, callback) => {
    connection.query('INSERT INTO exhibition SET ?', exhibitionData, callback);
  },
  /** 평균 관람객 추이 */

  getByDate: (userId, exhbId, startTime, endTime, callback) => {
    console.log(startTime, endTime, "쿼리 실행전");
    connection.query(`
      SELECT 
        e.exhb_id,
        DATE_FORMAT(a.time, '%Y-%m-%d %H:00:00') AS hour,
        AVG(CASE WHEN a.time BETWEEN ? AND DATE_ADD(?, INTERVAL 1 HOUR) THEN a.population END) AS current_population,
        AVG(CASE WHEN a.time BETWEEN DATE_SUB(?, INTERVAL 1 DAY) AND DATE_SUB(?, INTERVAL 1 DAY) + INTERVAL 1 HOUR THEN a.population END) AS yesterday_population,
        AVG(CASE WHEN a.time BETWEEN DATE_SUB(?, INTERVAL 1 WEEK) AND DATE_SUB(?, INTERVAL 1 WEEK) + INTERVAL 1 HOUR THEN a.population END) AS last_week_population,
        AVG(CASE WHEN a.time BETWEEN DATE_SUB(?, INTERVAL 1 MONTH) AND DATE_SUB(?, INTERVAL 1 MONTH) + INTERVAL 1 HOUR THEN a.population END) AS last_month_population
      FROM analyze_info a
      JOIN zone z ON a.zone_id = z.zone_id
      JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
      WHERE e.user_id = ? AND e.exhb_id = ?
        -- AND a.time BETWEEN ? AND ?
      GROUP BY e.exhb_id, hour
      ORDER BY hour DESC;`,
      [
        startTime, endTime, 
        startTime, endTime, 
        startTime, endTime, 
        startTime, endTime, 
        userId, exhbId, 
        // startTime, endTime
      ], callback);
  },
  

  // 기타 메서드들 추가 가능
};

module.exports = Exhibition;
