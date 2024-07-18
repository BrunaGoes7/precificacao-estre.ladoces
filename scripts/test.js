const { loadData, saveData } = require('./dados');
const { calcularCustoProducao } = require('./calculos');

// Carregar dados de receitas
const receitas = loadData('receitas.json').receitas;

// Teste de cálculo de custo de produção para a primeira receita
const custoProducao = calcularCustoProducao(receitas[0]);
console.log(`Custo de Produção para ${receitas[0].nome}: ${custoProducao}`);

// Adicione mais testes conforme necessário
