const dados = require('./dados.json');
const express = require('express');
const fs = require('fs');
const cors = require('cors')

const server = express();
server.use(cors())
server.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.listen(3002, () =>{
    console.log("SERVIDOR ESTÁ FUNCIONAL");
})

server.post('/Filmes', (req, res) => {
    const novoFilme = req.body;
    
    if (!novoFilme.nome || !novoFilme.genero || !novoFilme.duracao || !novoFilme.data || !novoFilme.diretor) {
        return res.status(400).json({ mensagem: "Dados incompletos" });
    }
 
    novoFilme.id = parseInt(novoFilme.id);

    dados.Filmes.push(novoFilme);
    salvarDados(dados);
    return res.status(201).json({ mensagem: "Cadastro realizado com sucesso" });
});

// Atualização do CRUD
server.put('/Filmes/:id', (req, res) =>{
    const filmeID = parseInt(req.params.id)
    const atualizar_filme = req.body

    const indice_filme = dados.Filmes.findIndex(filmes => filmes.id === filmeID)

    if (indice_filme === -1) {
        return res.status(404).json({ mensagem: "Filme não encontrado" });
    }

    dados.Filmes[indice_filme] = { ...dados.Filmes[indice_filme], ...atualizar_filme };
    salvarDados(dados);
    return res.json({ mensagem: "Atualização feita com sucesso" });
})

// Exclusão do CRUD
server.delete('/Filmes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = dados.Filmes.findIndex(filme => filme.id === id);

    if (index === -1) {
        return res.status(404).json({ mensagem: "Filme não encontrado" });
    }

    dados.Filmes.splice(index, 1);
    salvarDados(dados);
    return res.status(200).json({ mensagem: "Filme excluído com sucesso" });
})

// Listar todos os filmes
server.get('/Filmes', (req, res) => {
    return res.json(dados.Filmes);
})

// Filtrar filmes por gênero
server.get('/Filmes/genero/:genero', (req, res) => {
    const genero = req.params.genero;
    const filmesPorGenero = dados.Filmes.filter(filme => filme.genero.toLowerCase() === genero.toLowerCase());

    if (filmesPorGenero.length === 0) {
        return res.status(404).json({ mensagem: "Nenhum filme encontrado para o gênero especificado" });
    }

    return res.json(filmesPorGenero);
})

function salvarDados(dados) {
    fs.writeFileSync(__dirname + "/dados.json", JSON.stringify(dados, null, 2));
}
