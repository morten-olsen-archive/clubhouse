const path = require('path');
const execa = require('execa');
const fs = require('fs-extra');
const basePackage = require('./assets/package.json');
const baseTsConfig = require('./assets/tsconfig.json');
const rootTsConfig = require('../tsconfig.json');

const rootTsConfigLocation = path.join(__dirname, '..', 'tsconfig.json');

const setupProject = async (project) => {
  const packageLocation = path.join(project.location, 'package.json');
  const tsConfigLocation = path.join(project.location, 'tsconfig.json');
  const packageDef = await fs.readJSON(packageLocation);

  Object.entries(basePackage).forEach(([key, value]) => {
    packageDef[key] = value;
  });
  const tsConfig = {
    extends: path.relative(project.location, rootTsConfigLocation),
    ...baseTsConfig,
  };
  await fs.mkdirp(path.join(project.location, 'src'));
  await fs.writeFile(tsConfigLocation, JSON.stringify(tsConfig, null, '  '), 'utf-8');
  await fs.writeFile(packageLocation, JSON.stringify(packageDef, null, '  '), 'utf-8');
};

const run = async () => {
  const { stdout } = await execa('node_modules/.bin/lerna', ['list', '--json']);
  const projects = JSON.parse(stdout);
  await Promise.all(projects.map(setupProject));
  rootTsConfig.references = projects.map((project) => {
    const configLocation = path.join(project.location, 'tsconfig.json');
    const location = path.relative(path.join(__dirname, '..'), configLocation);
    return {
      path: location,
    };
  });
  await fs.writeFile(rootTsConfigLocation, JSON.stringify(rootTsConfig, null, '  '), 'utf-8');
};

run().catch(console.error);
