const express = require('express');
const router = express.Router();
const { getResume, updateResume, getTailoredVersions, deleteTailoredVersion } = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/', getResume);
router.put('/', updateResume);
router.get('/tailored', getTailoredVersions);
router.delete('/tailored/:versionId', deleteTailoredVersion);

module.exports = router;
