async function buscarEndereco() {

    let cep = document.getElementById("cep").value;

    // Remove caracteres que não sejam números
    cep = cep.replace(/\D/g, "");

    // Validação do CEP
    if (cep.length !== 8) {
        document.getElementById("resultadoCep").textContent =
            "Digite um CEP válido com 8 números.";
        return;
    }

    let url = `https://viacep.com.br/ws/${cep}/json/`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const endereco = await response.json();

        // Verifica se o CEP não foi encontrado
        if (endereco.erro) {
            document.getElementById("resultadoCep").textContent =
                "CEP não encontrado.";
            return;
        }

        const resultado = document.getElementById("resultadoCep");

        resultado.innerHTML = "";

        // Criar um bloco/card para o CEP
        let card = document.createElement("div");
        card.className = "card-resultado";

        let logradouro = document.createElement("p");
        logradouro.textContent = `Logradouro: ${endereco.logradouro}`;

        let bairro = document.createElement("p");
        bairro.textContent = `Bairro: ${endereco.bairro}`;

        let cidade = document.createElement("p");
        cidade.textContent = `Cidade: ${endereco.localidade}`;

        let estado = document.createElement("p");
        estado.textContent = `Estado: ${endereco.estado}`;

        card.appendChild(logradouro);
        card.appendChild(bairro);
        card.appendChild(cidade);
        card.appendChild(estado);

        resultado.appendChild(card);

        // Salva no histórico
        salvarHistorico(cep);

        // Atualiza o histórico na tela
        mostrarHistorico();

    } catch (error) {

        console.error(error);

        document.getElementById("resultadoCep").textContent =
            "Erro ao buscar o CEP.";
    }
}

async function buscarCep() {

    let uf = document.getElementById("uf").value;
    let cidade = document.getElementById("cidade").value;
    let logradouro = document.getElementById("logradouro").value;

    // Validação para garantir que todos os campos estajam preenchidos
    if (uf === "" || cidade === "" || logradouro === "") {

        document.getElementById("resultadoEndereco").textContent =
            "Preencha todos os campos.";

        return;
    }

    let url = `https://viacep.com.br/ws/${uf}/${encodeURIComponent(cidade)}/${encodeURIComponent(logradouro)}/json/`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const enderecos = await response.json();

        const resultado = document.getElementById("resultadoEndereco");

        resultado.innerHTML = "";

        // Verifica se nenhum endereço foi encontrado
        if (enderecos.length === 0) {

            resultado.textContent =
                "Nenhum endereço encontrado.";

            return;
        }

        // Percorre todos os resultados
        enderecos.forEach(endereco => {

            let card = document.createElement("div");
            card.className = "card-resultado";

            let cep = document.createElement("p");
            cep.textContent = `CEP: ${endereco.cep}`;

            let logradouroResultado = document.createElement("p");
            logradouroResultado.textContent =
                `Logradouro: ${endereco.logradouro}`;

            let bairro = document.createElement("p");
            bairro.textContent =
                `Bairro: ${endereco.bairro}`;

            let cidadeResultado = document.createElement("p");
            cidadeResultado.textContent =
                `Cidade: ${endereco.localidade}`;

            let estado = document.createElement("p");
            estado.textContent =
                `Estado: ${endereco.estado}`;

            card.appendChild(cep);
            card.appendChild(logradouroResultado);
            card.appendChild(bairro);
            card.appendChild(cidadeResultado);
            card.appendChild(estado);

            resultado.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        document.getElementById("resultadoEndereco").textContent =
            "Erro ao buscar o endereço.";
    }
}

// Histórico
function salvarHistorico(cep) {

    let historico = JSON.parse(
        localStorage.getItem("historicoCEP")
    ) || [];

    // Evita salvar o mesmo CEP várias vezes
    if (!historico.includes(cep)) {

        historico.push(cep);

        localStorage.setItem(
            "historicoCEP",
            JSON.stringify(historico)
        );
    }
}

function mostrarHistorico() {

    const lista = document.getElementById("historico");

    lista.innerHTML = "";

    let historico = JSON.parse(
        localStorage.getItem("historicoCEP")
    ) || [];

    historico.forEach(cep => {

        let item = document.createElement("li");

        let botao = document.createElement("button");

        botao.textContent = cep;

        botao.addEventListener("click", function () {

            document.getElementById("cep").value = cep;

            buscarEndereco();

        });

        item.appendChild(botao);

        lista.appendChild(item);

    });
}

// Toggle Histórico
function toggleHistorico() {
    const historicoContainer = document.getElementById("historicoContainer");
    const toggleBtn = document.getElementById("toggleHistorico");
    
    historicoContainer.classList.toggle("oculto");
    
    if (historicoContainer.classList.contains("oculto")) {
        toggleBtn.textContent = "▶ Histórico de Pesquisas";
    } else {
        toggleBtn.textContent = "▼ Histórico de Pesquisas";
    }
}

// BOTÃO LIMPAR
document.getElementById("limpar").addEventListener("click", function () {

    // Limpa os campos
    document.getElementById("cep").value = "";
    document.getElementById("uf").value = "";
    document.getElementById("cidade").value = "";
    document.getElementById("logradouro").value = "";

    // Limpa os resultados
    document.getElementById("resultadoCep").innerHTML = "";
    document.getElementById("resultadoEndereco").innerHTML = "";

});

// Botão limpar histórico
document.getElementById("limparHistorico").addEventListener("click", function () {

    // Apaga o histórico do localStorage
    localStorage.removeItem("historicoCEP");

    // Apaga o histórico que aparece na tela
    document.getElementById("historico").innerHTML = "";

});

// Botão toggle histórico
document.getElementById("toggleHistorico").addEventListener("click", toggleHistorico);

// BOTÃO BUSCAR CEP POR ENDEREÇO
document
    .getElementById("buscarEndereco")
    .addEventListener("click", buscarCep);

// Carrega o histórico na tela
mostrarHistorico();
