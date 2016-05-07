'use strict';

import * as fs from 'fs';

export class StaticDispatcher {
    static sendIndex(req, res) {
        let _root = process.cwd();

        res.type('.html');

        fs.createReadStream(_root + '/client/dev/index.html')
            .pipe(res);
    }
}