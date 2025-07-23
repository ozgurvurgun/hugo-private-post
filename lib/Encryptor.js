import fs from "fs/promises";
import path from "path";
import CryptoJS from "crypto-js";

export default class Encryptor {
  constructor(contentDir = "content") {
    this.contentDir = contentDir;
  }

  async processAll() {
    const files = await this._getMarkdownFiles(this.contentDir);
    for (const file of files) {
      const content = await fs.readFile(file, "utf-8");
      const meta = this._parseFrontMatter(content);

      if (meta.encrypt && meta.key) {
        const encryptedContent = this._encryptContent(content, meta.key);
        await fs.writeFile(file, encryptedContent, "utf-8");
        console.log(`🔒 Encrypted: ${file}`);
      }
    }
  }

  async _getMarkdownFiles(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map(entry => {
      const res = path.resolve(dir, entry.name);
      return entry.isDirectory() ? this._getMarkdownFiles(res) : res;
    }));
    return files.flat().filter(file => file.endsWith(".md"));
  }

  _parseFrontMatter(content) {
    const match = content.match(/^---\n([\s\S]+?)\n---/);
    if (!match) return {};

    const lines = match[1].split("\n");
    const data = {};
    for (const line of lines) {
      const [key, value] = line.split(":").map(s => s.trim());
      if (key === "encrypt") data.encrypt = value === "true";
      if (key === "key") data.key = value;
    }
    return data;
  }

  _encryptContent(originalContent, key) {
    const parts = originalContent.split("---");
    if (parts.length < 3) return originalContent;

    const body = parts.slice(2).join("---").trim();
    const encrypted = CryptoJS.AES.encrypt(body, key).toString();

    const newBody = `
<input type="text" id="key" placeholder="Anahtarı girin" />
<pre id="content">${encrypted}</pre>
`;

    return `---${parts[1]}---\n${newBody}`;
  }
}
