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
    console.log("쿼리 실행전 시간", startTime, endTime);
    connection.query(`
    SELECT 
  e.exhb_id,
  DATE_FORMAT(a.time, '%Y-%m-%d %H:00:00') AS hour,
  AVG(CASE WHEN a.time BETWEEN ? AND ? THEN a.population END) AS current_population,
  AVG(CASE WHEN a.time BETWEEN DATE_SUB(?, INTERVAL 1 DAY) AND DATE_SUB(?, INTERVAL 1 DAY) THEN a.population END) AS yesterday_population,
  AVG(CASE WHEN a.time BETWEEN DATE_SUB(?, INTERVAL 1 WEEK) AND DATE_SUB(?, INTERVAL 1 WEEK) THEN a.population END) AS last_week_population,
  AVG(CASE WHEN a.time BETWEEN DATE_SUB(?, INTERVAL 1 MONTH) AND DATE_SUB(?, INTERVAL 1 MONTH) THEN a.population END) AS last_month_population
FROM analyze_info a
JOIN zone z ON a.zone_id = z.zone_id
JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
WHERE e.user_id = ?
  AND e.exhb_id = ?
GROUP BY e.exhb_id, hour
HAVING current_population IS NOT NULL
   OR yesterday_population IS NOT NULL
   OR last_week_population IS NOT NULL
   OR last_month_population IS NOT NULL
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


  /** 성별 정보*/
  // ! 오늘 자정부터 현재 시간까지 누적 되게
  getByGender: (userId, exhbId, callback) => {
    console.log("getByGender method");
    connection.query(`
    SELECT 
  e.exhb_id, 
  SUM(a.man_cnt), 
  SUM(a.woman_cnt)
FROM analyze_info a
JOIN zone z ON a.zone_id = z.zone_id
JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
WHERE e.user_id = ? AND e.exhb_id = ?
  AND a.time BETWEEN CURDATE() AND NOW();`, [userId, exhbId], callback);
  },


  /** 연령별 정보*/
  // ! 오늘 자정부터 현재 시간까지 누적 되게
  getByAge: (userId, exhbId, callback) => {
    console.log("getByAge method");
    connection.query(`
    SELECT 
  e.exhb_id,
  SUM(a.child_man) AS sum_child_man, 
  SUM(a.teen_man) AS sum_teen_man, 
  SUM(a.youth_man) AS sum_youth_man, 
  SUM(a.middle_man) AS sum_middle_man, 
  SUM(a.old_man) AS sum_old_man, 
  SUM(a.child_woman) AS sum_child_woman, 
  SUM(a.teen_woman) AS sum_teen_woman, 
  SUM(a.youth_woman) AS sum_youth_woman, 
  SUM(a.middle_woman) AS sum_middle_woman, 
  SUM(a.old_woman) AS sum_old_woman
FROM analyze_info a
JOIN zone z ON a.zone_id = z.zone_id
JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
WHERE e.user_id = ? AND e.exhb_id = ?
  AND a.time BETWEEN CURDATE() AND NOW();
    `, [userId, exhbId], callback);
  }
};

module.exports = Exhibition;
