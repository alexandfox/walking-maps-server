const express = require("../node_modules/express")
const router = new express.Router();
const ideaModel = require("../models/map-model")

//API ENDPOINTS----------------------------------------------------------------------

// POST (create one idea): http://localhost:8888/api/idea
router.post("/", (req, res) => {
  mapModel
    .create(req.body)
    .then(dbSuccess => {
      res.status(200).json({ txt: "successfully created map", dbSuccess });
    })
    .catch(dbError => {
      res.status(500).json({ txt: "invalid server response", dbError });
    })
})

// GET route for filter/ sort
router.get("/", (req,res) => {
  mapModel
  .find()
  .populate("creator")
  .then(ideas => res.status(200).json({ideas}))
  .catch(dbErr => res.status(200).json(dbErr))
})

// GET (fetch one idea by id): http://localhost:8888/api/idea/1
router.get("/:id", (req, res) => {
  mapModel
    .findById(req.params.id)
    .populate("creator")
    .populate({
      path: 'comments',
      populate: {
        path: 'creator',
        model: 'User'
      }
    })
    .then(idea => {
      res.status(200).json({ idea })
    })
    .catch(dbErr => res.status(200).json(dbErr))
})


//DELETE (fetch one idea by id & delete): http://localhost:8888/api/idea/1
router.delete("/:id", (req, res) => {
  mapModel
    .findByIdAndDelete(req.params.id)
    .then(idea => {
      res.status(200).json({ idea })
    })
    .catch(dbErr => res.status(200).json(dbErr))
})

//UPDATE (fetch one idea by id & update): http://localhost:8888/api/idea/1
router.put("/:id", (req, res) => {
  mapModel
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate("comments")
    .populate({
      path: 'comments',
      populate: {
        path: 'creator',
        model: 'User'
      }
    })
    .then(idea => res.status(200).json({ idea }))
    .catch(dbErr => res.status(200).json(dbErr))
})

//-----------------------------------------------------------------------------------

module.exports = router;