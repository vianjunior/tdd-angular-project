const express = require('express');
const cors = require('cors');
const cookieParse = require('cookie-parser');
const AuthRouter = require('./auth/AuthRouter');

const app = express();

app.use(express.json());
app.use(cookieParse());
app.use(cors());
app.use(AuthRouter);

module.exports = app;
