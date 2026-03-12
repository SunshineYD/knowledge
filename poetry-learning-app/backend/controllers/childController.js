const Child = require('../models/Child');
const User = require('../models/User');

// 添加孩子
exports.addChild = async (req, res) => {
  try {
    const { name, age } = req.body;
    const parentId = req.user._id;

    const child = await Child.create({
      name,
      age,
      parent: parentId,
    });

    // 将孩子添加到用户的children数组中
    await User.findByIdAndUpdate(parentId, {
      $push: { children: child._id },
    });

    res.status(201).json(child);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取用户的所有孩子
exports.getChildren = async (req, res) => {
  try {
    const children = await Child.find({ parent: req.user._id });
    res.json(children);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 更新孩子信息
exports.updateChild = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age } = req.body;

    const child = await Child.findById(id);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    // 确保孩子属于当前用户
    if (child.parent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    child.name = name || child.name;
    child.age = age || child.age;

    await child.save();
    res.json(child);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 删除孩子
exports.deleteChild = async (req, res) => {
  try {
    const { id } = req.params;

    const child = await Child.findById(id);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    // 确保孩子属于当前用户
    if (child.parent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // 从用户的children数组中移除
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { children: id },
    });

    await child.remove();
    res.json({ message: 'Child deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};