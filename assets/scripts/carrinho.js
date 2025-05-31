

function atualizarContadorCarrinho() {
    const contador = document.getElementById("cart-count");
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    contador.textContent = carrinho.length;
}


function definirPrecoPorGenero(genres) {

    // Exemplo de preços por gênero — você pode ajustar como quiser
    const precosPorGenero = {
        "Action": 150,
        "Adventure": 120,
        "RPG": 200,
        "Strategy": 100,
        "Shooter": 180,
        "Sports": 90,
        "Puzzle": 70,
    };

    // Se o jogo tiver vários gêneros, vamos pegar o preço mais alto entre eles
    let preco = 0;
    genres.forEach(g => {
        const p = precosPorGenero[g.name] || 80; // preço padrão caso gênero não esteja definido
        if (p > preco) preco = p;
    });

    return preco;
}


const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const apiKey = "a5a0a17464414e16a815b7c5ef0670ef";

const container = document.getElementById("container-carrinho");

// Carrega IDs do localStorage
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
atualizarContadorCarrinho();

// Se não for array (caso raro), zera
if (!Array.isArray(carrinho)) {
    carrinho = [];
}

if (carrinho.length === 0) {
    container.innerHTML = "<p class='text-center'>Seu carrinho está vazio.</p>";
} else {
    let totalCarrinho = 0;

    carrinho.forEach(id => {
        fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`)
            .then(res => res.json())
            .then(jogo => {
                const div = document.createElement("div");
                div.className = "item-carrinho";
                div.setAttribute("data-id", jogo.id);

                // Define preço com base no gênero (exemplo simples)
                const genero = jogo.genres?.[0]?.name?.toLowerCase() || "";
                let preco = 100; // preço padrão

                if (genero.includes("action")) preco = 120;
                else if (genero.includes("rpg")) preco = 140;
                else if (genero.includes("indie")) preco = 60;
                else if (genero.includes("strategy")) preco = 80;

                totalCarrinho += preco;

                div.innerHTML = `
        <div class="jogo_imagem">
          <img class="capa" src="${jogo.background_image}">
          <p id="nome" class="mb-0 fw-bold">${jogo.name}</p>
        </div>
        <div class="preco">
          <p>R$: ${preco.toFixed(2)}</p>
          <button class="btn btn-danger btn-sm remover" data-id="${jogo.id}">Remover</button>
        </div>
      `;

                container.appendChild(div);

                // Atualiza total na tela
                document.getElementById("total-carrinho").textContent = `Total: R$ ${totalCarrinho.toFixed(2)}`;
            });
    });

}

// Delegar eventos de clique para remover
container.addEventListener("click", function (e) {
    if (e.target.classList.contains("remover")) {
        const id = e.target.getAttribute("data-id");
        let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

        carrinho = carrinho.filter(jogoId => jogoId != id);
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        window.location.reload();

        // Após atualizar localStorage
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        atualizarContadorCarrinho();


        // Remove a div do DOM
        const divRemover = e.target.closest(".carrinho");
        if (divRemover) divRemover.remove();

        if (carrinho.length === 0) {
            container.innerHTML = "<p class='text-center'>Seu carrinho está vazio.</p>";
        }
    }
});

function voltar() {
    window.location.href = 'index.html';
}

function irParaCheckout() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado) {
        alert('Você precisa estar logado para finalizar a compra!');
        // Opcional: redirecionar para a página de login/cadastro
        window.location.href = 'cadastro.html';
        return;
    }

    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    // Redireciona para a página checkout.html
    window.location.href = 'checkout.html';
}



renderizarCarrinho();

if (usernome) {
        btnLogin.style.display = 'none';
    } else {
        btnLogin.style.display = 'inline-block';  // ou 'block', dependendo do layout
    }