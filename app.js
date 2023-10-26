const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const gameRouter = require('./routers/gameRoutes');


const app = express();
const dbURI = 'mongodb+srv://andrii:andrii321@sandboxmdb.7jtpylg.mongodb.net/test-node?retryWrites=true&w=majority';

const whitelist = ['http://localhost:5173', 'http://127.0.0.1:5173/'];

const corsOptions = {
    credentials: true,
    origin: function(origin, callback){
        let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    }
};

app.use(cors(corsOptions));

mongoose.connect(dbURI)
    .then (() => {        
        app.listen(3000);
        console.log('Database connected')
    })
    .catch(e => console.log(e));

app.use('/game', gameRouter);
