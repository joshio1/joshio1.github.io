---
title: "When to use Kamal Deploy vs Redeploy?"
date: 2024-01-27 04:35:40
categories: ['kamal', 'Kamal', 'Rails', 'redeploy', 'ruby on rails']
---

When using Kamal, you'll encounter two similar-sounding commands: `kamal deploy` and `kamal redeploy`. Here's the difference between them.

## kamal deploy

<a href="https://github.com/basecamp/kamal/blob/main/lib/kamal/cli/main.rb#L20">Documentation</a>: Deploy app to servers

**Flags:**
- `--skip_push` / `-P`: Skip image build and push

Use this command for initial deployments and when you've made infrastructure changes.

## kamal redeploy

<a href="https://github.com/basecamp/kamal/blob/main/lib/kamal/cli/main.rb#L61">Documentation</a>: Deploy app to servers without bootstrapping servers, starting Traefik, pruning, and registry login

**Flags:**
- `--skip_push` / `-P`: Skip image build and push

`kamal redeploy` skips server setup steps that only need to run once, making it faster for subsequent deployments.

## When to Use Each

- **`kamal deploy`**: First deployment or when infrastructure configuration changes
- **`kamal redeploy`**: Subsequent deployments with only application code changes (faster)
- If `kamal redeploy` fails, `kamal deploy` is safe to use as a fallback

For a complete guide to deploying Rails with Kamal, see the <a href="/posts/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">Rails Kamal Series</a>.
