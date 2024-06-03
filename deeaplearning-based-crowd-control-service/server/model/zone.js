const pool = require('./db');

const Zone = {
	getAll: (callback) => {
		pool.query('SELECT * FROM zone', callback);
	},
	getById: (zoneId, callback) => {
		pool.query('SELECT * FROM zone WHERE zone_id = ?', [zoneId], callback);
	},
	create: (zoneData, callback) => {
		pool.query('INSERT INTO zone SET ?', zoneData, callback);
	},
	// 기타 메서드들 추가 가능
};

module.exports = Zone;
