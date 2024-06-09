const express = require('express');
const router = express.Router()
const AnalyzeInfo = require('../model/analyze_info');
const { checkUserId , checkExhbId} = require('../model/check');
const logger = require('../logs/logger');

// front에서 전시관 클릭시 전시관 id 받기
// 혼잡도 상위 5개
router.get('/', async (req, res) => {
	logger.info('crowded router 요청');

	try {
		logger.info('crowded router 시작');

		const { userId, exhbId } = req.query;

		if (!userId) {
            logger.error('아이디가 입력되지 않았습니다');
			return res.status(400).json({ error: 'ID is null' });
		}

		// ID 검사 
		const userExists = await checkUserId(userId);
		if (!userExists) {
            logger.error(`User ID: ${userId} 가 존재하지 않습니다`);
			return res.status(404).json({ error: '해당하는 사용자가 없습니다' });
		}

		// 전시관 ID 검사
		const exhbExists = await checkExhbId(userId, exhbId);
		if (!exhbExists) {
            logger.error(`Exhibition ID: ${exhbId}가 ${userId}에 존재하지 않습니다`);
			return res.status(404).json({ error: '해당 전시관이 없습니다' });
		}

		// DB에서 top5 정보 조회
        logger.info(`User ID: ${userId}, Exhibition ID: ${exhbId} 혼잡도 정보 DB 조회`);
		const results = await new Promise((resolve, reject) => {
			AnalyzeInfo.topCrowded(userId, exhbId, (err, data) => {
				if (err) {
                    logger.error('crowded db 에러', err);
					reject(err);
				} else {
					resolve(data);
				}
			});
		})
        logger.info('crowded 성공');
		res.json(results);
	}
	catch (error) {
        logger.error('crowded router 에러 :', error);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;