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

// 로그인 라우터
const loginRouter = require('./routes/loginRouter');
app.use('/user/login', loginRouter);

const donutRouter = require('./routes/donutchart');
app.use('/donutchart', donutRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
