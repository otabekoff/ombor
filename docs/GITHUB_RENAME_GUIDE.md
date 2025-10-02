# 🔄 GitHub Repository Rename Guide

## Option 1: Using GitHub CLI (gh)

Since you have `gh` installed, this is the fastest method:

```bash
# Rename the repository
gh repo rename ombor --repo otabekoff/mahalliybaza

# Push your changes
git push origin main
```

That's it! The rename is done and your local repo will automatically update.

---

## Option 2: Using GitHub Web Interface

If the CLI doesn't work, use the web interface:

### Step 1: Rename on GitHub
1. Go to: https://github.com/otabekoff/mahalliybaza
2. Click **Settings** (top right)
3. In the **Repository name** field, change `mahalliybaza` to `ombor`
4. Click **Rename**

### Step 2: Update Local Repository
After renaming on GitHub, update your local repo:

```bash
# Update the remote URL
git remote set-url origin https://github.com/otabekoff/ombor.git

# Verify it worked
git remote -v

# Push your changes
git push origin main
```

---

## Option 3: Complete Command Sequence

Here's everything in order:

```bash
# 1. Rename the repo (using gh CLI)
gh repo rename ombor --repo otabekoff/mahalliybaza

# 2. Push your changes
git push origin main

# 3. Push tags (for releases)
git push --tags origin main

# 4. Verify the new URL
git remote -v
```

---

## What Happens When You Rename?

✅ **Automatic:**
- GitHub redirects old URLs to new ones
- Issues, PRs, stars, watchers all preserved
- Git operations automatically use new URL

⚠️ **Manual Updates Needed:**
- Update any external documentation
- Update badges in README
- Update npm package repository field (already done!)

---

## After Renaming

Your new repository will be at:
- **GitHub:** https://github.com/otabekoff/ombor
- **Clone URL:** https://github.com/otabekoff/ombor.git
- **Old URL:** https://github.com/otabekoff/mahalliybaza (redirects automatically)

---

## Quick Start (Copy & Paste)

```bash
# Rename using gh CLI
gh repo rename ombor --repo otabekoff/mahalliybaza

# Push everything
git push origin main
git push --tags origin main

# Done! ✅
```

---

## Troubleshooting

### If `gh repo rename` doesn't work:
```bash
# Check if you're logged in
gh auth status

# Login if needed
gh auth login
```

### If push fails:
```bash
# Try with explicit URL
git push https://github.com/otabekoff/ombor.git main
```

### If you renamed via web, update local:
```bash
git remote set-url origin https://github.com/otabekoff/ombor.git
```

---

## Verification

After everything is done:

```bash
# Check remote URL
git remote -v
# Should show: https://github.com/otabekoff/ombor.git

# Verify repository
gh repo view
# Should show: otabekoff/ombor
```

---

**Ready? Run the commands above and you're done!** 🚀
