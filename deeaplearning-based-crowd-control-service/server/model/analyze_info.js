const connection = require('./db');

const AnalyzeInfo = {
  // ! 1분마다 갱신하는 sql문
  getById: (user_id, callback) => {
    connection.query(`SELECT e.exhb_id, SUM(a.population) AS total_population
    FROM analyze_info a
    JOIN zone z ON a.zone_id = z.zone_id
    JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
    WHERE e.user_id = ?
    -- AND a.time BETWEEN DATE_SUB(NOW(), INTERVAL 1 MINUTE) AND NOW()
    GROUP BY e.exhb_id;`, [user_id], callback);
  },
  create: (analyzeInfoData, callback) => {
    connection.query('INSERT INTO analyze_info SET ?', analyzeInfoData, callback);
  },
  // ! 도넛차트 아래 보여줄 기간별 평균 
  getByExhb: (user_id, callback) => {
    connection.query(`SELECT e.exhb_id,
      AVG(CASE WHEN DATE(a.time) = CURDATE() THEN a.population END) AS today_avg_population,
      AVG(CASE WHEN DATE(a.time) = CURDATE() - INTERVAL 1 DAY THEN a.population END) AS yesterday_avg_population,
      AVG(CASE WHEN DATE(a.time) = CURDATE() - INTERVAL 7 DAY THEN a.population END) AS last_week_avg_population,
      AVG(CASE WHEN DATE(a.time) = CURDATE() - INTERVAL 1 MONTH THEN a.population END) AS last_month_avg_population
    FROM analyze_info a
    JOIN zone z ON a.zone_id = z.zone_id
    JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
    WHERE e.user_id = ?
    GROUP BY e.exhb_id;`, [user_id], callback);
  },
  // 기타 메서드들 추가 가능
};

module.exports = AnalyzeInfo;
