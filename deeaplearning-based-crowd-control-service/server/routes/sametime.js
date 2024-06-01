const express = require('express');
const AnalyzeInfo = require('../model/analyze_info');
const router = express.Router();

// todo 1전시관부터 4전시관까지 한번에 받아와야함
// ! ID는 세션값에 있으니깐 ID값으로 전체 전시관 조회하기
// 로그인 후 세션아이디 넘겨 받기

// !도넛차트 아래 동시간대 인원 평균 API
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;

        AnalyzeInfo.getByExhb(userId, (err, results) => {
            if (!userId) {
                return res.status(400).json({ error: 'ID is null' });
            }
            if (err) {
                console.error('Error fetching analyze info:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            console.log(results);
            res.json(results);
        });
    }

    catch (error) {
        console.log('error: ', error);
        return res.status(500).json({ error: 'Internal Server Error' });

    }
})

module.exports = router;