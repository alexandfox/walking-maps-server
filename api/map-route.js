const express = require("../node_modules/express")
const router = new express.Router();
const mapModel = require("../models/map-model")
const userModel = require("../models/user-model")

//API ENDPOINTS----------------------------------------------------------------------

// POST (create one map): http://localhost:8888/api/map
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
  .then(maps => res.status(200).json({maps}))
  .catch(dbErr => res.status(200).json(dbErr))
})

// GET (fetch one map by id): http://localhost:8888/api/map/1
router.get("/:id", (req, res) => {
  mapModel
    .findById(req.params.id)
    .populate("creator")
    // .populate("user")
    .then(map => {
      res.status(200).json({ map })
    })
    .catch(dbErr => res.status(200).json(dbErr))
})


//DELETE (fetch one map by id & delete): http://localhost:8888/api/map/1
router.delete("/:id", (req, res) => {
  mapModel
    .findByIdAndDelete(req.params.id)
    .then(map => {
      res.status(200).json({ map })
    })
    .catch(dbErr => res.status(200).json(dbErr))
})

//UPDATE (fetch one map by id & update): http://localhost:8888/api/map/1
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
    .then(map => res.status(200).json({ map }))
    .catch(dbErr => res.status(200).json(dbErr))
})

//-----------------------------------------------------------------------------------

module.exports = router;