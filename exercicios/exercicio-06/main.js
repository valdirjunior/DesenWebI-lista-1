// URL da API DummyJSON para obter os produtos
const apiUrl = 'https://dummyjson.com/products/category/laptops';
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});

// Carregar os produtos da categoria "laptops" (informática)
async function carregarProdutos(filtroCategoria = '', filtroMarca = '', buscaNome = '') {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      let produtos = data.products;
  
      // Filtro por categoria
      if (filtroCategoria) {
        produtos = produtos.filter(produto => produto.category === filtroCategoria);
      }
  
      // Filtro por marca
      if (filtroMarca) {
        produtos = produtos.filter(produto => produto.brand === filtroMarca);
      }
  
      // Filtro por nome (busca)
      if (buscaNome) {
        produtos = produtos.filter(produto =>
          produto.title.toLowerCase().includes(buscaNome.toLowerCase())
        );
      }
  
      // Exibir os produtos filtrados
      exibirProdutos(produtos);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
}

function exibirProdutos(produtos) {
    const listaProdutos = document.getElementById('lista-produtos');
    listaProdutos.innerHTML = '';
  
    produtos.forEach(produto => {
      const produtoDiv = document.createElement('div');
      produtoDiv.classList.add('produto');
  
      produtoDiv.innerHTML = `
        <img src="${produto.thumbnail}" alt="${produto.title}">
        <h3>${produto.title}</h3>
        <p>R$ ${produto.price}</p>
        <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
        <a href="detalhes.html?id=${produto.id}" class="btn-detalhes">Ver Detalhes</a>
      `;
  
      listaProdutos.appendChild(produtoDiv);
    });
  }
  


async function carregarCategoriasEMarcas() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const produtos = data.products;
  
      // Extraindo categorias e marcas únicas
      const categorias = [...new Set(produtos.map(produto => produto.category))];
      const marcas = [...new Set(produtos.map(produto => produto.brand))];
  
      // Adicionando as categorias ao select
      const filtroCategoria = document.getElementById('filtro-categoria');
      categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
        filtroCategoria.appendChild(option);
      });
  
      // Adicionando as marcas ao select
      const filtroMarca = document.getElementById('filtro-marca');
      marcas.forEach(marca => {
        const option = document.createElement('option');
        option.value = marca;
        option.textContent = marca;
        filtroMarca.appendChild(option);
      });
    } catch (error) {
      console.error('Erro ao carregar categorias e marcas:', error);
    }
}

document.getElementById('filtro-categoria').addEventListener('change', (e) => {
    const categoriaSelecionada = e.target.value;
    const marcaSelecionada = document.getElementById('filtro-marca').value;
    const buscaNome = document.getElementById('busca-nome').value;
    carregarProdutos(categoriaSelecionada, marcaSelecionada, buscaNome);
  });
  
  document.getElementById('filtro-marca').addEventListener('change', (e) => {
    const marcaSelecionada = e.target.value;
    const categoriaSelecionada = document.getElementById('filtro-categoria').value;
    const buscaNome = document.getElementById('busca-nome').value;
    carregarProdutos(categoriaSelecionada, marcaSelecionada, buscaNome);
  });
  
  document.getElementById('busca-nome').addEventListener('input', (e) => {
    const buscaNome = e.target.value;
    const categoriaSelecionada = document.getElementById('filtro-categoria').value;
    const marcaSelecionada = document.getElementById('filtro-marca').value;
    carregarProdutos(categoriaSelecionada, marcaSelecionada, buscaNome);
  });

// Exibir detalhes do produto
async function exibirDetalhesProduto(idProduto) {
  try {
    // Fazer requisição para obter os detalhes do produto
    const resposta = await fetch(`https://dummyjson.com/products/${idProduto}`);
    const produto = await resposta.json();

    const detalhesProduto = document.getElementById('detalhes-produto');
    detalhesProduto.innerHTML = `
      <img src="${produto.thumbnail}" alt="${produto.title}">
      <h3>${produto.title}</h3>
      <p>${produto.description}</p>
      <p>R$ ${produto.price.toFixed(2)}</p>
      <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
    `;
  } catch (error) {
    console.error('Erro ao carregar os detalhes do produto:', error);
  }
}

// Alternar visualização entre Grade e Lista
document.getElementById('btn-grade').addEventListener('click', function() {
    document.getElementById('lista-produtos').classList.add('grid');
    document.getElementById('lista-produtos').classList.remove('list');
  });
  
  document.getElementById('btn-lista').addEventListener('click', function() {
    document.getElementById('lista-produtos').classList.add('list');
    document.getElementById('lista-produtos').classList.remove('grid');
  });
  

// Adicionar Produto ao Carrinho (LocalStorage)
function adicionarAoCarrinho(idProduto) {
  fetch(`https://dummyjson.com/products/${idProduto}`)
    .then(response => response.json())
    .then(produto => {
      let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

      const produtoExistente = carrinho.find(p => p.id === produto.id);
      if (produtoExistente) {
        produtoExistente.quantidade += 1;
      } else {
        produto.quantidade = 1;
        carrinho.push(produto);
      }

      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      alert('Produto adicionado ao carrinho!');
    })
    .catch(error => console.error('Erro ao adicionar produto ao carrinho:', error));
}

// Carregar o carrinho de compras
function carregarCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const listaCarrinho = document.getElementById('lista-carrinho');
  listaCarrinho.innerHTML = '';

  let total = 0;

  if (carrinho.length > 0) {
    carrinho.forEach(produto => {
      const produtoDiv = document.createElement('div');
      produtoDiv.classList.add('produto-carrinho');
      produtoDiv.innerHTML = `
        <h3>${produto.title}</h3>
        <p>Quantidade: ${produto.quantidade}</p>
        <p>Preço: R$ ${(produto.price * produto.quantidade).toFixed(2)}</p>
        <p>Quantidade: 
          <button onclick="alterarQuantidade(${produto.id}, 'diminuir')">-</button>
          ${produto.quantidade}
          <button onclick="alterarQuantidade(${produto.id}, 'aumentar')">+</button>
        </p>
        <button onclick="removerDoCarrinho(${produto.id})">Remover</button>
      `;

      listaCarrinho.appendChild(produtoDiv);
      total += produto.price * produto.quantidade;
    });
  } else {
    listaCarrinho.innerHTML = '<p>Seu carrinho está vazio!</p>';
  }

  document.getElementById('total').innerText = `Total: R$ ${total.toFixed(2)}`;
}

function alterarQuantidade(produtoId, acao) {
    const produto = carrinho.find(produto => produto.id === produtoId);
  
    if (acao === 'aumentar') {
      produto.quantidade += 1;
    } else if (acao === 'diminuir' && produto.quantidade > 1) {
      produto.quantidade -= 1;
    }
  
    // Atualizar localStorage e recarregar o carrinho
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
  }
  
// Remover produto do carrinho
function removerDoCarrinho(idProduto) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho = carrinho.filter(produto => produto.id !== idProduto);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  carregarCarrinho();
}

//Redirecionar para a página de checkout ao clicar em "Finalizar Compra"
function finalizarCompra() {
    window.location.href = 'checkout.html';
} 
  
// Validar Checkout
function validarCheckout(event) {
  event.preventDefault(); // Evitar submissão padrão do formulário
  alert("Compra confirmada com sucesso!");
  localStorage.removeItem('carrinho');
  window.location.href = 'index.html'; // Redireciona para a página inicial
}

// Carregar os produtos ao carregar a página inicial
window.onload = carregarProdutos();
window.onload = carregarCategoriasEMarcas();
