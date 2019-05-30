const express = require('express');
const router = express.Router();
//Redirects to users route
router.get('/', (req, res) => { res.redirect('/api/users') });

module.exports = router;