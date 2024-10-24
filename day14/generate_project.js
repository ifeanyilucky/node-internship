const fs = require("fs");
const path = require("path");
const Model_builder = require("./Model_builder");
const Controller_builder = require("./Controller_builder");

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

const directories = [
  "./release/models",
  "./release/controllers",
  "./release/routes",
];

directories.forEach((dir) => {
  ensureDirectoryExistence(path.resolve(dir));
});

const modelBuilder = new Model_builder();
const controllerBuilder = new Controller_builder();

modelBuilder.build();
controllerBuilder.build();

console.log("Project files generated successfully!");
