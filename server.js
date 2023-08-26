const express = require('express');
const cors = require('cors');
const db = require('./app/models');

const bootcampRoutes = require('./app/routes/bootcamp.routes.js');
const userRoutes = require('./app/routes/user.routes.js');

const PORT = process.env.PORT || 8080;
const app = express();

// Middlewares
app.disable('x-powered-by');
app.use(express.json());
app.use(cors({ origin: '*' }));

// Routes
app.use('/api', userRoutes);
app.use('/api/bootcamp', bootcampRoutes);

// Database connection and server start
db.sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
      console.log('Base de datos conectada');
    });
  })
  .catch(error => {
    console.error('Error al conectar a la base de datos:', error);
  });
