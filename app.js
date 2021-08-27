import express, { json, urlencoded } from 'express';
import indexRouter from './routes/index.js';
// const indexRouter = require('./routes/index');

const app = express();
app.use(json());
app.use(urlencoded({ extended: false }));

app.use('/', indexRouter);

export default app;
