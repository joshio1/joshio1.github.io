---
title: "Kamal Rails Series Part 4: Configure Redis and Sidekiq"
date: 2024-01-18 17:56:50
categories: ['Kamal', 'kamal', 'Rails', 'Rails', 'Redis', 'Ruby', 'ruby on rails', 'Sidekiq']
---

This article covers adding <a href="https://github.com/redis/redis-rb">Redis</a> and <a href="https://github.com/sidekiq/sidekiq">Sidekiq</a> to your Kamal deployment. Sidekiq is a popular background job processor for Rails, and it uses Redis as its data store. We'll build upon our existing Kamal configuration to add these services.

## Step 1: Add Redis to Your Gemfile

```ruby
# Gemfile
gem "redis", "~> 4.0"
```

## Step 2: Add Sidekiq (Skip if Already Configured)

Add Sidekiq to your Gemfile:

```bash
bundle add sidekiq
```

Create a sample job:

```bash
rails generate sidekiq:job dummy
```

## Step 3: Configure Redis and Sidekiq in deploy.yml

```yaml
#config/deploy.yml

# Name of your application. Used to uniquely configure containers.
service: rubypodcatcher

# Name of the container image.
image: joshio1/rubypodcatcher

# Deploy to these servers.
servers:
  web:
    hosts:
      - <SERVER_IP>
    options:
      network: "private"

  ..other configuration..
  
job:
    hosts:
      - <SERVER_IP>
    cmd: bundle exec sidekiq -q default -q mailers
    options:
      network: "private"

env:
  clear:
    HOSTNAME: rubypodcatcher.com
    DB_HOST: <SERVER_IP>
    RAILS_SERVE_STATIC_FILES: true
    RAILS_LOG_TO_STDOUT: true
    REDIS_URL: "redis://rubypodcatcher-redis:6379/0"
  secret:
    - RAILS_MASTER_KEY

accessories:
  redis:
    image: redis:latest
    host: <SERVER_IP>
    directories:
      - data:/data
    options:
      network: "private"
```

- If you haven't created a private Docker network on your remote server, see <a href="/posts/how-to-enable-https-on-rails-application-deployed-using-kamal/">the previous article</a> for instructions.

```bash
docker network create -d bridge private
```

- Note: Any other configuration in your `deploy.yml` (like Postgres) doesn't need to be modified.

## Step 4: Deploy Redis

Redis is configured as an accessory. Deploy it with:

```bash
kamal env push
kamal accessory boot redis
```

## Step 5: Deploy Your Application

Deploy your application with the new Redis and Sidekiq configuration:

```bash
kamal deploy
```

## Verify the Setup

To verify Redis is working:

```bash
irb(main):008:0> redis = Redis.new
=> #<Redis client v4.8.1 for redis://rubypodcatcher-redis:6379/0>
irb(main):010:0> redis.set("sample_key", "sample_value")
=> "OK"
```

To verify Sidekiq is working:

```bash
irb(main):005:0> DummyJob.perform_async
2024-01-18T15:39:15.194Z pid=7 tid=2jb INFO: Sidekiq 7.2.0 connecting to Redis with options {:size=>10, :pool_name=>"internal", :url=>"redis://rubypodcatcher-redis:6379/0"}
=> "2ab8740502724b5d107182cd"
```

## Summary

This article demonstrates how to deploy Sidekiq and Redis with Kamal on a Rails application. Note that <a href="https://dev.37signals.com/introducing-solid-queue/">Rails 8 introduces SolidQueue</a>, which uses the database instead of Redis for job storage. I'll cover <a href="https://github.com/basecamp/solid_queue">SolidQueue</a> with Kamal in a future article.

**Previous articles in this series:**
- <a href="/posts/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">Part 1: Deploy a basic Rails application using Kamal on Hetzner</a>
- <a href="/posts/add-postgres-on-rails-application-deplyed-using-kamal/">Part 2: Add Postgres to your deployed Rails application</a>
- <a href="/posts/how-to-enable-https-on-rails-application-deployed-using-kamal/">Part 3: Configure SSL with Kamal</a>



Listen to <a href="https://podcasts.apple.com/ee/podcast/012-dhh-joins-the-show-to-talk-rails-8-delegated/id1677373826?i=1000626547784">this podcast</a> where DHH talks about Rails and Kamal.

If you would like to search for specific terms or concepts or names in Ruby/Rails podcasts, check out <a href="https://rubypodcatcher.com/">rubypodcatcher.com</a>
