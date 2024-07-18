document.addEventListener('DOMContentLoaded', function() {
    console.log('Documento carregado, inicializando...');
    loadIngredientes();
    loadRegistros();
    document.getElementById('ingredienteForm').addEventListener('submit', function(event) {
        event.preventDefault();
        adicionarIngrediente();
    });

    // Abre a aba "Início" por padrão
    document.getElementById('Inicio').style.display = 'block';
    document.querySelector('.tablink').classList.add('active');
});

let ingredientes = [];
let receitaIngredientes = [];
let registros = [];

function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function loadIngredientes() {
    const data = JSON.parse(localStorage.getItem('ingredientes')) || [];
    console.log('Ingredientes carregados do localStorage:', data);
    ingredientes = data;
    renderIngredientes();
}

function loadRegistros() {
    const data = JSON.parse(localStorage.getItem('registros')) || [];
    console.log('Registros carregados do localStorage:', data);
    registros = data;
    renderRegistros();
}

function renderIngredientes() {
    const ingredientesDiv = document.getElementById('ingredientesDados');
    ingredientesDiv.innerHTML = '';
    ingredientes.forEach((item, index) => {
        ingredientesDiv.innerHTML += `<p>${item.nome} - ${item.quantidade}g - R$${item.preco.toFixed(2)} <button onclick="excluirIngrediente(${index})">Excluir</button></p>`;
    });
}

function renderRegistros() {
    const registrosDiv = document.getElementById('registrosDados');
    registrosDiv.innerHTML = '';
    registros.forEach((item, index) => {
        registrosDiv.innerHTML += `
        <tr>
            <td>${item.nome}</td>
            <td>${item.data}</td>
            <td>R$${item.valor}</td>
            <td><button onclick="excluirRegistro(${index})">Excluir</button></td>
        </tr>`;
    });
}

function adicionarIngrediente() {
    const nome = document.getElementById('ingredienteNome').value;
    const quantidade = parseFloat(document.getElementById('ingredienteQuantidade').value);
    const preco = parseFloat(document.getElementById('ingredientePreco').value);

    if (!nome || isNaN(quantidade) || isNaN(preco)) {
        console.error('Dados inválidos para adicionar ingrediente');
        return;
    }

    const novoIngrediente = { nome, quantidade, preco };
    const ingredienteExistenteIndex = ingredientes.findIndex(item => item.nome === nome);

    if (ingredienteExistenteIndex !== -1) {
        ingredientes[ingredienteExistenteIndex] = novoIngrediente;
        console.log('Ingrediente atualizado:', novoIngrediente);
    } else {
        ingredientes.push(novoIngrediente);
        console.log('Ingrediente adicionado:', novoIngrediente);
    }

    localStorage.setItem('ingredientes', JSON.stringify(ingredientes));
    console.log('Ingredientes salvos no localStorage:', JSON.stringify(ingredientes));
    renderIngredientes();

    document.getElementById('ingredienteForm').reset();
}

function excluirIngrediente(index) {
    ingredientes.splice(index, 1);
    localStorage.setItem('ingredientes', JSON.stringify(ingredientes));
    console.log('Ingredientes após exclusão:', ingredientes);
    renderIngredientes();
}

function adicionarIngredienteReceita() {
    const nomeIngrediente = document.getElementById('receitaIngrediente').value;
    const quantidadeUsada = parseFloat(document.getElementById('ingredienteQuantidadeUsada').value);

    const ingrediente = ingredientes.find(item => item.nome === nomeIngrediente);

    if (ingrediente && !isNaN(quantidadeUsada)) {
        const custoProporcional = (ingrediente.preco / ingrediente.quantidade) * quantidadeUsada;
        const novoIngredienteReceita = {
            nome: ingrediente.nome,
            quantidadeUsada,
            custoProporcional,
            quantidadeEmbalagem: ingrediente.quantidade,
            preco: ingrediente.preco
        };
        receitaIngredientes.push(novoIngredienteReceita);
        console.log('Ingrediente adicionado à receita:', novoIngredienteReceita);
        renderReceitaIngredientes();
        calcularCustos();
    } else {
        console.error('Ingrediente não encontrado ou quantidade inválida');
    }
}

