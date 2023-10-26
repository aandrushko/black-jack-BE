const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const gameRouter = require('./routers/gameRoutes');


const app = express();
const dbURI = 'mongodb+srv://andrii:andrii321@sandboxmdb.7jtpylg.mongodb.net/test-node?retryWrites=true&w=majority';

app.use(cors({credentials: true, origin: 'http://localhost:5173'}));

mongoose.connect(dbURI)
    .then (() => {        
        app.listen(3000);
        console.log('Database connected')
    })
    .catch(e => console.log(e));

app.use('/game', gameRouter);
