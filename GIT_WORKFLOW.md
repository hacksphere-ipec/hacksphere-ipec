# Team Git Workflow & Conflict Prevention Guide (With Commands)

This document defines **exact commands + workflows** for every situation so:

- commits never disappear
- main never breaks
- deployment stays stable
- conflicts are minimized
- authorship always shows in main

This is the mandatory team process.

---

# 0) Core Rules (Non-negotiable)

NEVER:

```
git push origin main
git reset --hard main
git push --force main
delete repository
upload ZIP directly into main
```

ALWAYS:

```
feature → development → main
```

---

# 1) Branch Structure

```
main            → production (live site)
development     → staging/testing
feature/*       → all personal work
hotfix/*        → urgent production fixes
```

No other branches.

---

# 2) Starting New Work (Every time)

Before coding:

```
git checkout development
git pull origin development
git checkout -b feature/<task-name>
```

Example:

```
git checkout -b feature/webp-images
```

Work only inside this branch.

---

# 3) Daily Working Commands

```
git add .
git commit -m "feat: describe work"
git push origin feature/<task-name>
```

Repeat during development.

---

# 4) Merge Feature → Development

After work complete and tested locally:

```
git checkout development
git pull origin development
git merge feature/<task-name>
git push origin development
```

Then test development branch.

---

# 5) Merge Development → Main (Release)

After full testing:

```
git checkout main
git pull origin main
git merge development
git push origin main
```

Then deploy.

---

# 6) Deployment Workflow

Render / Vercel must deploy only from:

```
main
```

Deployment steps:

1. Open dashboard
2. Manual deploy
3. Deploy latest commit

---

# 7) Conflict Resolution Workflow

When merge conflicts appear:

```
git status
```

Open conflicted files.

Choose correct version:

```
<<<<<<< HEAD
current branch
=======
incoming branch
>>>>>>> branch-name
```

Edit → save → then:

```
git add .
git commit -m "resolve merge conflicts"
git push
```

---

# 8) Image Conversion Workflow (PNG → WebP safe method)

NEVER delete PNG first.

Correct process:

```
feature/webp-conversion
```

Steps:

```
add webp files
update references
test locally
merge → development
merge → main
```

Optional safe HTML:

```
<picture>
  <source srcset="img.webp" type="image/webp">
  <img src="img.png">
</picture>
```

---

# 9) When Repo Breaks / History Confused

STOP pushing.

Recovery steps:

```
git checkout development
git pull origin development
```

Create recovery branch:

```
git checkout -b recovery-fix
```

Fix → merge back.

---

# 10) If Someone Deleted Repo

Recovery:

```
git clone <repo-url>
git branch -a
git push origin development
git push origin main
```

Restore branches.

---

# 11) If Main Shows Old Code

Bring development into main:

```
git checkout main
git pull origin main
git merge development
git push origin main
```

Deploy again.

---

# 12) If Commits Not Showing in Main

Means branch not merged.

Fix:

```
git checkout development
git merge feature/<branch>
git push origin development

git checkout main
git merge development
git push origin main
```

---

# 13) If Port Already In Use (Local Run)

```
sudo fuser -k 3000/tcp
npm start
```

OR

```
PORT=5050 npm start
```

---

# 14) If Authentication Fails

Use SSH:

```
git remote set-url origin git@github.com:<org>/<repo>.git
ssh -T git@github.com
git push
```

---

# 15) If Need Emergency Production Fix

```
git checkout main
git checkout -b hotfix/<name>
fix code
git add .
git commit -m "hotfix: ..."
git push origin hotfix/<name>
git checkout main
git merge hotfix/<name>
git push origin main
```

Deploy.

---

# 16) Team Pull Rule (Before Coding)

Always run:

```
git checkout development
git pull origin development
```

Never code on outdated branch.

---

# 17) Safe Pull Strategy

Set once:

```
git config --global pull.rebase false
```

Prevents divergence confusion.

---

# 18) Branch Protection (GitHub Setup)

Enable:

- main → no direct push
- main → PR required
- development → PR required
- force push disabled

---

# 19) Commit Naming Convention

```
feat: new feature
fix: bug fix
style: css change
refactor: code cleanup
docs: documentation
chore: maintenance
```

---

# 20) Golden Recovery Command Set

If confused:

```
git status
git branch -a
git log --oneline --graph --all
```

Never guess actions.

---

# Final Rule

If unsure:

STOP → ASK → THEN PUSH

Git mistakes spread fast.
Slow is safe.
