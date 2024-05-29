const express = require('express');
const AnalyzeInfo = require('../model/analyze_info');
const router = express.Router();

// * test용 아이디 
userID = 'user1';
exhb_id = 'exhb1';

// front에서 전시관 클릭시 전시관 id를 넘겨야함

// ! 혼잡도 상위 5개 API 

router.get('/', (req, res) => {
    // const { userID , exhb_id} = req.body;
    AnalyzeInfo.topCrowded(userID, exhb_id, (err, results) => {
        if (err) {
            console.error('Error fetching analyze info:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log(results);
        res.json(results);
        


    })
})

module.exports = router;