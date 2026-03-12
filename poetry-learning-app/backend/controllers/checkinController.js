const Checkin = require('../models/Checkin');
const Child = require('../models/Child');

// 打卡诗歌
exports.checkinPoem = async (req, res) => {
  try {
    const { childId, poemId } = req.params;
    const { completed, familiarity } = req.body;

    // 确保孩子属于当前用户
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    if (child.parent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // 查找或创建打卡记录
    let checkin = await Checkin.findOne({ child: childId, poem: poemId });

    if (!checkin) {
      checkin = await Checkin.create({
        child: childId,
        poem: poemId,
        completed,
        familiarity,
        lastCheckedIn: new Date(),
      });
    } else {
      checkin.completed = completed;
      checkin.familiarity = familiarity;
      checkin.lastCheckedIn = new Date();
      await checkin.save();
    }

    // 更新孩子的学习进度
    if (completed) {
      const learnedPoemsCount = await Checkin.countDocuments({ child: childId, completed: true });
      await Child.findByIdAndUpdate(childId, {
        learnedPoems: learnedPoemsCount,
        streak: child.streak + 1,
      });
    }

    res.json(checkin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取孩子的打卡记录
exports.getChildCheckins = async (req, res) => {
  try {
    const { childId } = req.params;

    // 确保孩子属于当前用户
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    if (child.parent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const checkins = await Checkin.find({ child: childId }).populate('poem');
    res.json(checkins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 更新熟悉度
exports.updateFamiliarity = async (req, res) => {
  try {
    const { childId, poemId } = req.params;
    const { familiarity } = req.body;

    // 确保孩子属于当前用户
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    if (child.parent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const checkin = await Checkin.findOne({ child: childId, poem: poemId });
    if (!checkin) {
      return res.status(404).json({ message: 'Checkin record not found' });
    }

    checkin.familiarity = familiarity;
    await checkin.save();

    res.json(checkin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};