import { execSync } from "child_process";
import glob from "fast-glob";
import { readFileSync, writeFileSync } from "fs";
import { argv } from "process";
import * as semver from "semver";

function publish() {
	const releaseTag = semver.parse(argv[2]);
	if (!releaseTag) {
		console.error("[Tag] is not provided or it is invalid.");
		return;
	}

	const packages = getInternalPackages();
	const changedPackages = packages.filter((pkg) => {
		if (
			semver.compare(getLatestPackageVersion(pkg.name), releaseTag.version) >= 0
		) {
			return false;
		}

		return isPackageChanged(pkg.folder);
	});

	if (changedPackages.length === 0) {
		console.error("No package changed.");
		return;
	}

	console.info("Updating packages dependencies...");
	for (let index = 0; index < 3; index++) {
		for (const pkg of packages) {
			changedPackages.forEach((changedPackage) => {
				const result = replacePackageVersion(
					pkg.packageJson,
					changedPackage.name,
					releaseTag.version
				);

				if (result && !changedPackages.includes(pkg)) {
					changedPackages.push(pkg);
				}
			});
		}
	}
	console.info("Updated packages dependencies.");

	console.log(changedPackages.map((pkg) => pkg.packageJson));

	console.info("Updating changed packages version...");
	changedPackages.forEach((pkg) => {
		pkg.version = releaseTag.version;
		pkg.packageJson.version = releaseTag.version;
		writePackageJsonFile(pkg.packageJson, pkg.packageJsonPath);
	});
	console.info("Updated changed packages version.");
}
publish();

function getInternalPackages() {
	const packagePaths = glob.globSync("packages/*/package.json");
	return packagePaths.map((path) => {
		const packageJson = JSON.parse(
			readFileSync(path, {
				encoding: "utf8",
			})
		);

		return {
			folder: path.replace("/package.json", ""),
			packageJsonPath: path,
			name: packageJson.name,
			version: packageJson.version,
			packageJson,
		};
	});
}

function replacePackageVersion(packageJson, packageName, version) {
	let result = false;
	["dependencies", "peerDependencies"].forEach((depType) => {
		if (depType in packageJson && packageName in packageJson[depType]) {
			if (packageJson[depType][packageName] === version) {
				return;
			}

			result = true;
			packageJson[depType][packageName] = version;
		}
	});

	return result;
}

function getLatestPackageVersion(packageName) {
	try {
		return execSync(`npm view ${packageName} version`).toString("utf8");
	} catch (error) {
		return "0.0.0";
	}
}

function isPackageChanged(packagePath) {
	const tags = getTags();
	if (tags.length === 0) {
		return true;
	}

	return getChangedFiles(tags[tags.length - 1]).some((path) =>
		path.startsWith(packagePath)
	);
}

function getTags() {
	return execSync("git tag").toString("utf8").split("\n").filter(Boolean);
}

function getChangedFiles(latestTag) {
	return execSync("git diff --name-only " + latestTag)
		.toString("utf8")
		.split("\n");
}

function writePackageJsonFile(packageJson, path) {
	writeFileSync(path, JSON.stringify(packageJson, undefined, 2));
}
