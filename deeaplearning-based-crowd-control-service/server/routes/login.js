const express = require('express');
const User = require('../model/user');
const router = express.Router();

// 여기 수정
userID = 'user1';
userPW = 'password1';

router.get('/', (req, res) => {
  User.getById(userID,userPW,(err, results) => {
    if (err) {
      console.error('Error fetching analyze info:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length > 0) {
      req.session.userId = results[0].user_id;
      console.log('User ID stored in session:', req.session.userId);
    }
    console.log(results);
    res.json(results);
    
  });
});
d
router.get('/info', (req, res) => {
  console.log('hi');
  res.send('hi');
})

module.exports = router;
