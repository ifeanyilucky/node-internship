const router = require("express").Router();
const { Post } = require("../models");

router.post("/records/posts", async (req, res) => {
  try {
    const post = await Post.create({ ...req.body, created: new Date() });
    res.status(201).json(post.id);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/records/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/records/posts/:id", async (req, res) => {
  try {
    const [updated] = await Post.update(req.body, {
      where: { id: req.params.id },
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/records/posts/:id", async (req, res) => {
  try {
    const deleted = await Post.destroy({
      where: { id: req.params.id },
    });
    res.json(deleted);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/records/posts", async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json({ records: posts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
