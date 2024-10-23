// URL da API DummyJSON para obter os produtos
const apiUrl = 'https://dummyjson.com/products/category/laptops';
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});

async function carregarProdutos(filtroCategoria = '', filtroMarca = '', buscaNome = '') {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      let produtos = data.products;
  
      if (filtroCategoria) {
        produtos = produtos.filter(produto => produto.category === filtroCategoria);
      }
  
      if (filtroMarca) {
        produtos = produtos.filter(produto => produto.brand === filtroMarca);
      }

      if (buscaNome) {
        produtos = produtos.filter(produto =>
          produto.title.toLowerCase().includes(buscaNome.toLowerCase())
        );
      }
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
        <div class="product-info">
          <h3>${produto.title}</h3>
          <p>R$ ${produto.price}</p>
        </div>
        <div class="product-buttons">
          <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
          <a href="produto.html?id=${produto.id}" class="btn-detalhes">Ver Detalhes</a>
        </div>
      `;
  
      listaProdutos.appendChild(produtoDiv);
    });
  }
  
async function carregarCategoriasEMarcas() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const produtos = data.products;
  
      const categorias = [...new Set(produtos.map(produto => produto.category))];
      const marcas = [...new Set(produtos.map(produto => produto.brand))];
  
      const filtroCategoria = document.getElementById('filtro-categoria');
      categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
        filtroCategoria.appendChild(option);
      });
  
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

document.getElementById('btn-grade').addEventListener('click', function() {
    document.getElementById('lista-produtos').classList.add('grid');
    document.getElementById('lista-produtos').classList.remove('list');
  });
  
document.getElementById('btn-lista').addEventListener('click', function() {
    document.getElementById('lista-produtos').classList.add('list');
    document.getElementById('lista-produtos').classList.remove('grid');
});
  
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
  
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
  }
  
function removerDoCarrinho(idProduto) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho = carrinho.filter(produto => produto.id !== idProduto);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  carregarCarrinho();
}

function finalizarCompra() {
    window.location.href = 'checkout.html';
} 
  
function validarCheckout(event) {
  event.preventDefault();
  alert("Compra confirmada com sucesso!");
  localStorage.removeItem('carrinho');
  window.location.href = 'index.html';
}

window.onload = carregarProdutos();
window.onload = carregarCategoriasEMarcas();
