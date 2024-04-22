const dados = require('./dados.json');
const express = require('express');
const fs = require('fs');
const cors = require('cors')

const server = express();
server.use(cors())
server.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
server.use(express.json());


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


//update do crud
server.put('/Filmes/:id', (req, res) =>{
    
    const filmeID = parseInt(req.params.id)
    const atualizar_filme = req.body


    const indice_filme = dados.Filmes.findIndex(filmes=>filmes.id === filmeID)

    if(indice_filme === -1){
        return res.status(404).json({mensagem: "Filme não encontrado"})
    }

    dados.Filmes[indice_filme].nome = atualizar_filme.nome || dados.Filmes[indice_filme].nome
    dados.Filmes[indice_filme].capa = atualizar_filme.capa || dados.Filmes[indice_filme].capa
    dados.Filmes[indice_filme].genero = atualizar_filme.genero || dados.Filmes[indice_filme].genero
    dados.Filmes[indice_filme].duracao = atualizar_filme.duracao || dados.Filmes[indice_filme].duracao
    dados.Filmes[indice_filme].data = atualizar_filme.data || dados.Filmes[indice_filme].data
    dados.Filmes[indice_filme].diretor = atualizar_filme.diretor || dados.Filmes[indice_filme].diretor


    salvarDados(dados)
    return res.json({mensagem : "Atualização feita com sucesso"})
})


//delete do crud
server.delete('/Filmes/:id', (req, res)=>{
    const id = parseInt(req.params.id)
    const id_filme = dados.Filmes.filter(u => u.id !== id)

    

    if(id_filme === -1){
        return res.status(404).json({mensagem: "Filme não encontrado"})
    }
    dados.Filmes = id_filme
    salvarDados(dados)
    return res.status(200).json({mensagem : "excluido"})
    
})



server.get('/Filmes', (req, res)=>{
    return res.json(dados.Filmes)
})

function salvarDados(){
    fs.writeFileSync(__dirname + "/dados.json", JSON.stringify(dados, null, 2))
}