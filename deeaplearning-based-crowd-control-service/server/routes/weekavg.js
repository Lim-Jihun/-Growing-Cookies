const express = require('express');
const AnalyzeInfo = require('../model/analyze_info');
const router = express.Router();

// !메인페이지 이번주, 지난주 비교 그래프 API
router.get('/', async (req, res) => {
    const userId = req.query.userId;

    // const userId = req.session.userId;
    AnalyzeInfo.getWeekAvg(userId, (err, results) => {
        if (!userId) {
            return res.status(400).json({ error: 'ID is null' });
        }
        if (err) {
            console.error('Error fetching analyze info:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log(results);
        res.json(results);


    })
})

module.exports = router;