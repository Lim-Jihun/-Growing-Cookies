const express = require('express');
const AnalyzeInfo = require('../model/analyze_info');
const { checkUserId } = require('../model/check');
const router = express.Router();

// !메인 페이지 개장시간부터 끝 시간 API
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ error: 'ID is null' });
        }

        // ID 검사
        const userExists = await checkUserId(userId);
        if (!userExists) {
            return res.status(400).json({ error: '해당하는 사용자가 없습니다' });
        }
        // 개장시간부터 보여주는 그래프 정보
        const results = await new Promise((resolve, reject) => {
            AnalyzeInfo.getByTime(userId, (err, data) => {
                if (err) {
                    console.error('오류 발생:', err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        console.log(results);
        res.json(results);
    }
    catch (error) {
        console.error('오류 발생:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
