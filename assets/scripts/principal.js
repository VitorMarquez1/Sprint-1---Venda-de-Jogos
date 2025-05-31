
 function verificarLogin() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const btnLogin = document.getElementById('btnLogin');

    if (usuarioLogado) {
        btnLogin.style.display = 'none';
    } else {
        btnLogin.style.display = 'inline-block';  // ou 'block', dependendo do layout
    }
}

verificarLogin();


function nome() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    if (usuarioLogado) {
        const divnomeusuario = document.getElementById('divnomeusuario');
        divnomeusuario.innerHTML = `<p>${usuarioLogado.nome}</p>`;
    }
}


function atualizarContadorCarrinho() {
    const contador = document.getElementById("cart-count");
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    contador.textContent = carrinho.length;
}

let jogos = [];
let paginaAtual = 1;
const pageSize = 12;
const totalPaginasAPI = 3;

const jogosContainer = document.getElementById('jogos');
const results = document.getElementById('results');
const genreSelect = document.getElementById('genreSelect');
const platformSelect = document.getElementById('platformSelect');
const searchInput = document.getElementById('searchInput');
const btnAnterior = document.getElementById('anterior');
const btnProximo = document.getElementById('proximo');

function exibirJogos() {
    jogosContainer.innerHTML = '';
    results.innerHTML = '';

    const inicio = (paginaAtual - 1) * pageSize;
    const fim = inicio + pageSize;
    const lista = jogos.slice(inicio, fim);

    lista.forEach(jogo => {
        const col = document.createElement('div');
        col.className = 'col-md-3';

        const card = document.createElement('div');
        card.className = 'card h-100';

        const img = document.createElement('img');
        img.src = jogo.background_image;
        img.alt = jogo.name;
        img.className = 'card-img-top';

        const body = document.createElement('div');
        body.className = 'card-body';

        const titulo = document.createElement('h5');
        titulo.className = 'card-title';
        titulo.textContent = jogo.name;

        const link = document.createElement('a');
        link.href = `pagedetails.html?id=${jogo.id}`;
        link.className = 'btn btn-primary mt-2';
        link.textContent = 'Ver detalhes';

        body.appendChild(titulo);
        body.appendChild(link);
        card.appendChild(img);
        card.appendChild(body);
        col.appendChild(card);
        jogosContainer.appendChild(col);
    });
}

// Carrega todos os jogos das páginas da API
function carregarJogos() {
    let pagina = 1;

    function fetchPagina() {
        const url = `https://api.rawg.io/api/games?key=a5a0a17464414e16a815b7c5ef0670ef&page=${pagina}&page_size=40`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log('Página carregada:', pagina); // Para monitorar

                jogos = jogos.concat(data.results);
                pagina++;

                if (pagina <= totalPaginasAPI) {
                    fetchPagina();
                } else {
                    exibirJogos();
                    popularFiltros(jogos);  // ✅ Corrigido: agora popula os filtros
                    document.getElementById('loading').style.display = 'none';
                }
            })
            .catch(err => {
                console.error("Erro ao carregar jogos:", err);
                document.getElementById('loading').style.display = 'none';
            });
    }

    fetchPagina();
}

function popularFiltros(lista) {
    const generos = new Set();
    const plataformas = new Set();

    lista.forEach(jogo => {
        jogo.genres?.forEach(g => generos.add(g.name));
        jogo.platforms?.forEach(p => plataformas.add(p.platform.name));
    });

    generos.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = g;
        genreSelect.appendChild(opt);
    });

    plataformas.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = p;
        platformSelect.appendChild(opt);
    });
}

function inicializarPesquisa() {
    function filtrar() {
        const texto = searchInput.value.toLowerCase();
        const genero = genreSelect.value;
        const plataforma = platformSelect.value;

        const encontrados = jogos.filter(jogo => {
            const nomeMatch = jogo.name?.toLowerCase().includes(texto);
            const generoMatch = !genero || jogo.genres?.some(g => g.name === genero);
            const plataformaMatch = !plataforma || jogo.platforms?.some(p => p.platform.name === plataforma);
            return nomeMatch && generoMatch && plataformaMatch;
        });

        jogosContainer.style.display = encontrados.length > 0 || texto || genero || plataforma ? 'none' : 'flex';
        results.innerHTML = '';

        if (encontrados.length > 0) {
            encontrados.forEach(jogo => {
                const col = document.createElement('div');
                col.className = 'col-md-3';

                const card = document.createElement('div');
                card.className = 'card h-100';

                const img = document.createElement('img');
                img.src = jogo.background_image;
                img.alt = jogo.name;
                img.className = 'card-img-top';

                const body = document.createElement('div');
                body.className = 'card-body';

                const titulo = document.createElement('h5');
                titulo.className = 'card-title';
                titulo.textContent = jogo.name;

                const link = document.createElement('a');
                link.href = `pagedetails.html?id=${jogo.id}`;
                link.className = 'btn btn-secondary mt-2';
                link.textContent = 'Ver detalhes';

                body.appendChild(titulo);
                body.appendChild(link);
                card.appendChild(img);
                card.appendChild(body);
                col.appendChild(card);
                results.appendChild(col);
            });
        } else {
            results.innerHTML = '<p class="text-center">Nenhum jogo encontrado.</p>';
        }
    }

    searchInput.addEventListener('input', filtrar);
    genreSelect.addEventListener('change', filtrar);
    platformSelect.addEventListener('change', filtrar);
}

// Botões de navegação
btnAnterior.addEventListener('click', () => {
    if (paginaAtual > 1) {
        paginaAtual--;
        exibirJogos();
    }
});

btnProximo.addEventListener('click', () => {
    if (paginaAtual < Math.ceil(jogos.length / pageSize)) {
        paginaAtual++;
        exibirJogos();
    }
});

// Inicialização
carregarJogos();
inicializarPesquisa();  // ✅ Não esquece de chamar
nome();
