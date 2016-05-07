import * as express from 'express';
import Poll from '../model/poll-model';
import * as _ from 'lodash';

export class PollController {

    static getSinglePoll(req, res) {
        new Promise((resolve, reject) => {
            let _id = req.params.id;
            console.log(Poll['getExcludedFields']());

            Poll
                .findById(_id, Poll['getExcludedFields']())
                .exec((err, poll) => {
                    err ? reject(err)
                        : resolve(poll);
                });
        })
            .then(poll => res.status(200).json(poll))
            .catch(error => res.status(400).json(error));
    }

    static getAll(req, res) {
        new Promise((resolve, reject) => {
            let _query = {};
            let _fields = {
                ipsVoted: 0,
                usersVoted: 0,
                __v: 0
            };

            Poll
                .find(_query, _fields)
                .exec((err, polls) => {
                    err ? reject(err)
                        : resolve(polls);
                });
        })
            .then(polls => res.status(200).json(polls))
            .catch(error => res.status(400).json(error));
    }

    static getPollsFromUserId(req, res) {
        let userId = req.user.id;

        new Promise((resolve, reject) => {
            Poll
                .find({"owner": userId})
                .exec((err, polls) => {
                    err ? reject(err)
                        : resolve(polls)
                });
        })
            .then(polls => res.status(200).json(polls))
            .catch(error => res.status(400).json(error));
    }

    static createPoll(req, res) {
        let poll = req.body;

        new Promise((resolve, reject) => {
            if (!_.isObject(poll)) {
                return reject(new TypeError('Poll is not a valid object.'));
            }

            var _poll = new Poll(poll);

            _poll['owner'] = req.user.id;

            _poll.save((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
            });
        })
            .then(poll => res.status(201).json(poll))
            .catch(error => res.status(400).json(error));
    }

    static deletePoll(req, res) {
        let id = req.params.id;

        new Promise((resolve, reject) => {
            if (!_.isString(id)) {
                return reject(new TypeError('Id is not a valid string.'));
            }

            Poll
                .findById(id)
                .exec((err, doc) => {
                    if(err) {
                        reject(err);
                        return;
                    }
                    else if(doc == null) reject({
                            status: 404,
                            message: 'No Document Found'
                        });
                    else if(doc['owner'] == req.user.id)
                        doc.remove((err) => {
                            err ? reject(err) :
                                resolve();
                        });
                    else reject({
                            status: 403,
                            message: 'Forbidden'
                        });
                });
        })
            .then(() => res.status(200).end())
            .catch(error => res.status(error.status || 400).json(error.message));
    }

    static votePoll(req, res) {
        let pollId = req.body.pollId;
        let vote = req.body.vote;

        new Promise((resolve, reject) => {
            if (!_.isString(vote)) {
                reject(new TypeError('vote is not a valid string.'));
                return;
            }

            Poll
                .findById(pollId)
                .exec((err, poll) => {
                    if(err) {
                        reject(err);
                        return;
                    }
                    else if(poll == null) {
                        reject({
                            status: 404,
                            message: 'No Poll Found'
                        });
                        return;
                    }

                    // If the Vote does not exist
                    if(!(poll['availableVotes'].indexOf(vote) > -1)) {
                        // The user is logged in
                        if(req['isAuthenticated']()) poll['availableVotes'].push(vote);
                        else {
                            reject({
                                status: 404,
                                message: 'Vote is not Available yet. Login to Add it.'
                            });
                            return;
                        }
                    }

                    // If the ip has voted
                    if(poll['ipsVoted'].indexOf(req.ip) > -1) {
                        reject({
                            status: 400,
                            message: 'This IP has already voted.'
                        });
                        return;
                    }

                    // Add User to users that have voted list if he is authenticated
                    if(req['isAuthenticated']()) {
                        // if the user user has already voted
                        if(poll['usersVoted'].indexOf(req.user.id) > -1) {
                            reject({
                                status: 400,
                                message: 'This User has already voted'
                            });
                            return;
                        }

                        poll['usersVoted'].push(req.user.id);
                    }

                    // Add Vote
                    poll['votes'].push(vote);
                    
                    // Add IP to list
                    poll['ipsVoted'].push(req.ip);


                    poll.save(err => {
                        if(err)
                            reject(err);
                        else {
                            for(let key in Poll['getExcludedFields']())
                                poll[key] = undefined;
                            resolve(poll);
                        }

                    });

                });
        })
            .then(poll => res.status(200).json(poll))
            .catch(error => res.status(error.status || 400).json(error.message));
    }
    
}
