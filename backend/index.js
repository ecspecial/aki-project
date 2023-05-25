import express from "express";
import userRouter from "./src/routes/user.routes.js";
import organisationRouter from "./src/routes/organisation.routes.js";
import spaceRouter from "./src/routes/space.routes.js";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 8080;

const app = express();
app.use(express.json());

app.use('/images',express.static('images'));

app.use('/api', userRouter);
app.use('/api', organisationRouter);
app.use('/api', spaceRouter);

app.get('/', (req, res) => {
    res.send('Welcome to AKI API!');
})

app.listen(port, '0.0.0.0',() => {
    console.log('Listening on Port ' + port);
});