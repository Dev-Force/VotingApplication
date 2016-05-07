import TodoRoutes from '../api/todo/routes/todo-routes';
import {StaticDispatcher} from '../helpers/staticDispatcher';
import PollRoutes from "../api/poll/routes/poll-routes";
import {LocalAuthRoutes} from "../auth/routes/local/index";
import {PassportConfig} from '../config/passport.conf';
import {GoogleAuthRoutes} from '../auth/routes/google/index';

var passport = require('passport');


export default class Routes {
    static init(app, router) {
        PassportConfig.init(app, passport);
        GoogleAuthRoutes.init(app, passport);
        LocalAuthRoutes.init(app, passport);

        TodoRoutes.init(router);
        PollRoutes.init(router);

        router
            .route('*')
            .get(StaticDispatcher.sendIndex);

        app.use('/', router);
   }
}

