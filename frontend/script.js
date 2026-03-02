// URL base da API do backend
const API_URL = 'http://localhost:3306/itens';

/**
 * Função para buscar itens do backend e renderizar na tabela
 */
async function buscarItens() {
    try {
        const response = await fetch(API_URL);
        const itens = await response.json();

        const tbody = document.getElementById('itensList');
        const emptyMessage = document.getElementById('emptyMessage');
        const table = document.getElementById('itensTable');

        // Limpa a tabela
        tbody.innerHTML = '';

        if (itens.length === 0) {
            emptyMessage.style.display = 'block';
            table.style.display = 'none';
        } else {
            emptyMessage.style.display = 'none';
            table.style.display = 'table';

            // Adiciona cada item à tabela
            itens.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.nome}</td>
                    <td>${item.descricao}</td>
                    <td><span class="categoria-badge">${item.categoria}</span></td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Erro ao buscar itens:', error);
        alert('Erro ao carregar os itens do servidor. Verifique se o backend está rodando.');
    }
}

/**
 * Função para cadastrar um novo item
 * @param {Event} event 
 */
async function cadastrarItem(event) {
    event.preventDefault(); // Previne o recarregamento da página

    // Pega os valores do formulário
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const categoria = document.getElementById('categoria').value;

    const divMensagem = document.getElementById('mensagem');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, descricao, categoria })
        });

        const data = await response.json();

        divMensagem.style.display = 'block';

        if (response.ok) {
            // Sucesso
            divMensagem.className = 'alert-success';
            divMensagem.innerText = data.message || 'Item cadastrado com sucesso!';
            // Limpa o formulário
            document.getElementById('cadastroForm').reset();

            // Opcional: esconde a mensagem após 3 segundos
            setTimeout(() => {
                divMensagem.style.display = 'none';
            }, 3000);
        } else {
            // Erro do backend
            divMensagem.className = 'alert-error';
            divMensagem.innerText = data.error || 'Erro ao cadastrar o item.';
        }

    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        divMensagem.style.display = 'block';
        divMensagem.className = 'alert-error';
        divMensagem.innerText = 'Erro ao conectar com o servidor. Verifique se o backend está rodando.';
    }
}
