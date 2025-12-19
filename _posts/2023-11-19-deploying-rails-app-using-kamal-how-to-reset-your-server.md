---
title: "Deploying Rails app using Kamal - How to reset your server"
date: 2023-11-19 06:14:59
categories: ['hetzner', 'kamal', 'Kamal', 'Rails', 'Rails', 'Ruby', 'ruby on rails', 'RubyOnRails']
---

Kamal is still in its early stages and is being battle-tested. While deploying Rails applications with Kamal, you may occasionally need to reset your server and start fresh. Unlike Rails, there's no built-in reset command. Here's how to reset your Kamal deployment.

## Step 1: Remove Kamal

```bash
kamal remove
```

This removes all application and accessory containers from your server, clears environment variables, and returns the server to its original state.

## Step 2: Set Up Kamal Again

```bash
kamal setup
```

This reinitializes Kamal, configures environment variables, and deploys all containers.

Alternatively, you could delete the server entirely and start over, but that's not always practical. These two commands provide a clean reset without losing your server.

For complete guides to deploying Rails with Kamal, see:
- <a href="/posts/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">Kamal Rails on Hetzner Series</a>
- <a href="/posts/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-aws/">Kamal Rails on AWS Series</a>

References:

- <a href="https://kamal-deploy.org/docs/commands">Kamal Commands</a>
- <a href="https://kamal-deploy.org/docs/configuration">Kamal Configuration</a>
