const express = require('express');
const router = express.Router();
const connection = require('../db'); // MySQL 연결 모듈

router.get('/', (req, res) => {
  const query = 'SELECT * FROM visitor_data'; // visitor_data 테이블에서 데이터 가져오기

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching visitor data:', err);
      res.status(500).json({ error: 'Failed to fetch visitor data' });
      return;
    }

    res.json(results);
  });
});

module.exports = router;