import express, { Application } from 'express';
import dotenv from 'dotenv';
import youtubeRoutes from './routes/youtube.routes';
import { logger } from './utils/logger';
import path from 'path';
dotenv.config();

const app: Application = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/youtube', youtubeRoutes); 

app.use((err: any, req: any, res: any, next: any) => {
  logger.error(err.message);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
