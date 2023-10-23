const express = require('express');
const router = express.Router();

//show VOP
router.get('/legal/vop', (req, res) => {
    res.render('legal/vop');
})

//show GDPR
router.get('/legal/gdpr', (req, res) => {
    res.render('legal/gdpr');
})

module.exports = router;