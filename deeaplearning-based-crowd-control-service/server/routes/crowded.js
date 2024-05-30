const express = require('express');
const AnalyzeInfo = require('../model/analyze_info');
const router = express.Router();

// front에서 전시관 클릭시 전시관 id를 넘겨야함

// ! 혼잡도 상위 5개 API 


router.get('/query', (req, res) => {
  const userId = req.query.userId; // req.body 대신 req.query 사용
  const exhbId = req.query.exhbId; // req.body 대신 req.query 사용

  AnalyzeInfo.topCrowded(userId, exhbId, (err, results) => {
    if (err) {
      console.error('Error fetching analyze info:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

module.exports = router;