const express = require('express');
const AnalyzeInfo = require('../model/analyze_info');
const { checkUserId , checkExhbId} = require('../model/check');
const router = express.Router();


router.get('/', async (req, res) => {
    try {

        const { userId, exhbId } = req.query;

        if (!userId || !exhbId) {
            return res.status(400).json({ error: 'userId or exhbId is null' });
        }
        // ID 검사 (함수 호출)
        const userExists = await checkUserId(userId);
        if (!userExists) {
            return res.status(404).json({ error: '해당하는 사용자가 없습니다' });
        }

        // exhbId 검사
        const exhbExists = await checkExhbId(userId, exhbId);
        if (!exhbExists) {
            return res.status(404).json({ error: '해당 전시회가 없습니다' });
        }
        // 히트맵 정보
        const results = await new Promise((resolve, reject) => {
            AnalyzeInfo.getByZone(userId, exhbId, (err, data) => {
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