const express = require('express');
const router = express.Router();
const exhibition = require('../model/exhibition');

router.get('/', (req, res) => {
    try {
        const { userId, exhbId } = req.query;
        exhibition.getByAge(userId, exhbId, (err, results) => {
            if (err) {
                console.error('Error fetching analyze info:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            console.log(results);
            res.json(results);
        });
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
