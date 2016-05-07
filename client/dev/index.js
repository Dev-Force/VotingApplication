/// <reference path="../../node_modules/angular2/typings/browser.d.ts" />
"use strict";
var browser_1 = require('angular2/platform/browser');
var http_1 = require('angular2/http');
var todo_cmp_1 = require('./todo/components/todo-cmp');
browser_1.bootstrap(todo_cmp_1.TodoCmp, [http_1.HTTP_PROVIDERS]);
