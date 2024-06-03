const express = require('express');
const AnalyzeInfo = require('../model/analyze_info');
const router = express.Router();

// !메인 페이지 개장시간부터 끝 시간 API
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        
        if (!userId) {
            return res.status(400).json({ error: 'ID is null' });
        }
        // AnalyzeInfo.getByTime 호출 및 에러 처리
        AnalyzeInfo.getByTime(userId, (err, results) => {
            if (err) {
                console.error('Error fetching analyze info:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            console.log(results);
            res.json(results);
        });

    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
