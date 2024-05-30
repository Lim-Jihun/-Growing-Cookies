const express = require('express');
const AnalyzeInfo = require('../model/analyze_info');
const router = express.Router();

// 테스트용
// userID = 'user1';

// todo 1전시관부터 4전시관까지 한번에 받아와야함
// ! ID는 세션값에 있으니깐 ID값으로 전체 전시관 조회하기
// 로그인 후 세션아이디 넘겨 받기

router.get('/', async (req, res) => {
    console.log("라우터 실행확인");
    const userId = req.query.userId;
    // console.log("session확인",req.session);
    // console.log("sessionID 확인",req.session.userId);

    // const userId = req.session.userId;
    AnalyzeInfo.getById(userId, (err, results) => {
        if(!userId) {
            return res.status(400).json({error: 'ID is null'});
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