function renderReceitaIngredientes() {
    const receitaIngredientesDiv = document.getElementById('receitaIngredientesDados');
    receitaIngredientesDiv.innerHTML = '';
    receitaIngredientes.forEach((item, index) => {
        receitaIngredientesDiv.innerHTML += `
        <tr>
            <td>${item.nome}</td>
            <td>R$${item.preco.toFixed(2)}</td>
            <td>${item.quantidadeEmbalagem}g</td>
            <td class="blue-cell"><input type="number" value="${item.quantidadeUsada}" oninput="atualizarIngredienteReceita(${index}, this.value)"></td>
            <td>R$${item.custoProporcional.toFixed(2)}</td>
            <td><button onclick="excluirIngredienteReceita(${index})">Excluir</button></td>
        </tr>`;
    });
}

function atualizarIngredienteReceita(index, quantidadeUsada) {
    const ingrediente = receitaIngredientes[index];
    ingrediente.quantidadeUsada = parseFloat(quantidadeUsada);
    ingrediente.custoProporcional = (ingrediente.preco / ingrediente.quantidadeEmbalagem) * ingrediente.quantidadeUsada;
    renderReceitaIngredientes();
    calcularCustos();
}

function excluirIngredienteReceita(index) {
    receitaIngredientes.splice(index, 1);
    console.log('Ingredientes da receita após exclusão:', receitaIngredientes);
    renderReceitaIngredientes();
    calcularCustos();
}

function calcularCustos() {
    const totalCustoIngredientes = receitaIngredientes.reduce((acc, item) => acc + item.custoProporcional, 0);
    const custosIncalculaveis = totalCustoIngredientes * 0.25;
    const lucroMaoDeObra = (totalCustoIngredientes + custosIncalculaveis) * 3;

    document.getElementById('totalCustoIngredientes').textContent = `R$ ${totalCustoIngredientes.toFixed(2)}`;
    document.getElementById('custosIncalculaveis').textContent = `R$ ${custosIncalculaveis.toFixed(2)}`;
    document.getElementById('lucroMaoDeObra').textContent = `R$ ${lucroMaoDeObra.toFixed(2)}`;

    calcularPrecoFinal();
}

function calcularPrecoFinal() {
    const lucroMaoDeObra = parseFloat(document.getElementById('lucroMaoDeObra').textContent.replace('R$ ', ''));
    const rendimentoUnidades = parseFloat(document.getElementById('rendimentoUnidades').value);
    const precoEmbalagemIndividual = parseFloat(document.getElementById('precoEmbalagemIndividual').value);

    const precoFinalVenda = (lucroMaoDeObra + precoEmbalagemIndividual * rendimentoUnidades) / rendimentoUnidades;

    document.getElementById('precoFinalVenda').textContent = `R$ ${precoFinalVenda.toFixed(2)}`;
}

function salvarReceita() {
    const nomeReceita = document.getElementById('nomeReceita').value;
    const dataReceita = document.getElementById('dataReceita').value;
    const precoFinalVenda = document.getElementById('precoFinalVenda').textContent;

    if (!nomeReceita || !dataReceita || precoFinalVenda === 'R$ 0.00') {
        console.error('Dados inválidos para salvar receita');
        return;
    }

    const novaReceita = {
        nome: nomeReceita,
        data: dataReceita,
        valor: precoFinalVenda
    };

    registros.push(novaReceita);
    localStorage.setItem('registros', JSON.stringify(registros));
    console.log('Receita salva:', novaReceita);
    renderRegistros();

    document.getElementById('receitaForm').reset();
    receitaIngredientes = [];
    renderReceitaIngredientes();
    calcularCustos();
}

function excluirRegistro(index) {
    registros.splice(index, 1);
    localStorage.setItem('registros', JSON.stringify(registros));
    console.log('Registros após exclusão:', registros);
    renderRegistros();
}
