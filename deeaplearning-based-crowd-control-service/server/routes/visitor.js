const express = require('express');
const Exhibition = require('../model/exhibition');
const router = express.Router();

// http://localhost:4000/visitor/query?userId=user1&exhbId=exhb1&date=2024-05-29 이런식으로 넘겨주면 됩니다.
router.get('/query', (req, res) => {
    const { userId, exhbId, date } = req.query; // 클라이언트에서 전달하는 date 파라미터를 받음
    const startTime = `${date} 09:00:00`;
    const endTime = `${date} 21:00:00`;

    Exhibition.getByDate(userId, exhbId, startTime, endTime, (err, results) => {
        console.log(userId, exhbId, "id,exhb확인");
        console.log("start: ", startTime, "end: ", endTime);
        if (err) {
            console.error('Error fetching analyze info:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log(results);
        res.json(results);
    });
});

module.exports = router;
