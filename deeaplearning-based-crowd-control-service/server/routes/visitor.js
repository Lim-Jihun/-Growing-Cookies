const express = require('express');
const Exhibition = require('../model/exhibition');
const router = express.Router();

// http://localhost:4000/visitor/query?userId=user1&exhbId=exhb1&date=2024-05-29 이런식으로 넘겨주면 됩니다.
router.get('/query', (req, res) => {

    try {
        const { userId, exhbId, date } = req.query; // 클라이언트에서 전달하는 date 파라미터를 받음
        const startTime = `${date} 09:00:00`;
        const endTime = `${date} 18:00:00`;
        console.log("userId:", userId, "exhbId:", exhbId);
        console.log("start: ", startTime, "end: ", endTime);
        Exhibition.getByDate(userId, exhbId, startTime, endTime, (err, results) => {
            if (!userId) {
                return res.status(400).json({ error: 'ID is null' });
            }
            if (err) {
                console.error('Error fetching analyze info:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            // console.log(results);
            res.json(results);
        });
    }
    catch (error) {
        console.log('error: ', error);
        return res.status(500).json({ error: 'Internal Server Error' });

    }
});

module.exports = router;
