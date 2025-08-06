const express = require('express');
const port:number = 3000
const app = express();

app.get('/', (req:any, res:any) => {
 res.send('Home Page');
});

app.get('/movies', (req:any, res:any) => {
 res.send('Listagem de filmes');
});

app.listen(3000, () => {
 console.log(`Servidor iniciado na porta http://localhost:${port}`);
});