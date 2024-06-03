const pool = require('./db');

const AnalyzeInfo = {
	// todo 시간 수정 필요 
	/** 도넛차트 1분마다 갱신하는 sql문 */
	getById: (userId, callback) => {
		console.log("geyById method");
		pool.query(`SELECT e.exhb_id, SUM(a.population) AS total_population
		FROM analyze_info a
		JOIN zone z ON a.zone_id = z.zone_id
		JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
		WHERE e.user_id = ?
		AND a.time BETWEEN DATE_SUB(NOW(), INTERVAL 10 MINUTE) AND NOW()
		GROUP BY e.exhb_id;`, [userId], callback);
		// ! test 끝나면 INTERVAL 수정하기
	},
	/** 도넛차트 아래 동시간대 인원 */
	getByExhb: (user_id, callback) => {
		console.log("geyByExhb method");

		pool.query(`SELECT e.exhb_id,
       AVG(CASE WHEN HOUR(a.time) = HOUR(NOW()) AND DATE(a.time) = CURDATE() THEN a.population END) AS current_avg_population,
       AVG(CASE WHEN HOUR(a.time) = HOUR(NOW()) AND DATE(a.time) = CURDATE() - INTERVAL 1 DAY THEN a.population END) AS yesterday_avg_population,
       AVG(CASE WHEN HOUR(a.time) = HOUR(NOW()) AND DATE(a.time) = CURDATE() - INTERVAL 7 DAY THEN a.population END) AS last_week_avg_population,
       AVG(CASE WHEN HOUR(a.time) = HOUR(NOW()) AND DATE(a.time) = CURDATE() - INTERVAL 1 MONTH THEN a.population END) AS last_month_avg_population
FROM analyze_info a
  JOIN zone z ON a.zone_id = z.zone_id
  JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
 WHERE e.user_id = ?
 GROUP BY e.exhb_id;`, [user_id], callback);
	},

	/** 메인페이지 이번주, 지난주 라인그래프 */
	getWeekAvg: (user_id, callback) => {
		console.log("geyWeekAvg method");

		pool.query(`SELECT 
		AVG(CASE WHEN a.time BETWEEN CURDATE() - INTERVAL 7 DAY AND NOW() THEN a.population END) AS this_week_avg_population,
		AVG(CASE WHEN a.time BETWEEN CURDATE() - INTERVAL 14 DAY AND CURDATE() - INTERVAL 7 DAY THEN a.population END) AS last_week_avg_population,
		AVG(CASE WHEN a.time BETWEEN CURDATE() - INTERVAL 1 MONTH AND NOW() THEN a.population END) AS last_month_avg_population
	FROM analyze_info a
	JOIN zone z ON a.zone_id = z.zone_id
	JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
	WHERE e.user_id = ?;`, [user_id], callback);
	},
	/**메인페이지 개장 시간부터 보여주는 그래프 */
	getByTime: (userId, callback) => {
		console.log("getByTime Method");
		pool.query(`
	SELECT 
		DATE_FORMAT(a.time, '%Y-%m-%d %H:00:00') AS hour,
		SUM(a.population) AS total_population
	FROM analyze_info a
	JOIN zone z ON a.zone_id = z.zone_id
	JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
	WHERE 
		e.user_id = ?
		AND a.time BETWEEN DATE_FORMAT(NOW(), '%Y-%m-%d 09:00:00') AND DATE_FORMAT(NOW(), '%Y-%m-%d 18:00:00')
	GROUP BY hour
	ORDER BY hour;
		`, [userId], callback);
	},
	// todo 히트맵 정보 갱신 시간 30초 테스트 후 바꾸기
	/** 히트맵 수정 필요 */
	getByZone: (user_id, exhb_id, callback) => {
		console.log("getByZone Method");
		pool.query(`SELECT 
			e.exhb_id,
			z.zone_id,
			SUM(a.population) AS total_population
		FROM analyze_info a
		JOIN zone z ON a.zone_id = z.zone_id
		JOIN exhibition e ON z.user_id = e.user_id AND z.exhb_id = e.exhb_id
		WHERE e.user_id = ? AND e.exhb_id = ?
		GROUP BY z.zone_id;`, [user_id, exhb_id], callback);
	},
	/** top5 구역 쿼리문 수정 필요*/
	topCrowded: (userId, exhbId, callback) => {
		console.log("topCrowded method");
		pool.query(`SELECT z.zone_name, SUM(a.population) AS total_population
		FROM analyze_info a
		JOIN zone z ON a.zone_id = z.zone_id
		JOIN exhibition e ON z.exhb_id = e.exhb_id
		WHERE z.user_id = ? AND e.exhb_id = ? 
		AND a.time BETWEEN DATE_SUB(NOW(), INTERVAL 10 MINUTE) AND NOW()
		GROUP BY z.zone_name
		ORDER BY total_population DESC;`, [userId, exhbId], callback);
	}

};

module.exports = AnalyzeInfo;
