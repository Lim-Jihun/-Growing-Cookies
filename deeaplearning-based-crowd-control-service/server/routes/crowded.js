const express = require('express');
const router = express.Router()
const AnalyzeInfo = require('../model/analyze_info');
const { checkUserId , checkExhbId} = require('../model/check');

/* router가 없어서 추가했습니다 */

// front에서 전시관 클릭시 전시관 id를 넘겨야함
// ! 혼잡도 상위 5개 API 
router.get('/', async (req, res) => {
	try {
		const { userId, exhbId } = req.query;
		if (!userId) {
			return res.status(400).json({ error: 'ID is null' });
		}
		// ID 검사 
		const userExists = await checkUserId(userId);
		if (!userExists) {
			return res.status(404).json({ error: '해당하는 사용자가 없습니다' });
		}

		// exhbId 검사
		const exhbExists = await checkExhbId(userId, exhbId);
		if (!exhbExists) {
			return res.status(404).json({ error: '해당 전시회가 없습니다' });
		}

		// top5 혼잡 구역
		const results = await new Promise((resolve, reject) => {
			AnalyzeInfo.topCrowded(userId, exhbId, (err, data) => {
				if (err) {
					console.error('오류 발생:', err);
					reject(err);
				} else {
					resolve(data);
				}
			});
		})
		console.log(results);
		res.json(results);
	}
	catch (error) {
		console.error('오류 발생:', error);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;