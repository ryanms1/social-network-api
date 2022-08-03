const router = require('express').Router()
const {
    getThought,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    removeReaction
} = require('../../controllers/thoughts-controller')

router
    .route('/')
    .get(getThought)
    .post(createThought)

router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought)

router.route('/:thoughtId/reactions').post(createReaction)
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction)

module.exports = router