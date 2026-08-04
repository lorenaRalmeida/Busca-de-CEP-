// URL da API
const url = 'https://viacep.com.br/ws/$/json/';

// Função para buscar e exibir os posts
async function fetchPosts() {
    const container = document.getElementById('posts-container');

    try {
        // 1. Faz a requisição à API
        const response = await fetch(url);
        
        // 2. Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        // 3. Converte os dados para formato JSON
        const posts = await response.json();

        // 4. Limpa o container e renderiza os posts
        container.innerHTML = ''; // Remove o "Carregando..."

        // Vamos exibir apenas os 10 primeiros posts para o exemplo
        posts.slice(0, 10).forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');

            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
            `;

            container.appendChild(postElement);
        });

    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        container.innerHTML = '<p style="color: red;">Erro ao carregar os posts.</p>';
    }
}

// Chama a função ao carregar a página
fetchPosts();