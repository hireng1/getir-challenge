import express, { json, urlencoded } from 'express';
import indexRouter from './routes/index.js';


const app = express();
app.use(json());
app.use(urlencoded({ extended: false }));

/* 
 * Registering the / route which will be handled by the controller - indexRouter (routes/index.js)
 */
app.use('/', indexRouter);

export default app;
