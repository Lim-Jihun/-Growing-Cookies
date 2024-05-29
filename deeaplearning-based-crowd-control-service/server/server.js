const express = require("express");
const app = express();
const session = require('./session');
const port = 4000;
const cors = require("cors");

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 로그인 
const loginRouter = require('./routes/loginRouter');
app.use('/user/login', loginRouter);
// 도넛 차트
const donutRouter = require('./routes/donutChart');
app.use('/donutchart', donutRouter);
// 히트맵
const heapmapRouter = require('./routes/heatmap');
app.use('/heatmap', heapmapRouter);
// 로그아웃
const logoutRouter = require('./routes/logout');
app.use('/user/logout', logoutRouter);
// 혼잡도 상위 5개 
const topRouter = require('./routes/crowded');
app.use('/crowded', topRouter);
// 평균추이 그래프
const visitorRouter = require('./routes/visitor');
app.use('/visitor', visitorRouter);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
