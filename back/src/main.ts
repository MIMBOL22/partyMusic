import "reflect-metadata"
import 'dotenv/config'
import express from 'express';
import {AppDataSource} from "./data-source.js";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.text({type:"text/plain", limit: '2mb'}));

AppDataSource.initialize()
    .then(() => {
        app.listen(8080, function() {
            console.log('running');
        });
    })
    .catch((error) => console.log(error))


