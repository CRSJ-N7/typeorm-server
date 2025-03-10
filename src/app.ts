import express from 'express';
import cors from 'cors';
import path from 'path';
import todosRouter from './routes/todos';
import 'reflect-metadata';

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));

const staticDirPath = path.normalize(`${__dirname}/../public`);
app.use('/public', express.static(staticDirPath));

app.use('/todos', todosRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Stay calm' });
});

export default app;
