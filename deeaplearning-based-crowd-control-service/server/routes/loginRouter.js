const express = require('express');
const User = require('../model/user');
const router = express.Router();


router.post('/', (req, res) => {
  const { userID, userPW } = req.body;
  User.getById(userID, userPW, (err, results) => {
    if (err) {
      console.error('Error fetching analyze info:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length > 0) {
      req.session.userId = results[0].user_id;
      console.log('세션에 id값 저장', req.session.userId);
    }
    console.log(results);
    res.json(results);

  });
});


module.exports = router;
