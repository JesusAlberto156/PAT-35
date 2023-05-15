const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('PAT-035/LandingPage')
});

module.exports = router;

