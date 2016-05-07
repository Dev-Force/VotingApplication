'use strict';

import localAuth from '../auth/strategies/local/local';
import googleAuth from '../auth/strategies/google/google';
import User from '../auth/models/user.model';

var session = require('express-session');
var flash    = require('connect-flash');


export class PassportConfig {
    static init(application, passport) {

        // Passport
        application.use(session({
            secret: 'saltysaltyhere',
            resave: true,
            saveUninitialized: true
        }));

        application.use(passport.initialize());

        application.use(passport.session()); // persistent login sessions

        application.use(flash());

        // used to serialize the user for the session
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        // used to deserialize the user
        passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
                done(err, user);
            });
        });

        localAuth(passport);
        googleAuth(passport);

    }
}