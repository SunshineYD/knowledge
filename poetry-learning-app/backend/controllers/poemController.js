const Poem = require('../models/Poem');
const Checkin = require('../models/Checkin');
const multer = require('multer');
const path = require('path');

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// 添加诗歌
exports.addPoem = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, content, pinyin } = req.body;
      let image = '';

      if (req.file) {
        image = `/uploads/${req.file.filename}`;
      }

      const poem = await Poem.create({
        title,
        content,
        pinyin,
        image,
      });

      res.status(201).json(poem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// 获取所有诗歌
exports.getPoems = async (req, res) => {
  try {
    const poems = await Poem.find();
    res.json(poems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取单个诗歌
exports.getPoem = async (req, res) => {
  try {
    const { id } = req.params;
    const poem = await Poem.findById(id);
    if (!poem) {
      return res.status(404).json({ message: 'Poem not found' });
    }
    res.json(poem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 更新诗歌
exports.updatePoem = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, pinyin } = req.body;

      const poem = await Poem.findById(id);
      if (!poem) {
        return res.status(404).json({ message: 'Poem not found' });
      }

      poem.title = title || poem.title;
      poem.content = content || poem.content;
      poem.pinyin = pinyin || poem.pinyin;

      if (req.file) {
        poem.image = `/uploads/${req.file.filename}`;
      }

      await poem.save();
      res.json(poem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// 删除诗歌
exports.deletePoem = async (req, res) => {
  try {
    const { id } = req.params;

    const poem = await Poem.findById(id);
    if (!poem) {
      return res.status(404).json({ message: 'Poem not found' });
    }

    // 删除相关的打卡记录
    await Checkin.deleteMany({ poem: id });

    await poem.remove();
    res.json({ message: 'Poem deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};