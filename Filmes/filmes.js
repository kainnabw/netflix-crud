const filmeForm = document.getElementById('filme_form');
const filmeList = document.getElementById('filme_list');
const filmeEdit = document.getElementById('myModaledit');
const filmeInfo = document.getElementById('filme_info');
const botao_cadastro = document.getElementById('botao_cadastro');
const modal = document.getElementById("myModal");
const modal_cadastro = document.getElementById("myModalCadastro");
const modal_edit = document.getElementById("myModaledit");
const span = document.getElementsByClassName("close")[0];
const span_cadastro = document.getElementsByClassName("close_cadastro")[0];
const span_edit = document.getElementsByClassName("closeedit")[0];
const generoFilter = document.getElementById('genero_filter');

// Abrir modal de cadastro
botao_cadastro.addEventListener('click', () => {
    modal_cadastro.style.display = "block";
});

// Listar filmes com filtro opcional
function listFilmes(genero = '') {
    const url = genero ? `http://localhost:3002/Filmes/genero/${genero}` : 'http://localhost:3002/Filmes';
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            filmeList.innerHTML = '';
            data.forEach(filmes => {
                const div = document.createElement('div'); 
                div.style.display = 'flex';
                div.style.flexDirection = 'column';
                div.style.padding = '10px';
                
                const img = document.createElement('img');
                img.src = filmes.capa;
                img.style.width = '185px'; 
                img.style.height = '260px';

                img.addEventListener('click', function() {
                    viewFilme(filmes);
                });

                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.classList.add('botao');
                editButton.type = 'button';
                editButton.addEventListener('click', () => {
                    modal_edit.style.display = "block";
                    editFilmes(filmes);
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Excluir';
                deleteButton.classList.add('botao');
                deleteButton.addEventListener('click', () => {
                    delete_filme(filmes);
                });

                div.appendChild(img);
                div.appendChild(editButton);
                div.appendChild(deleteButton);
                
                filmeList.appendChild(div);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Atualizar a listagem de filmes quando o filtro de gênero mudar
generoFilter.addEventListener('change', () => {
    const selectedGenero = generoFilter.value;
    listFilmes(selectedGenero);
});

// Sistema de cadastro
filmeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('id').value;
    const capa = document.getElementById('capa').value;
    const nome = document.getElementById('nome').value;
    const genero = document.getElementById('genero').value;
    const duracao = document.getElementById('duracao').value;
    const data = document.getElementById('data').value;
    const diretor = document.getElementById('diretor').value;

    fetch('http://localhost:3002/Filmes',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, capa, nome, genero, duracao, data, diretor })
    })
    .then(res => res.json())
    .then(() => {
        listFilmes(generoFilter.value); // Atualiza a lista com base no filtro selecionado
        modal_cadastro.style.display = "none"; // Fechar o modal de cadastro
        filmeForm.reset();
    })
    .catch(error => console.error('Error:', error));
});

// Sistema de atualização
function editFilmes(filmes) {
    document.getElementById('id_edit').value = filmes.id;
    document.getElementById('capa_edit').value = filmes.capa;
    document.getElementById('nome_edit').value = filmes.nome;
    document.getElementById('genero_edit').value = filmes.genero;
    document.getElementById('duracao_edit').value = filmes.duracao;
    document.getElementById('data_edit').value = filmes.data;
    document.getElementById('diretor_edit').value = filmes.diretor;

    // Remover evento antigo se houver
    filmeEdit.removeEventListener('submit', handleEditSubmit);

    // Adicionar novo evento de submit
    filmeEdit.addEventListener('submit', handleEditSubmit);

    function handleEditSubmit(event) {
        event.preventDefault(); // Evita que o formulário seja enviado normalmente

        const id = document.getElementById('id_edit').value;
        const capa = document.getElementById('capa_edit').value;
        const nome = document.getElementById('nome_edit').value;
        const genero = document.getElementById('genero_edit').value;
        const duracao = document.getElementById('duracao_edit').value;
        const data = document.getElementById('data_edit').value;
        const diretor = document.getElementById('diretor_edit').value;

        fetch(`http://localhost:3002/Filmes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ capa, nome, genero, duracao, data, diretor })
        })
        .then(res => res.json())
        .then(() => {
            listFilmes(generoFilter.value); // Atualiza a lista com base no filtro selecionado
            modal_edit.style.display = "none"; // Fechar o modal de edição
        })
        .catch(error => console.error('Error:', error));
    }
}

// Sistema de exclusão
function delete_filme(filmes) {
    fetch(`http://localhost:3002/Filmes/${filmes.id}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(() => {
        listFilmes(generoFilter.value); // Atualiza a lista com base no filtro selecionado
    })
    .catch(error => console.error('Error:', error));
}

// Fechar modais ao clicar no "x"
span_cadastro.onclick = function() {
    modal_cadastro.style.display = "none";
};

span.onclick = function() {
    modal.style.display = "none";
};

span_edit.onclick = function() {
    modal_edit.style.display = "none";
};

// Fechar modais ao clicar fora deles
window.onclick = function(event) {
    if (event.target === modal_cadastro) {
        modal_cadastro.style.display = "none";
    } else if (event.target === modal_edit) {
        modal_edit.style.display = "none";
    } else if (event.target === modal) {
        modal.style.display = "none";
    }
};

function viewFilme(filmes) {
    filmeInfo.innerHTML = `Nome: ${filmes.nome} - Gênero: ${filmes.genero} - Duração: ${filmes.duracao} - Data: ${filmes.data} - Diretor: ${filmes.diretor}`;
    modal.style.display = "block";
    modal.style.flexDirection = "column";
}

// Inicializa a listagem de filmes sem filtro
listFilmes();
