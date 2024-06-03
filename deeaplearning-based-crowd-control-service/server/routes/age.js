const express = require('express');
const router = express.Router();
const Exhibition = require('../model/exhibition');
const { checkUserId, checkExhbId } = require('../model/check');

router.get('/', async (req, res) => {
    try {
        const { userId, exhbId } = req.query;

        if (!userId || !exhbId) {
            return res.status(400).json({ error: 'userId 또는 exhbId가 입력되지 않았습니다' });
        }

        // ID 검사 
        const userExists = await checkUserId(userId);
        if (!userExists) {
            return res.status(404).json({ error: '해당하는 사용자가 없습니다' });
        }

        // exhbId 검사
        const exhbExists = await checkExhbId(userId, exhbId);
        if (!exhbExists) {
            return res.status(404).json({ error: '해당 전시회가 없습니다' });
        }

        // 연령별 정보 
        const results = await new Promise((resolve, reject) => {
            Exhibition.getByAge(userId, exhbId, (err, data) => {
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
