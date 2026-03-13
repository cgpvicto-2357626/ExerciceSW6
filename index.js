import express from 'express';
import dotenv from 'dotenv';
import pokemonsRoutes from './routes/pokemons.route.js';
//import utilisateurRoutes from './routes/utilisateur.route.js';        
//import authentification from './middlewares/authentification.middleware.js'; 
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


dotenv.config();
const app = express();  
const PORT = 3000;
app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pokemon API',
            version: '1.0.0',
            description: 'API de gestion de Pokemons avec Express.js et MySQL',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Serveur local',
            },
        ],
    },
    apis: ['./routes/*.js'],
};


const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
//app.use('/api/users', utilisateurRoutes);                     
app.use('/api/pokemons', pokemonsRoutes); 

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});