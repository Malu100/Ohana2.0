const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbzwHLXpyEhyMmtufRWCY-KTgFMfhNTCKnMhKaSNr6Qa9--TNfUe47AmUMe-IAWLDYB3/exec";

const form = document.getElementById("formPedido" );
const inputPreco = document.getElementById("inputPreco");

// 1. Função que calcula o total e junta os nomes das peças
function obterDadosDasPecas() {
  const selecionados = form.querySelectorAll('input[name="peca"]:checked');
  
  let total = 0;
  let nomesPecas = [];

  selecionados.forEach(item => {
    total += parseFloat(item.getAttribute("data-preco"));
    nomesPecas.push(item.value);
  });

  // Atualiza o campo visual de preço
  inputPreco.value = total.toFixed(2);
  
  return {
    nomes: nomesPecas.join(", "),
    valorTotal: total.toFixed(2)
  };
}

// 2. Atualiza o preço na tela sempre que o cliente clica em uma foto
form.addEventListener("change", function() {
  obterDadosDasPecas();
});

// 3. Função de envio do formulário
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Pegamos os dados atualizados das peças selecionadas
  const infoPecas = obterDadosDasPecas();
  
  // Validação: Se não escolheu nada, avisa o usuário
  if (infoPecas.nomes === "") {
    alert("Por favor, selecione pelo menos uma peça!");
    return;
  }

  // Montamos o objeto final para enviar à planilha
  const dados = {
    "data_hora": new Date().toLocaleString('pt-BR'),
    nome:      form.nome.value,
    telefone:  form.telefone.value,
    endereco:  form.endereco.value,
    peca:      infoPecas.nomes,      // Aqui vai a lista de peças 
    tamanho:   form.tamanho.value,
    preco:     infoPecas.valorTotal  // Aqui vai o valor somado
  };

  const botao = form.querySelector("button");
  botao.textContent = "Enviando...";
  botao.disabled = true;

  try {
    await fetch(URL_SCRIPT, {
      method: "POST",
      mode: "no-cors", 
      body: JSON.stringify(dados),
      headers: { "Content-Type": "application/json" }
    });

    document.getElementById("mensagem").textContent = "✅ Pedido enviado com sucesso!";
    form.reset();
    inputPreco.value = "0.00"; // Reseta o preço para zero
  } catch (erro) {
    console.error("Erro no envio:", erro);
    document.getElementById("mensagem").textContent = "❌ Erro ao enviar. Tente novamente.";
  } finally {
    botao.textContent = "Enviar Pedido";
    botao.disabled = false;
  }
});
