const Skill = require('../models/Skill');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.createSkill = async (req, res) => {
  try {
    const { title, description, category, level, timeSlots, duration, tags, price } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category are required' });
    }

    const skill = new Skill({
      user: req.user._id,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      level: level || 'Beginner',
      timeSlots: Array.isArray(timeSlots) ? timeSlots : [],
      duration: duration ? duration.trim() : '',
      tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()) : [],
      price: Number(price) || 0
    });

    const savedSkill = await skill.save();
    await savedSkill.populate('user', 'name profilePicture');
    res.status(201).json(savedSkill);
  } catch (err) {
    console.error('Create skill error:', err);
    res.status(500).json({ message: 'Server error creating skill' });
  }
};

exports.getSkills = async (req, res) => {
  try {
    const { category, level, search, sortBy = 'createdAt', order = 'desc', userId } = req.query;
    let query = { isActive: true, isApproved: true };

    if (userId) query.user = userId;
    if (category && category !== 'All') query.category = category;
    if (level && level !== 'All') query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const skills = await Skill.find(query)
      .populate('user', 'name profilePicture')
      .sort(sortObj);

    res.json(skills);
  } catch (err) {
    console.error('Get skills error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSkillById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid skill ID' });
    }

    const skill = await Skill.findById(req.params.id).populate('user', 'name profilePicture bio location');
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (err) {
    console.error('Get skill error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSkill = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid skill ID' });
    }

    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const { title, description, category, level, timeSlots, duration, tags, price } = req.body;
    
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category are required' });
    }
    
    skill.title = title.trim();
    skill.description = description.trim();
    skill.category = category.trim();
    skill.level = level || 'Beginner';
    skill.timeSlots = Array.isArray(timeSlots) ? timeSlots : [];
    skill.duration = duration ? duration.trim() : '';
    skill.tags = Array.isArray(tags) ? tags.filter(tag => tag.trim()) : [];
    skill.price = Number(price) || 0;

    const updatedSkill = await skill.save();
    await updatedSkill.populate('user', 'name profilePicture');
    res.json(updatedSkill);
  } catch (err) {
    console.error('Update skill error:', err);
    res.status(500).json({ message: 'Server error updating skill' });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid skill ID' });
    }

    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error('Delete skill error:', err);
    res.status(500).json({ message: 'Server error deleting skill' });
  }
};

exports.requestSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    skill.requestCount += 1;
    await skill.save();
    res.json({ message: 'Skill requested successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const skillId = req.params.id;
    
    if (!user.favoriteSkills) user.favoriteSkills = [];
    
    const isFavorite = user.favoriteSkills.includes(skillId);
    
    if (isFavorite) {
      user.favoriteSkills = user.favoriteSkills.filter(id => id.toString() !== skillId);
      await Skill.findByIdAndUpdate(skillId, { $inc: { favoriteCount: -1 } });
    } else {
      user.favoriteSkills.push(skillId);
      await Skill.findByIdAndUpdate(skillId, { $inc: { favoriteCount: 1 } });
    }
    
    await user.save();
    res.json({ isFavorite: !isFavorite });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.rateSkill = async (req, res) => {
  try {
    const { rating } = req.body;
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    const newRating = ((skill.rating * skill.ratingCount) + rating) / (skill.ratingCount + 1);
    skill.rating = Math.round(newRating * 10) / 10;
    skill.ratingCount += 1;
    
    await skill.save();
    res.json({ rating: skill.rating, ratingCount: skill.ratingCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};