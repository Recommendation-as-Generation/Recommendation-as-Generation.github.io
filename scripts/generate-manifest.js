const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const usersDir = path.join(root, "assets", "users");
const outputPath = path.join(root, "manifest.json");

const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);
const videoExtensions = new Set([".mp4", ".webm", ".mov", ".m4v"]);

function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function toPublicPath(filePath) {
  return filePath
    .replace(root, "")
    .split(path.sep)
    .join("/")
    .replace(/^\//, "");
}

function readUserDescription(userPath) {
  const infoPath = path.join(userPath, "info.txt");

  if (!fs.existsSync(infoPath)) {
    return "";
  }

  return fs.readFileSync(infoPath, "utf8").trim().replace(/\s+/g, " ");
}

function readCaptions(userPath) {
  const captionsPath = path.join(userPath, "captions.json");

  if (!fs.existsSync(captionsPath)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(captionsPath, "utf8"));
  } catch (error) {
    console.warn(`Skipping invalid ${path.relative(root, captionsPath)}: ${error.message}`);
    return {};
  }
}

function readUsers() {
  if (!fs.existsSync(usersDir)) {
    return [];
  }

  return fs
    .readdirSync(usersDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .sort((a, b) => naturalCompare(a.name, b.name))
    .map((entry, index) => {
      const userPath = path.join(usersDir, entry.name);
      const captions = readCaptions(userPath);
      const items = fs
        .readdirSync(userPath, { withFileTypes: true })
        .filter((file) => file.isFile() && !file.name.startsWith("."))
        .sort((a, b) => naturalCompare(a.name, b.name))
        .map((file) => {
          const ext = path.extname(file.name).toLowerCase();
          const type = imageExtensions.has(ext) ? "image" : videoExtensions.has(ext) ? "video" : null;

          if (!type) {
            return null;
          }

          return {
            type,
            name: path.basename(file.name, ext),
            file: toPublicPath(path.join(userPath, file.name)),
            caption: captions[file.name] || captions[path.basename(file.name, ext)] || ""
          };
        })
        .filter(Boolean);

      return {
        id: entry.name || `User${index + 1}`,
        label: entry.name || `User${index + 1}`,
        description: readUserDescription(userPath),
        items
      };
    })
    .filter((user) => user.items.length > 0);
}

const manifest = {
  generatedAt: new Date().toISOString(),
  users: readUsers()
};

fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${path.relative(root, outputPath)} with ${manifest.users.length} users.`);
