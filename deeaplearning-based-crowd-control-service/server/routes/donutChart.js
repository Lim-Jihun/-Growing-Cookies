const express = require('express');
const User = require('../model/analyze_info');
const AnalyzeInfo = require('../model/analyze_info');
const router = express.Router();

router.get('/', (req, res) => {
    const { userID, exhb_id } = req.body;
    AnalyzeInfo.getById(userID, exhb_id, (req, res) => {
        if (err) {
            console.error('Error fetching analyze info:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    })
})