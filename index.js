const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// 使用body-parser中间件解析POST请求的JSON数据
app.use(bodyParser.json());

// 模拟用户数据存储
let users = [
  { id: 1, username: 'john_doe', password: 'password123', portfolios: [] },
  // 添加更多用户数据...
];

// 模拟作品集和模板数据存储
let portfolios = [
  { id: 1, title: 'Web Developer Portfolio', template: 'default', projects: [] },
  // 添加更多作品集数据...
];

// 用户认证中间件
function authenticateUser(req, res, next) {
  const userId = req.headers.userid;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = users.find((u) => u.id === parseInt(userId));

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = user;
  next();
}

// 处理获取所有作品集的请求
app.get('/portfolios', (req, res) => {
  res.json({ portfolios });
});

// 处理获取单个作品集的请求
app.get('/portfolio/:portfolioId', (req, res) => {
  const portfolioId = parseInt(req.params.portfolioId);
  const portfolio = portfolios.find((p) => p.id === portfolioId);

  if (portfolio) {
    res.json({ portfolio });
  } else {
    res.status(404).json({ message: 'Portfolio not found' });
  }
});

// 处理用户创建作品集的请求
app.post('/user/:userId/create-portfolio', authenticateUser, (req, res) => {
  const userId = parseInt(req.params.userId);
  const { title, template } = req.body;

  const user = req.user;

  const newPortfolio = { id: portfolios.length + 1, title, template, projects: [] };
  portfolios.push(newPortfolio);

  user.portfolios.push(newPortfolio.id);

  res.json({ message: 'Portfolio created successfully', portfolio: newPortfolio });
});

// 启动Express应用程序
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
