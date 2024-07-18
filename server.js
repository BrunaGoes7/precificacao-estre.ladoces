const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Servindo arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Endpoint para servir dados JSON estáticos
app.get('/data/:file', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', `${req.params.file}`));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
