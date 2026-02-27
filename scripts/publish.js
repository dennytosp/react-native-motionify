const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// This script lives in `scripts/`, so project root is one level up.
const rootDir = path.resolve(__dirname, "..");
const packageJsonPath = path.join(rootDir, "package.json");

function run(command) {
  console.log(`\n$ ${command}`);
  execSync(command, { stdio: "inherit", cwd: rootDir });
}

function bumpPatchVersion(version) {
  const parts = version.split(".");
  if (parts.length !== 3) {
    throw new Error(`Unsupported version format: ${version}`);
  }
  const [major, minor, patch] = parts;
  const nextPatch = Number(patch) + 1;
  if (Number.isNaN(nextPatch)) {
    throw new Error(`Invalid patch version: ${patch}`);
  }
  return `${major}.${minor}.${nextPatch}`;
}

function main() {
  const pkgRaw = fs.readFileSync(packageJsonPath, "utf8");
  const pkg = JSON.parse(pkgRaw);

  const currentVersion = pkg.version;
  if (!currentVersion) {
    throw new Error("package.json missing version field");
  }

  console.log(`Current version: ${currentVersion}`);

  // 1. Run prepack
  run("npm run prepack");

  // 2. Bump patch version
  const nextVersion = bumpPatchVersion(currentVersion);
  pkg.version = nextVersion;

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(pkg, null, 2) + "\n",
    "utf8"
  );

  console.log(`Version bumped: ${currentVersion} -> ${nextVersion}`);

  // 3. Publish
  run("npm publish");

  console.log("Publish completed.");
}

main();
