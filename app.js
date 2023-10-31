require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`,
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const gameRouter = require('./routers/gameRoutes');
const app = express();

const whitelist = process.env.NODE_ENV === 'dev' ? [`http://localhost:${process.env.FE_PORT}`, `http://127.0.0.1:${process.env.FE_PORT}/`] : [process.env.FE_URL];

const corsOptions = {
    credentials: true,
    origin: function(origin, callback){
        let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    }
};

app.use(cors());

mongoose.connect(process.env.DB_URI)
    .then (() => {
        if(process.env.PORT.length > 0){
            app.listen(process.env.PORT);
        }
        else {
            app.listen();
        }
        console.log('Database connected');
        console.log(`Listening on ${process.env.PORT.length > 0 ? `port ${process.env.PORT}` : `root "/"`}`);
    })
    .catch(e => console.log(e));

app.use('/game', gameRouter);
