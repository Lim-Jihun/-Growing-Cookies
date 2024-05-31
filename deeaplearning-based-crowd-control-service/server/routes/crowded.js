const express = require('express');
const router = express.Router()
const AnalyzeInfo = require('../model/analyze_info');
/* router가 없어서 추가했습니다 */

// * test용 아이디 
userId = 'user1';
exhb_id = 'exhb1';

// front에서 전시관 클릭시 전시관 id를 넘겨야함

// ! 혼잡도 상위 5개 API 


router.get('/query', (req, res) => {
  const { userId, exhbId } = req.query;
  AnalyzeInfo.topCrowded(userId, exhbId, (err, results) => {
    if (err) {
      console.error('Error fetching analyze info:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

module.exports = router;