#!/usr/bin/env node
import { execSync } from "child_process";
import path from "path";
import Encryptor from "../lib/Encryptor.js";

const ROOT_DIR = process.cwd();
const CONTENT_DIR = path.join(ROOT_DIR, "content");

async function main() {
  const encryptor = new Encryptor(CONTENT_DIR);
  await encryptor.processAll();
}

main();