const fs = require("fs");
const path = require("path");

class Model_builder {
  constructor() {
    this.config = require("./configuration.json");
  }

  build() {
    const releaseFolder = path.join(__dirname, "release");
    if (!fs.existsSync(releaseFolder)) {
      fs.mkdirSync(releaseFolder);
    }

    const modelsFolder = path.join(releaseFolder, "models");
    if (!fs.existsSync(modelsFolder)) {
      fs.mkdirSync(modelsFolder);
    }

    this.copyFolder(path.join(__dirname, "initialize"), releaseFolder);

    this.config.model.forEach((model) => {
      const modelContent = this.generateModelContent(model);
      const filePath = path.join(modelsFolder, `${model.name}.js`);
      fs.writeFileSync(filePath, modelContent);
    });
  }

  generateModelContent(model) {
    const fields = model.field
      .map((field) => {
        const [name, type, label, validation] = field;
        return `
    ${name}: {
      type: ${this.getSequelizeType(type)},
      allowNull: ${validation !== "required"},
      field: '${name}',
      ${label ? `comment: '${label}'` : ""}
    }`;
      })
      .join(",");

    return `
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ${this.capitalize(model.name)} = sequelize.define('${model.name}', {
  ${fields}
}, {
  tableName: '${model.name}s',
  timestamps: true,
});

module.exports = ${this.capitalize(model.name)};
`;
  }

  getSequelizeType(type) {
    switch (type.toLowerCase()) {
      case "integer":
        return "DataTypes.INTEGER";
      case "string":
        return "DataTypes.STRING";
      default:
        return "DataTypes.STRING";
    }
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  copyFolder(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    const files = fs.readdirSync(src);
    files.forEach((file) => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      if (fs.lstatSync(srcPath).isDirectory()) {
        this.copyFolder(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  }
}

module.exports = Model_builder;
