const express = require('express');
const router = express.Router();
const exhibition = require('../model/exhibition');

router.get('/', (req, res) => {
    const { userId, exhbId } = req.query;
    exhibition.getByAge(userId, exhbId, (err, results) => {
        if (!userId) {
            return res.status(400).json({ error: 'ID is null' });
        }
        if (err) {
            console.error('Error fetching analyze info:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log(results);
        res.json(results);
    });
});

module.exports = router;