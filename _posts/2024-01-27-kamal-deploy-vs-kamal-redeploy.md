---
title: "When to use Kamal Deploy vs Redeploy?"
date: 2024-01-27 04:35:40
categories: ['kamal', 'Kamal', 'Rails', 'redeploy', 'ruby on rails']
---

What is the difference between kamal deploy and kamal redeploy? When using Kamal, when we do `kamal help`, there are two commands which seem similar. They are kamal deploy and kamal redeploy. In this article, we will find out the difference between both of those commands:

## kamal deploy

This is the documentation for `<a href="https://github.com/basecamp/kamal/blob/main/lib/kamal/cli/main.rb#L20">kamal deploy</a>`

Deploy app to servers

Flags:
option :skip_push, aliases: "-P", type: :boolean, default: false, desc: "Skip image build and push"

## kamal redeploy

This is the documentation for `<a href="https://github.com/basecamp/kamal/blob/main/lib/kamal/cli/main.rb#L61">kamal redeploy</a>`

Deploy app to servers without bootstrapping servers, starting Traefik, pruning, and registry login

Flags:
option :skip_push, aliases: "-P", type: :boolean, default: false, desc: "Skip image build and push"

As you can see from the documentation above, `kamal redeploy` just deploys the application to remote servers without doing anything else.

## Conclusion

- When deploying your application for the first time, use `kamal deploy`.
- For subsequent deploys, you can use `kamal redeploy` . This should be faster since it doesn't do  bootstrapping servers, starting Traefik, pruning and registry login which are required just once.
- If for some reason `kamal redeploy` doesn't work for subsequent deploys, feel free to use `kamal deploy`. It's not like `kamal deploy` will throw an error for subsequent deploys.

If you're looking for a guide to deploy a Rails application using Kamal, check out the <a href="https://joshio1.blog/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">Rails Kamal Series</a>.
