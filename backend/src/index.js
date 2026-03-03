import express from 'express';
import cors from 'cors';

import { PORT } from './config/serverConfig.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded( { extended: true }));
app.use(express.text());

app.use(cors());

app.get('/home', (req, res) => {
    return (
        res.send({
            message: "Hi from Aman!!!"
        })
    )
});

app.listen(PORT, () => {
    console.log(`Server Started at Port:${PORT}`);
});
