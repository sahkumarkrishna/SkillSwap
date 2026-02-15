const express = require('express');
const auth = require('../middleware/auth');
const skillController = require('../controllers/skillController');

const router = express.Router();

router.post('/', auth, skillController.createSkill);
router.get('/', skillController.getSkills);
router.get('/:id', skillController.getSkillById);
router.put('/:id', auth, skillController.updateSkill);
router.delete('/:id', auth, skillController.deleteSkill);
router.post('/:id/request', auth, skillController.requestSkill);
router.post('/:id/favorite', auth, skillController.toggleFavorite);
router.post('/:id/rate', auth, skillController.rateSkill);

module.exports = router;
