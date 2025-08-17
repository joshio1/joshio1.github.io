---
title: "Deploying Rails app using Kamal - How to reset your server"
date: 2023-11-19 06:14:59
categories: ['hetzner', 'kamal', 'Kamal', 'Rails', 'Rails', 'Ruby', 'ruby on rails', 'RubyOnRails']
---

Kamal is still it in its early stages and is getting battle-tested. While we try to use Kamal to deploy our Rails applications, there are several instances where we mess things up on the server and we would like to start from scratch. There is no `rails db:reset` command or similar. So how do we start from scratch and get back to our original state?

## Step 1: Remove kamal

```shell
kamal remove
```

- This will remove all the app and accessory containers from your server. It will also remove the environment variables and bring back the server to its original state.

## Step 2: Setup Kamal

```shell
kamal setup
```

- This will initialize Kamal which means it will add the environment variables and also deploy all the containers.

Ofcourse, the other option is to just delete the server and start again from scratch by running those two commands. But deleting the server is not always an option and the above two commands should serve you well for resetting the environment.

Please check <a href="https://joshio1.blog/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">this article</a> for more information  on how to deploy a Rails application on a Hetzner instance.

References:

- <a href="https://kamal-deploy.org/docs/commands">Kamal Commands</a>
- <a href="https://kamal-deploy.org/docs/configuration">Kamal Configuration</a>
