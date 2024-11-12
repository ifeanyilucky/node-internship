const express = require("express");
const router = express.Router();
const { Post, Comment, User, Tag, sequelize } = require("../models");
const buildFilter = require("../utils/filterBuilder");
const { literal } = require("sequelize");

router.post("/posts", async (req, res) => {
  try {
    const posts = await Post.create(req.body, { returning: true });
    res.status(201).json(posts.id);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/posts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const include = req.query.include
      ? req.query.include.split(",")
      : undefined;
    const exclude = req.query.exclude
      ? req.query.exclude.split(",")
      : undefined;

    const attributes = include || { exclude };

    const posts = await Post.findAll({
      where: { id },
      attributes,
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/posts/:id", async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const id = req.params.id;
    const updates = req.body;

    const results = await Post.update(updates, {
      where: { id },
      transaction,
    });

    await transaction.commit();
    res.status(200).json(results);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
});

router.delete("/posts/:id", async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const id = req.params.id;
    const results = await Post.destroy({
      where: { id },
      transaction,
    });

    await transaction.commit();
    res.status(200).json(results);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
});

router.get("/posts", async (req, res) => {
  try {
    const whereClause = buildFilter(req.query);

    const include = req.query.include
      ? req.query.include.split(",")
      : undefined;
    const exclude = req.query.exclude
      ? req.query.exclude.split(",")
      : undefined;

    // Updated order handling
    let order = [["id", "ASC"]]; // Default order
    if (req.query.order) {
      order = req.query.order.split(",").map((o) => {
        const parts = o.split(":");
        const field = parts[0];
        const direction = parts.length > 1 ? parts[1].toUpperCase() : "ASC";
        // Validate direction
        if (direction !== "ASC" && direction !== "DESC") {
          throw new Error(`Invalid sort direction: ${direction}`);
        }
        return [field, direction];
      });
    }

    console.log("Order:", JSON.stringify(order, null, 2));

    const limit = req.query.size ? parseInt(req.query.size, 10) : 20; // Default page size
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const offset = (page - 1) * limit;

    const join = req.query.join ? req.query.join.split(",") : [];
    const includeModels = join
      .map((j) => {
        if (j === "comments") {
          return { model: Comment, include: [User] };
        } else if (j === "tags") {
          return { model: Tag };
        }
        return null;
      })
      .filter(Boolean);

    const attributes = include || { exclude };

    console.log("Where clause:", JSON.stringify(whereClause, null, 2));

    const queryOptions = {
      attributes,
      order,
      limit,
      offset,
      include: includeModels,
    };

    if (whereClause !== null) {
      queryOptions.where = whereClause;
    }

    const posts = await Post.findAndCountAll(queryOptions);

    if (posts.count === 0) {
      console.log("No posts found");
    }

    res.json({ records: posts.rows, results: posts.count });
  } catch (error) {
    console.error("Error in GET /posts:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
