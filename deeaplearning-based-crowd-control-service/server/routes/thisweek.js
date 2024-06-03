const express = require('express');
const Exhibition = require('../model/exhibition');
const { checkUserId } = require('../model/check');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ error: 'userId is null' });
        }
        // ID 검사
        const userExists = await checkUserId(userId);
        if (!userExists) {
            return res.status(404).json({ error: '해당하는 사용자가 없습니다' });
        }

        const results = await new Promise((resolve, reject) => {
            Exhibition.thisWeek(userId, (err, data) => {
                if (err) {
                    console.error('오류 발생:', err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
        console.log(results);
        res.json(results);
    }
    catch (error) {
        console.error('오류 발생:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
