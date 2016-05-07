import express = require('express');
import mongoose = require('mongoose');
import * as _ from 'lodash';

var defaultOpts:{
    'getAll': any,
    'post': any,
    'get': any,
    'put': any,
    'delete': any
} = {
    'getAll': true,
    'post': true,
    'get': true,
    'put': true,
    'delete': true,
};

export default function(router, model, opts, middleware) {
    if(middleware != null && _.isFunction(middleware)) {
        router.use(middleware);
    }

    for(var key in defaultOpts) {
        if(key in opts) {

            defaultOpts[key] = opts[key];
        }
    }

    if('getAll' in defaultOpts) {
        if(_.isFunction(defaultOpts.getAll)) {
            router
                .get('/', defaultOpts.getAll);
        } else {
            router
                .get('/', function (req, res, next) {
                    // Get all documents
                    model.find(function (err, doc) {
                        if (err) next(err);
                        res.json(doc);
                    });
                })
        }
    }

    if('post' in defaultOpts) {
        if(_.isFunction(defaultOpts.post)) {
            router
                .post('/', defaultOpts.post);
        } else {
            router
                .post('/', function (req, res, next) {
                    // Insert document
                    var o = {};

                    for (var key in model.schema.paths) {
                        if (!(key === '_id' || key === '__v')) {
                            o[key] = req.body[key];
                        }
                    }

                    var doc = new model(o);
                    doc.save(function (err, d) {
                        if (err) next(err);
                        res.json(d);
                    });
                })
        }
    }

    if('get' in defaultOpts) {
        if(_.isFunction(defaultOpts.get)) {
            router
                .get('/:id', defaultOpts.get);
        } else {
            router
                .get('/:id', function (req, res, next) {
                    // Get Specific document
                    model.findById(req.params.id, function (err, doc) {
                        if (err) next(err);
                        res.json(doc);
                    });
                });
        }
    }

    if('put' in defaultOpts) {
        if(_.isFunction(defaultOpts.put)) {
            router
                .put('/:id', defaultOpts.put);
        } else {
            router
                .put('/:id', function (req, res, next) {
                    // Specific Document update
                    model.findById(req.params.id, function (err, doc) {
                        if (err) next(err);

                        for (var key in model.schema.paths) {
                            if (!(key === '_id' || key === '__v')) {
                                doc[key] = req.body[key];
                            }
                        }

                        doc.save(function (err, d) {
                            if (err) next(err);
                            res.json(d);
                        });
                    });
                });
        }
    }

    if('delete' in defaultOpts) {
        if(_.isFunction(defaultOpts.delete)) {
            router
                .delete('/:id', defaultOpts.delete);
        } else {
            router
                .delete('/:id', function (req, res, next) {
                    // Specific Document delete
                    model.findByIdAndRemove(req.params.id, function (err, doc) {
                        if (err) next(err);
                        res.json(doc);
                    });
                });
        }
    }

    model = mongoose.model(model);

    return router;
};

