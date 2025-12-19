---
title: "Kamal Rails Series Part 4: Configure Redis and Sidekiq"
date: 2024-01-18 17:56:50
categories: ['Kamal', 'kamal', 'Rails', 'Rails', 'Redis', 'Ruby', 'ruby on rails', 'Sidekiq']
---

Next up in our Rails Kamal series is adding <a href="https://github.com/redis/redis-rb">Redis</a> and <a href="https://github.com/sidekiq/sidekiq">Sidekiq</a> configuration. Sidekiq is a very well-known background task manager in the Rails community. Sidekiq uses Redis as a data store for scheduling jobs. In this article, we are going to build upon our existing configuration to add Redis and Sidekiq to our deployment.

## Step 1: Add Redis to your Gemfile

```bash
# Gemfile

# Use Redis adapter to run Action Cable in production
gem "redis", "~> 4.0"
```

## Step 2: Add Sidekiq (Skip if you already have Sidekiq jobs)

We will add `Sidekiq` to our Gemfile by doing `bundle add sidekiq`.

We will then create a dummy job by doing:

```bash
rails generate sidekiq:job dummy
```

## Step 3: Add configuration in deploy.yml

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

- If we don't already have a private network created on the remote server, we need to create it as shown <a href="/posts/how-to-enable-https-on-rails-application-deployed-using-kamal/">in a previous article in this series</a>.

```bash
docker network create -d bridge private
```

- Note that if you have any other configuration in the `deploy.yml`{: .filepath} file related to Postgres or any other configuration, that does not have to be modified.

## Step 4: Add Redis as an accessory

Note that we have added Redis as an accessory. In order to deploy redis, we will use this command:

```bash
kamal env push
kamal accessory boot redis
```

## Step 5: Deploy

Next step is to deploy on our remote server. We will do:

```bash
kamal deploy
```

## How to check whether it's working?

- To check whether redis is working fine:

```bash
irb(main):008:0> redis = Redis.new
=> #<Redis client v4.8.1 for redis://rubypodcatcher-redis:6379/0>
irb(main):009:0> 
irb(main):010:0> redis.set("sample_key", "sample_value")
=> "OK"
```

- To check whether Sidekiq is working fine:

```bash
irb(main):005:0> DummyJob.perform_async
2024-01-18T15:39:15.194Z pid=7 tid=2jb INFO: Sidekiq 7.2.0 connecting to Redis with options {:size=>10, :pool_name=>"internal", :url=>"redis://rubypodcatcher-redis:6379/0"}
=> "2ab8740502724b5d107182cd"
```

## Conclusion:

- This article shows how we can deploy Sidekiq and Redis using Kamal on a Rails application. <a href="https://dev.37signals.com/introducing-solid-queue/">Rails 8 is going to use SolidQueue going forward</a> which is a new technology that uses database as a data store instead of Redis. I'll soon write about <a href="https://github.com/basecamp/solid_queue">Solid Queue</a> and Kamal.
- Check out these previous articles from this series:

<a href="/posts/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">Part 1: Deploying a basic Rails application using Kamal on Hetzner</a>
- <a href="/posts/add-postgres-on-rails-application-deplyed-using-kamal/">Part 2: Add Postgres to deployed Rails application using Kamal</a>
- <a href="/posts/how-to-enable-https-on-rails-application-deployed-using-kamal/">Part 3: Add SSL configuration using Kamal</a>



Listen to <a href="https://podcasts.apple.com/ee/podcast/012-dhh-joins-the-show-to-talk-rails-8-delegated/id1677373826?i=1000626547784">this podcast</a> where DHH talks about Rails and Kamal.

If you would like to search for specific terms or concepts or names in Ruby/Rails podcasts, check out <a href="https://rubypodcatcher.com/">rubypodcatcher.com</a>
