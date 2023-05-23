import express from "express";
import bodyParser from "body-parser";
import userRouter from "./src/routes/user.routes.js";

const port = process.env.PORT || 8080;

const app = express();
app.use(express.json());

app.use('/api', userRouter);

app.get('/', (req, res) => {
    res.send('Welcome to AKI API!')
})

app.listen(port, '0.0.0.0',() => {
    console.log('Listening on Port ' + port);
});