# hugo-private-post

AES-based encryption support for Hugo posts.
Write your Markdown content as usual just add `encrypt: true` and `key: ...` to the frontmatter, and this tool will handle the rest.

## Features

* Automatically encrypts `.md` files with `encrypt: true` and a defined `key` in the frontmatter
* Replaces the original content with an `<input>` + `<pre>` HTML structure
* Does **not** trigger a Hugo build
* Easily integrates into GitHub Actions pipelines

---

## Installation

### Install globally via NPM

```bash
npm install -g hugo-private-post
```

or run it directly with:

```bash
npx hugo-private-post
```

---

## How It Works

Write your post like this:

```markdown
---
title: Secret Post
encrypt: true
key: 1234
---

This content is private and should be encrypted.
```

Then run:

```bash
hugo-private-post
```

The result will be:

```markdown
---
title: Secret Post
encrypt: true
key: 1234
---

<input type="text" id="key" placeholder="Enter your key" />
<pre id="content">U2FsdGVkX1+XyzABC123==</pre>
```

---

## Usage with GitHub Actions

In your `.github/workflows/gh-pages.yaml`:

```yaml
- name: Install hugo-private-post
  run: npm install hugo-private-post

- name: Encrypt posts
  run: npx hugo-private-post
```

---

## Notes

* This tool **only encrypts content**. It does **not** trigger a Hugo build.
* You must include a decryption script (AES decryption via JavaScript) in your Hugo theme manually.
* Encryption is handled via `crypto-js` with AES. If you lose the key, the content cannot be decrypted.
