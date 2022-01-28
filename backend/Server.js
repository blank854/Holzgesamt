const Express = require("express");
const expressServer = Express();
const offerRoutes = require("./api/routes/offer");
const userRoutes = require("./api/routes/user");
const uploadRoutes = require("./api/routes/upload");
const chatRoutes = require("./api/routes/chat");
const identifyRoutes = require("./api/routes/identify");
const bodyParser = require("body-parser");
const Mongoose = require("mongoose");
const statisticsRoutes = require("./api/routes/statistics");
const clean = require("./clean")
const CronJob = require('cron').CronJob;
require('dotenv').config()

Mongoose.connect(process.env.MONGODBACCESS).catch(err => { console.log("Error") });

expressServer.use(bodyParser.urlencoded({ extended: true }));
expressServer.use(bodyParser.json());

expressServer.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE')
        return res.status(200).json({});
    }
    next();
});

expressServer.use('/offer', offerRoutes);
expressServer.use('/user', userRoutes);
expressServer.use('/upload', uploadRoutes);
expressServer.use('/identify', identifyRoutes);
expressServer.use('/chat', chatRoutes);
expressServer.use('/statistics', statisticsRoutes);

expressServer.listen(process.env.REST_API_PORT, () => {
    console.log(`Server running on port ${process.env.REST_API_PORT}`);
    // const backgroundJob = new CronJob('0 0  * * *',  clean());
    // backgroundJob.start();
});