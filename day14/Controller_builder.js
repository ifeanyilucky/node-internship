const fs = require("fs");
const path = require("path");

function Controller_builder() {
  let config;

  try {
    config = JSON.parse(fs.readFileSync("configuration.json", "utf8"));
  } catch (error) {
    console.error("Error reading configuration.json:", error);
    return;
  }

  this.build = function () {
    const releaseFolder = path.join(__dirname, "release");
    const controllersFolder = path.join(releaseFolder, "controllers");

    if (!fs.existsSync(controllersFolder)) {
      fs.mkdirSync(controllersFolder, { recursive: true });
    }

    config.model.forEach((model) => {
      const controllerContent = generateControllerContent(model);
      const controllerFileName = `${model.name}Controller.js`;
      fs.writeFileSync(
        path.join(controllersFolder, controllerFileName),
        controllerContent
      );

      updateRoutesFile(`${model.name}Controller`);
    });
  };

  function generateControllerContent(model) {
    const modelName = capitalize(model.name);
    return `
const ${modelName} = require('../models/${model.name}');

exports.getAll = async (req, res) => {
  try {
    const ${model.name}s = await ${modelName}.findAll();
    res.json(${model.name}s);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const ${model.name} = await ${modelName}.findByPk(req.params.id);
    if (${model.name}) {
      res.json(${model.name});
    } else {
      res.status(404).json({ message: '${modelName} not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const new${modelName} = await ${modelName}.create(req.body);
    res.status(201).json(new${modelName});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await ${modelName}.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated[0] === 1) {
      res.json({ message: '${modelName} updated successfully' });
    } else {
      res.status(404).json({ message: '${modelName} not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await ${modelName}.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.json({ message: '${modelName} deleted successfully' });
    } else {
      res.status(404).json({ message: '${modelName} not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
`;
  }

  function updateRoutesFile(controllerName) {
    const routesDir = path.join(__dirname, "release", "routes");
    const routesFile = path.join(routesDir, "index.js");

    if (!fs.existsSync(routesDir)) {
      fs.mkdirSync(routesDir, { recursive: true });
    }

    if (!fs.existsSync(routesFile)) {
      fs.writeFileSync(
        routesFile,
        "// Routes index file\n\nconst express = require('express');\nconst app = express();\n\n"
      );
    }

    let content = fs.readFileSync(routesFile, "utf8");

    const newRoute = `const ${controllerName}Routes = require('./${controllerName}Routes');\napp.use('/${controllerName
      .replace("Controller", "")
      .toLowerCase()}', ${controllerName}Routes);\n`;

    if (!content.includes(newRoute)) {
      content += newRoute;
      fs.writeFileSync(routesFile, content);
    }
  }

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return this;
}

module.exports = Controller_builder;
