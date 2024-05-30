const express = require('express');
const router = express.Router();
const exhibition = require('../model/exhibition');

router.get('/', (req, res) => {
    const { userId, exhbId } = req.query;
    exhibition.getByGender(userId, exhbId, (err, results) => {

        if (err) {
            console.error('Error fetching analyze info:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          console.log(results);
          res.json(results);
        });
});

module.exports = router;