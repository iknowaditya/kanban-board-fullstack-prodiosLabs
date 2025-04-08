const express = require("express");
const router = express.Router();
const {
  createList,
  getLists,
  deleteList,
} = require("../controllers/listController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createList);
router.get("/", authMiddleware, getLists);
router.delete("/:listId", authMiddleware, deleteList);

module.exports = router;
