---
title: "How to fix Kamal Rails Master Key Message Encryption error"
date: 2024-02-18 13:05:36
categories: ['Kamal', 'Rails']
---

When <a href="/posts/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">deploying a Rails application using Kamal</a>, we set `RAILS_MASTER_KEY` in our `.env` file. However, this `RAILS_MASTER_KEY` is for our production environment. When we try to run the same application on our development environment, we get `ActiveSupport::MessageEncryptor::InvalidMessage` error because Rails is not able to decrypt the development credentials file. This article will show you how to fix this Master Key Encryption error when using <a href="https://github.com/ddollar/foreman">foreman</a> to start the development environment.

This is a typical stack trace we get when this happens:

```bash
18:12:06 web.1    | Exiting
18:12:06 web.1    | /Users/omkarjoshi/Projects/rubypodcatcher/.bundle/ruby/3.2.0/gems/activesupport-7.1.1/lib/active_support/messages/codec.rb:57:in `catch_and_raise': ActiveSupport::MessageEncryptor::InvalidMessage
18:12:06 web.1    |     from /Users/omkarjoshi/Projects/rubypodcatcher/.bundle/ruby/3.2.0/gems/activesupport-7.1.1/lib/active_support/message_encryptor.rb:242:in `decrypt_and_verify'
18:12:06 web.1    |     from /Users/omkarjoshi/Projects/rubypodcatcher/.bundle/ruby/3.2.0/gems/activesupport-7.1.1/lib/active_support/encrypted_file.rb:109:in `decrypt'
18:12:06 web.1    |     from /Users/omkarjoshi/Projects/rubypodcatcher/.bundle/ruby/3.2.0/gems/activesupport-7.1.1/lib/active_support/encrypted_file.rb:72:in `read'
18:12:06 web.1    |     from /Users/omkarjoshi/Projects/rubypodcatcher/.bundle/ruby/3.2.0/gems/activesupport-7.1.1/lib/active_support/encrypted_configuration.rb:57:in `read'
18:12:06 web.1    |     from /Users/omkarjoshi/Projects/rubypodcatcher/.bundle/ruby/3.2.0/gems/activesupport-7.1.1/lib/active_support/encrypted_configuration.rb:76:in `config'
18:12:06 web.1    |     from /Users/omkarjoshi/Projects/rubypodcatcher/.bundle/ruby/3.2.0/gems/activesupport-7.1.1/lib/active_support/encrypted_configuration.rb:95:in `options'
18:12:06 web.1    |     from /Users/omkarjoshi/Projects/rubypodcatcher/.bundle/ruby/3.2.0/gems/activesupport-7.1.1/lib/active_support/core_ext/module/delegation.rb:332:in `method_missing'
18:12:06 web.1    |     from /Users/omkarjoshi/Projects/rubypodcatcher/.bundle/ruby/3.2.0/gems/devise-4.9.2/lib/devise/secret_key_finder.rb:24:in `key_exists?'
18:12:06 web.1    |     from /Users/omkarjoshi/Projects/rubypodcatcher/.bundle/ruby/3.2.0/gems/devise-4.9.2/lib/devise/secret_key_finder.rb:10:in `find'
18:12:06 web.1    |     from /Users/omkarjoshi/Projects/rubypodcatcher/.bundle/ruby/3.2.0/gems/devise-4.9.2/lib/devise/rails.rb:37:in `block in <class:Engine>'
18:12:06 web.1    |     from /Users/omkarjoshi/Projects/rubypodcatcher/.bundle/ruby/3.2.0/gems/railties-7.1.1/lib/rails/initializable.rb:32:in `instance_exec'
18:12:06 web.1    |     from /Users/omkarjoshi/Projects/rubypodcatcher/.bundle/ruby/3.2.0/gems/railties-7.1.1/lib/rails/initializable.rb:32:in `run'
```

In this case, we have typically run the Rails application in our development environment using the `bin/dev` command and we use `<a href="https://github.com/ddollar/foreman">foreman</a>` in our `Procfile.dev`.

## The Fix:

- Create a separate environment variable file for our local environment:

```bash
# .env.local

RAILS_MASTER_KEY=<development_master_key>
```

- Explicitly specify this environment variable when foreman starts in Procfile.dev

```bash
# Procfile.dev

exec foreman start -e .env.local -f Procfile.dev "$@"
```

## Why does this work?

- Earlier our Procfile.dev, simply started foreman using this command: `exec foreman start -f Procfile.dev "*$@*"`. This command automatically picks up the `.env` file which is present in the root directory.
- In our case, this `.env` file has configuration for the production environment which are required for Kamal.
- In our fix, we explicitly point foreman to a different "local" environment variable file which gets rid of this error.

Check out <a href="/posts/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">my Rails Kamal Series</a> for step by step guide to deploy Rails application using Kamal.
