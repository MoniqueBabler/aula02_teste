const precos = {
  notebook: 3000,
  mouse: 80,
  teclado: 150
};

const estoque = {
  notebook: 5,
  mouse: 20,
  teclado: 10
};

const produto = document.getElementById("produto");
const quantidade = document.getElementById("quantidade");
const cupom = document.getElementById("cupom");
const frete = document.getElementById("frete");
const calcular = document.getElementById("calcular");
const resultado = document.getElementById("resultado");

function calcularDesconto(subtotal, codigo) {
  if (codigo === "SENAI10") {
    return subtotal * 0.10;
  }

  if (codigo === "SENAI20" && subtotal >= 1000) {
    return subtotal * 0.20;
  }

  return 0;
}

function calcularFrete(tipo, subtotal) {
  if (tipo === "retirada") {
    return 0;
  }

  if (tipo === "expresso") {
    return 60;
  }

  if (subtotal >= 500) {
    return 0; 
  }

  return 30;
}

function finalizarPedido() {
  const produtoSelecionado = produto.value;
  const qtd = Number(quantidade.value);
  const codigo = cupom.value.trim().toUpperCase();

  if (qtd < 1) {
    resultado.innerHTML = `
      <p><strong>Quantidade inválida.</strong></p>
      <p>A quantidade deve ser maior que zero.</p>
    `;
    return;
  }

  if (qtd > estoque[produtoSelecionado]) {
    resultado.innerHTML = `
      <p><strong>Quantidade indisponível em estoque.</strong></p>
      <p>Estoque disponível: ${estoque[produtoSelecionado]} unidade(s).</p>
    `;
    return;
  }

  const subtotal = precos[produtoSelecionado] * qtd;
  const descontoCupom = calcularDesconto(subtotal, codigo);
  const valorFrete = calcularFrete(frete.value, subtotal);

  let total = subtotal - descontoCupom + valorFrete;

  let mensagensExtras = "";

  if (codigo === "SENAI10") {
    mensagensExtras += `<p>Cupom SENAI10 aplicado: 10% de desconto (-R$ ${descontoCupom.toFixed(2)}).</p>`;
  } else if (codigo === "SENAI20" && subtotal >= 1000) {
    mensagensExtras += `<p>Cupom SENAI20 aplicado: 20% de desconto (-R$ ${descontoCupom.toFixed(2)}).</p>`;
  } else if (codigo === "SENAI20" && subtotal < 1000) {
    mensagensExtras += `<p>Cupom SENAI20 não aplicado. Valor mínimo R$ 1000,00.</p>`;
  }

  let descontoQuantidade = 0;
  if (qtd > 5) {
    descontoQuantidade = subtotal * 0.05;
    total -= descontoQuantidade;
    mensagensExtras += `<p>Desconto por quantidade aplicado: -R$ ${descontoQuantidade.toFixed(2)} (mais de 5 unidades).</p>`;
  }

  let descontoAltoValor = 0;
  if (total > 3000) {
    descontoAltoValor = total * 0.05;
    total -= descontoAltoValor;
    mensagensExtras += `<p>Desconto de alto valor aplicado: -R$ ${descontoAltoValor.toFixed(2)} (pedido acima de R$ 3000).</p>`;
  }

  if (frete.value === "normal" && subtotal >= 500) {
    mensagensExtras += `<p>Frete normal grátis! Sua compra atingiu R$ 500,00 ou mais. Economia de R$ 30,00.</p>`;
  } else if (frete.value === "normal" && subtotal < 500) {
    mensagensExtras += `<p>Frete normal: R$ 30,00. Faltam R$ ${(500 - subtotal).toFixed(2)} para atingir frete grátis.</p>`;
  }

  let mensagem = "Pedido calculado com sucesso.";
  if (total <= 0) {
    mensagem = "Valor do pedido inválido.";
  } else if (total >= 3000) {
    mensagem = "Pedido de alto valor.";
  }

  resultado.innerHTML = `
    <p>${mensagem}</p>
    <p>Subtotal: R$ ${subtotal.toFixed(2)}</p>
    <p>Desconto cupom: R$ ${descontoCupom.toFixed(2)}</p>
    <p>Frete: R$ ${valorFrete.toFixed(2)}</p>
    <p class="total">Total: R$ ${total.toFixed(2)}</p>
    ${mensagensExtras}
  `;
}

calcular.addEventListener("click", finalizarPedido);