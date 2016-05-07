'use strict';

import {PollController} from '../controller/poll-controller';
import {isLoggedIn, isNotLoggedIn} from '../../../helpers/auth/authCheck';


export default class PollRoutes {
    static init(router) {
        // Get all Polls or create a Poll
        router
            .route('/api/polls')
            .get(PollController.getAll)
            .post(isLoggedIn, PollController.createPoll);

        // User Polls
        router
            .route('/api/polls/user')
            .get(isLoggedIn, PollController.getPollsFromUserId);

        // Route for Single Polls or Deleting Polls
        router
            .route('/api/polls/:id')
            .get(PollController.getSinglePoll)
            .delete(isLoggedIn, PollController.deletePoll);

        // Poll Voting
        router
            .route('/api/vote')
            .post(PollController.votePoll);
    }
}