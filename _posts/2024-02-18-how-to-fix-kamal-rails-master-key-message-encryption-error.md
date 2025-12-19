---
title: "How to fix Kamal Rails Master Key Message Encryption error"
date: 2024-02-18 13:05:36
categories: ['Kamal', 'Rails']
---

When <a href="/posts/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">deploying a Rails application with Kamal</a>, you set `RAILS_MASTER_KEY` in your `.env` file for production. However, when running the same application in development, you'll get an `ActiveSupport::MessageEncryptor::InvalidMessage` error because Rails can't decrypt the development credentials file with the production key. This article shows how to fix this issue when using <a href="https://github.com/ddollar/foreman">foreman</a> to start your development environment.

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

This typically happens when running your Rails application locally with `bin/dev` using <a href="https://github.com/ddollar/foreman">foreman</a> in your `Procfile.dev`.

## The Solution

Create a separate environment variable file for local development:

```bash
# .env.local
RAILS_MASTER_KEY=<development_master_key>
```

Update your `Procfile.dev` to explicitly use this file:

```bash
# Procfile.dev
exec foreman start -e .env.local -f Procfile.dev "$@"
```

## Why This Works

- Previously, `Procfile.dev` ran `exec foreman start -f Procfile.dev "$@"`, which automatically loaded your `.env` file
- Your `.env` file contains production configuration needed for Kamal
- By explicitly pointing foreman to `.env.local`, you use your development master key instead, resolving the decryption error

For complete guides to deploying Rails with Kamal, see:
- <a href="/posts/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">Kamal Rails on Hetzner Series</a>
- <a href="/posts/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-aws/">Kamal Rails on AWS Series</a>
