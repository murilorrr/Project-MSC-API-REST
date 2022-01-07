const express = require('express');
const productRoute = require('./routes/Products');
const salesRoute = require('./routes/Sales');

const app = express();
const port = 3000;

app.use(express.json());
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

// app.get('/', (_req, res) => res.send('Hello World!'));
app.use('/products', productRoute);
app.use('/sales', salesRoute);
