const { Thought, User } = require('../models')

const thoughtController = {

    getThought(req, res) {
        Thought.find({})
            .populate({ path: 'reactions', select: '-__v' })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err)
                res.status(500).json(err)
            })
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({ path: 'reactions', select: '-__v' })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No thought found with this id' })
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            })
    },

    createThought({ body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                )
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' })
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            })
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' })
                    return
                }
                res.json(dbUserData)
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            })
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(404).json({ message: 'No thought found with this id' })
                }
                return User.findOneAndUpdate(
                    { _id: params.thought.userId },
                    { $pull: { thoughts: params.thoughtId } },
                    { new: true }
                )
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No thought found with this id!' })
                    return
                }
                res.json('Deleted successfully')
            })
            .catch(err => res.json(err))
    },

    createReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No thought found with this id!' })
                    return
                }
                res.json(dbUserData)
            })
            .catch(err => res.json(err))
    },

    removeReaction({ params }, res) {
        Thought.findByIdAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err))
    }
}

module.exports = thoughtController