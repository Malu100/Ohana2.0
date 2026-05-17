const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbzwHLXpyEhyMmtufRWCY-KTgFMfhNTCKnMhKaSNr6Qa9--TNfUe47AmUMe-IAWLDYB3/exec";

const form = document.getElementById("formPedido");
const inputPreco = document.getElementById("inputPreco");

function atualizarDados() {
  const selecionados = form.querySelectorAll('input[name="peca"]:checked');
  let total = 0;
  let lista = [];

  selecionados.forEach(item => {
    total += parseFloat(item.getAttribute("data-preco"));
    const card = item.closest('.card-peca');
    const tam = card.querySelector('.select-tamanho-item').value;
    lista.push(`${item.value} (${tam})`);
  });

  inputPreco.value = total.toFixed(2);
  return { pecas: lista.join(", "), total: total.toFixed(2) };
}

form.addEventListener("change", atualizarDados);

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const info = atualizarDados();

  if (info.pecas === "") {
    alert("Selecione pelo menos uma peça!");
    return;
  }

    // No seu script.js, dentro do form.addEventListener("submit"...)

  const dados = {
    "NOME":      form.nome.value,
    "TELEFONE":  form.telefone.value,
    "ENDEREÇO":  form.endereco.value,
    "PEÇA":      info.pecas,
    "PREÇO":     info.total.replace(".", ",") 
  };


  const botao = form.querySelector("button");
  botao.textContent = "Enviando...";
  botao.disabled = true;

  try {
    await fetch(URL_SCRIPT, {
      method: "POST",
      mode: "no-cors", 
      body: JSON.stringify(dados),
      headers: { "Content-Type": "text/plain" }
    });

    document.getElementById("mensagem").textContent = "✅ Pedido enviado com sucesso!";
    form.reset();
    inputPreco.value = "0.00"; 
  } catch (erro) {
    document.getElementById("mensagem").textContent = "❌ Erro ao enviar.";
  } finally {
    botao.textContent = "Enviar Pedido";
    botao.disabled = false;
  }
});
