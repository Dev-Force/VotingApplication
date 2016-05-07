"use strict";

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';

export default class RoutesConfig {
    static init(application) {
        let _clientFiles = (process.env.NODE_ENV === 'production') ? '/client/dist/' : '/client/dev/';
        let _root = process.cwd();

        application.use(express.static(_root));
        application.use(express.static(_root + _clientFiles));
        application.use(bodyParser.json());
        application.use(bodyParser.urlencoded({
            extended: true
        }));
        application.use(morgan('dev'));
        application.use(helmet());
    }
}


