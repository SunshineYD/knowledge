const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// 导入路由
const userRoutes = require('./routes/userRoutes');
const childRoutes = require('./routes/childRoutes');
const poemRoutes = require('./routes/poemRoutes');
const checkinRoutes = require('./routes/checkinRoutes');

const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由
app.use('/api/users', userRoutes);
app.use('/api/children', childRoutes);
app.use('/api/poems', poemRoutes);
app.use('/api/checkins', checkinRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});