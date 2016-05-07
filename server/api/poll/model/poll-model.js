import mongoose from 'mongoose';

var pollSchema = new mongoose.Schema({
    question: {type: String, required: true, trim: true},
    availableVotes: {type: [String], required: true, trim: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    votes: {type: [String]},
    ipsVoted: {type: [String]},
    usersVoted: {type: [mongoose.Schema.Types.ObjectId], ref:  'User'}
});

pollSchema.static('getExcludedFields', function() {
    return {
        ipsVoted: 0,
        userVoted: 0,
        __v: 0
    };
});

let Poll = mongoose.model('Poll', pollSchema);

export default Poll;
