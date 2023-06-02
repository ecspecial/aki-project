import express from 'express';
import jwt from 'jsonwebtoken';
import userRouter from './src/routes/user.routes.js';
import organisationRouter from './src/routes/organisation.routes.js';
import spaceRouter from './src/routes/space.routes.js';
import { jwtSecret } from './config/jwtConfig.js';
import jwtAuthMiddleware from './src/middlewares/jwtAuthMiddleware.js';
import userController from './src/controllers/user.controller.js';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const port = process.env.PORT || 8080;

const app = express();
app.use(express.json());

app.use(cors());

app.use('/images',express.static('images'));

// Protected routes (require authentication)
app.use('/api', userRouter);
app.use('/api', organisationRouter);
app.use('/api', spaceRouter);

app.get('/', (req, res) => {
    res.send('Welcome to AKI API!');
})

app.listen(port, '0.0.0.0',() => {
    console.log('Listening on Port ' + port);
});