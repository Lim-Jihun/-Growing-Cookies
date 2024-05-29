const express = require('express');
const AnalyzeInfo = require('../model/analyze_info');
const router = express.Router();

// 테스트용
userID = 'user1';
exhbID = 'exhb1';

// front에서 전시관 클릭시 전시관 id를 넘겨야함
router.get('/:exhbID', (req, res) => {
    // const userID = req.session.userID;
    // const exhbID = req.params.exhbID; // URL에서 전시관 ID를 파라미터로 받음

    AnalyzeInfo.getByZone(userID, exhb_id, (err, results) => {
        if (err) {
            console.error('Error fetching analyze info:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log(results);
        res.json(results);



    })
})

module.exports = router;