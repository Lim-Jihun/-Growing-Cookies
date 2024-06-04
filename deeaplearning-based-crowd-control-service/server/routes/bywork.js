const express = require("express");
const Exhibition = require("../model/exhibition");
const { checkExhbId, checkUserId } = require("../model/check");
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const { userId, exhbId } = req.query;

        if (!userId || !exhbId) {
            return res.status(400).json({ error: 'userId or exhbId is null' });
        }
        // Id 검사
        const userExists = await checkUserId(userId);
        if (!userExists) {
            return res.status(404).json({ error: '해당하는 사용자가 없습니다'})
        }
        // exhbId 검사
        const exhbExists = await checkExhbId(userId, exhbId);
        if (!exhbExists) {
            return res.status(404).json({ error: '해당 전시회가 없습니다' });
        }
        // todo 구역별 평균 체류 시간(지금은 5분전까지 조회, 상의 후 변경)
        const results = await new Promise((resolve, reject) => {
            Exhibition.getByWork(userId, exhbId, (err, data) => {
                if (err) {
                    console.error('오류 발생:', err);
                    reject(err);
                } else {
                    resolve(data);
                }
            })

        })
        res.json(results);
    }

    catch (error) {
        console.error('오류 발생:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;