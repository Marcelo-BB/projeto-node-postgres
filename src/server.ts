import express from 'express';
import { PrismaClient } from './generated/prisma/index.js';
const port: number = 3000;
const app = express();
const prisma = new PrismaClient();

app.get('/', (req, res) => {
  res.send('Home Page');
});

app.get('/movies', async (req, res) => {
  const movies = await prisma.movie.findMany({
    orderBy: {
      title: 'asc',
    },
    include: {
       genres: true,
       languages: true
    }
  });
  res.json(movies);
});

app.listen(3000, () => {
  console.log(`Servidor iniciado na porta http://localhost:${port}`);
});
