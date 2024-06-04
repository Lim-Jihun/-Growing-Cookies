const express = require('express');
const Exhibition = require('../model/exhibition');
const { checkUserId } = require('../model/check');
const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const { userId, exhbId, date } = req.query; // 클라이언트에서 전달하는 date 파라미터를 받음
        const startTime = `${date} 09:00:00`;
        const endTime = `${date} 18:00:00`;

        if (!userId || !exhbId) {
            return res.status(400).json({ error: 'userId or exhbId is null' });
        }
        // ID 검사
        const userExists = await checkUserId(userId);
        if (!userExists) {
            return res.status(404).json({ error: '해당하는 사용자가 없습니다' });
        }

        const results = await new Promise((resolve, reject) => {
            Exhibition.getByDate(userId, exhbId, startTime, endTime, (err, data) => {
                if (err) {
                    console.error('오류 발생:', err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
        // console.log(results);
        res.json(results);
    }
    catch (error) {
        console.error('오류 발생:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
