import express from 'express';
const port: number = 3000;
const app = express();

import { PrismaClient } from './generated/prisma/index.js';
const prisma = new PrismaClient();

import SwaggerUiOptions from 'swagger-ui-express';
import SwaggerDocument from './swagger.json' with {type: 'json'}

app.use(express.json());
app.use('/docs', SwaggerUiOptions.serve, SwaggerUiOptions.setup(SwaggerDocument))

app.get('/', (req, res) => {
  res.send('Home Page');
});

app.get('/movies', async (req, res) => {
  const movies = await prisma.movie.findMany({
    orderBy: {
      id: 'asc',
    },
    include: {
      genres: true,
      languages: true,
    },
  });
  res.json(movies);
});

app.get('/movies/:genreName', async (req, res) => {
  try {
    const moviesFilteredByGenre = await prisma.movie.findMany({
      include: {
        genres: true,
        languages: true,
      },
      where: {
        genres: {
          name: {
            equals: req.params.genreName,
            mode: 'insensitive',
          },
        },
      },
    });

    if (moviesFilteredByGenre.length === 0) {
      return res.status(404).send('Nenhum filme do gênero encontrado!')
    }

    res.status(200).send(moviesFilteredByGenre);
  } catch (err) {
    return res.status(500).send("O servidor encontrou um erro!");
  }
});

app.post('/movies', async (req, res) => {
  const { title, language_id, genre_id, oscar_count, release_date } = req.body;
  try {
    const duplicatedMovieName = await prisma.movie.findFirst({
      where: {
        title: { equals: title, mode: 'insensitive' },
      },
    });

    if (duplicatedMovieName) {
      return res.status(409).send('Já há um registro com este título');
    }

    await prisma.movie.create({
      data: {
        title,
        language_id,
        genre_id,
        oscar_count,
        release_date: new Date(release_date),
      },
    });
  } catch (error) {
    return res.status(500).send('Falha a cadastrar o filme');
  }

  res.status(201).send('Post efetuado com sucesso');
});

app.put('/movies/:id', async (req, res) => {
  const movieID = Number(req.params.id);

  try {
    const idVerification = await prisma.movie.findUnique({
      where: {
        id: movieID,
      },
    });

    if (!idVerification) {
      return res.status(404).send('ID não encontrado no banco!');
    }

    const data = { ...req.body };
    data.release_date = data.release_date ? new Date(data.release_date) : undefined;

    const duplicatedMovieName = await prisma.movie.findFirst({
      where: {
        title: { equals: data.title, mode: 'insensitive' },
        NOT: { id: movieID },
      },
    });

    if (duplicatedMovieName) {
      return res.status(409).send('Já há um registro com este título');
    }

    const movieToUpdate = await prisma.movie.update({
      where: {
        id: movieID,
      },

      data: data,
    });
  } catch (err) {
    return res.status(500).send('Falha ao atualizar o registro!');
  }
  res.status(200).send('Registro atualizado com sucesso!');
});

app.delete('/movies/:id', async (req, res) => {
  const id = Number(req.params.id);

  try {
    const idVerification = await prisma.movie.findUnique({ where: { id } });

    if (!idVerification) {
      return res.status(404).send('ID não encontrado no banco!');
    }

    await prisma.movie.delete({ where: { id } });
  } catch (error) {
    return res.status(500).send('Não foi possível deletar o Registro');
  }

  return res.status(200).send('Registro deletado com sucesso');
});

app.listen(3000, () => {
  console.log(`Servidor iniciado na porta http://localhost:${port}`);
});
