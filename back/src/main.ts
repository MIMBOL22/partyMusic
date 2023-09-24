import "reflect-metadata"
import 'dotenv/config'
import express from 'express';
import {AppDataSource} from "./data-source.js";
import {xss} from "express-xss-sanitizer"
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.text({type: "text/plain", limit: '512b'}));
app.use(xss());

AppDataSource.initialize()
    .then(() => {
        app.listen(8080, function () {
            console.log('running');
        });
    })
    .catch((error) => console.log(error))


