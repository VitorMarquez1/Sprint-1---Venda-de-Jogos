document.getElementById('formCadastro').addEventListener('submit', function(e) {
      e.preventDefault();

      const nome = document.getElementById('nome').value.trim();
      const email = document.getElementById('email').value.trim();
      const senha = document.getElementById('senha').value;

      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

      // Verifica se o e-mail já está cadastrado
      const usuarioExistente = usuarios.find(user => user.email === email);
      const senhaincorreta = usuarios.find(user => user.senha != senha);
      const mensagem = document.getElementById('mensagem');
      

      if (usuarioExistente) {
        mensagem.innerHTML = '<div class="alert alert-danger">E-mail já cadastrado.</div>';
        window.location.href = 'login.html';
        return;
      }


      const novoUsuario = { nome, email, senha };
      usuarios.push(novoUsuario);

      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      mensagem.innerHTML = '<div class="alert alert-success">Usuário cadastrado com sucesso!</div>';
      document.getElementById('formCadastro').reset();
      window.location.href= 'login.html'
    });