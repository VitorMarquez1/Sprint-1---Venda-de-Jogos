

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const apiKey = "a5a0a17464414e16a815b7c5ef0670ef";
const loading = document.getElementById('loading');

fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`)
    .then(response => response.json())
    .then(jogo => {
        const topRating = jogo.top_rating || jogo.ratings?.[0]?.title || "sem avaliação";
        if (jogo && jogo.name) {
            document.getElementById("nome").textContent = jogo.name;
            document.getElementById("playtime").textContent = "Tempo de Jogo: " + jogo.playtime + "hr";
            document.getElementById("requeriments").textContent = "Requisitos: " + (jogo.requeriments || "Não informado");
            document.getElementById("sinopse").textContent = "Gênero: " + (jogo.genres?.map(g => g.name).join(", ") || "Não informado");
            document.getElementById("stores").textContent = "Plataformas: " + (jogo.stores?.map(s => s.store.name).join(", ") || "Não informado");
            document.getElementById("estrelas").textContent = gerarEstrelas(topRating);

            const fallback = jogo.background_image || "imagem-de-erro.jpg";

            fetch(`https://api.rawg.io/api/games/${id}/screenshots?key=${apiKey}`)
                .then(response => response.json())
                .then(screensData => {
                    const screenshots = screensData.results || [];
                    const imagens = [
                        screenshots[0]?.image || fallback,
                        screenshots[1]?.image || fallback,
                        screenshots[2]?.image || fallback
                    ];

                    document.querySelector("#carrossel").src = imagens[0];
                    document.querySelector("#carrossel1").src = imagens[1];
                    document.querySelector("#carrossel2").src = imagens[2];

                    // ✅ Esconde o loading após carregar as screenshots
                    loading.style.display = 'none';
                })
                .catch(err => {
                    console.error("Erro ao carregar screenshots:", err);
                    document.querySelector("#carrossel").src = fallback;

                    // ✅ Mesmo com erro nas screenshots, esconde o loading
                    loading.style.display = 'none';
                });

        } else {
            document.getElementById("nome").textContent = "Jogo não encontrado";
            document.querySelector("#carrossel").src = "imagem-de-erro.jpg";
            loading.style.display = 'none';
        }
    })
    .catch(err => {
        console.error("Erro ao carregar jogo:", err);
        document.getElementById("nome").textContent = "Erro ao buscar jogo";
        document.querySelector("#carrossel").src = "imagem-de-erro.jpg";
        loading.style.display = 'none';
    });


document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");


    fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`)
        .then(res => res.json())
        .then(jogo => {
            const botao = document.getElementById("addToCartBtn");

            if (!botao) return;

            botao.addEventListener("click", () => {
                let carrinho = [];

                try {
                    const armazenado = JSON.parse(localStorage.getItem("carrinho"));
                    if (Array.isArray(armazenado)) {
                        carrinho = armazenado;
                    }
                } catch (e) {
                    console.warn("Erro ao ler carrinho:", e);
                }

                if (!carrinho.includes(jogo.id)) {
                    carrinho.push(jogo.id);
                    localStorage.setItem("carrinho", JSON.stringify(carrinho));
                    alert("Jogo adicionado ao carrinho!");
                } else {
                    alert("Este jogo já está no carrinho.");
                }

                window.location.href = "carrinho.html";
            });
        })
        .catch(err => console.error("Erro ao carregar jogo:", err));
});


function gerarEstrelas(topRating) {
    let estrelas = 0;

    switch (topRating) {
        case "exceptional": estrelas = 5; break;
        case "recommended": estrelas = 4; break;
        case "meh": estrelas = 2; break;
        case "skip": estrelas = 1; break;
        default: estrelas = 0; break;
    }

    return "★".repeat(estrelas) + "☆".repeat(5 - estrelas);

}
function atualizarContadorCarrinho() {
    const contador = document.getElementById("cart-count");
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    contador.textContent = carrinho.length;
}
atualizarContadorCarrinho()


function nome() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    if (usuarioLogado) {
        const divnomeusuario = document.getElementById('divnomeusuario');
        divnomeusuario.innerHTML = `<p>${usuarioLogado.nome}</p>`;
    }
}
nome();

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
