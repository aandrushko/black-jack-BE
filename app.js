require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const gameRouter = require('./routers/gameRoutes');
const app = express();

const whitelist = [`http://localhost:${process.env.FE_PORT}`, `http://127.0.0.1:${process.env.FE_PORT}/`];

const corsOptions = {
    credentials: true,
    origin: function(origin, callback){
        let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    }
};

app.use(cors(corsOptions));

mongoose.connect(process.env.DB_URI)
    .then (() => {        
        app.listen(process.env.PORT);
        console.log('Database connected')
    })
    .catch(e => console.log(e));

app.use('/game', gameRouter);
