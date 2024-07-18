const { loadData, saveData } = require('./dados');

function calcularCustoProducao(receita) {
  const ingredientes = loadData('ingredientes.json').ingredientes;
  let custoTotal = 0;

  receita.ingredientes.forEach(item => {
    const ingrediente = ingredientes.find(ing => ing.id === item.id);
    if (!ingrediente) {
      console.error(`Ingrediente não encontrado: ID ${item.id}`);
    } else {
      custoTotal += ingrediente.preco_unidade * item.quantidade;
    }
  });

  return custoTotal;
}

module.exports = { calcularCustoProducao };
