---
title: "Kamal Rails Series Part 4: Configure Redis and Sidekiq"
date: 2024-01-18 17:56:50
categories: ['Kamal', 'kamal', 'Rails', 'Rails', 'Redis', 'Ruby', 'ruby on rails', 'Sidekiq']
---

<!-- wp:paragraph -->
<p class="">Next up in our Rails Kamal series is adding <a href="https://github.com/redis/redis-rb">Redis</a> and <a href="https://github.com/sidekiq/sidekiq">Sidekiq</a> configuration. Sidekiq is a very well-known background task manager in the Rails community. Sidekiq uses Redis as a data store for scheduling jobs. In this article, we are going to build upon our existing configuration to add Redis and Sidekiq to our deployment. </p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Step 1: Add Redis to your Gemfile</h2>
<!-- /wp:heading -->

<!-- wp:syntaxhighlighter/code {"language":"bash"} -->
<pre class="wp-block-syntaxhighlighter-code"># Gemfile

# Use Redis adapter to run Action Cable in production
gem "redis", "~> 4.0"</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Step 2: Add Sidekiq (Skip if you already have Sidekiq jobs)</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="">We will add <code>Sidekiq</code> to our Gemfile by doing <code>bundle add sidekiq</code>.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="">We will then create a dummy job by doing:</p>
<!-- /wp:paragraph -->

<!-- wp:syntaxhighlighter/code {"language":"bash"} -->
<pre class="wp-block-syntaxhighlighter-code">rails generate sidekiq:job dummy</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Step 3: Add configuration in deploy.yml</h2>
<!-- /wp:heading -->

<!-- wp:syntaxhighlighter/code {"language":"yaml"} -->
<pre class="wp-block-syntaxhighlighter-code">#config/deploy.yml

# Name of your application. Used to uniquely configure containers.
service: rubypodcatcher

# Name of the container image.
image: joshio1/rubypodcatcher

# Deploy to these servers.
servers:
  web:
    hosts:
      - &lt;SERVER_IP>
    options:
      network: "private"

  ..other configuration..
  
job:
    hosts:
      - &lt;SERVER_IP>
    cmd: bundle exec sidekiq -q default -q mailers
    options:
      network: "private"

env:
  clear:
    HOSTNAME: rubypodcatcher.com
    DB_HOST: &lt;SERVER_IP>
    RAILS_SERVE_STATIC_FILES: true
    RAILS_LOG_TO_STDOUT: true
    REDIS_URL: "redis://rubypodcatcher-redis:6379/0"
  secret:
    - RAILS_MASTER_KEY



accessories:
  redis:
    image: redis:latest
    host: &lt;SERVER_IP>
    directories:
      - data:/data
    options:
      network: "private"</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">If we don't already have a private network created on the remote server, we need to create it as shown <a href="https://joshio1.blog/how-to-enable-https-on-rails-application-deployed-using-kamal/">in a previous article in this series</a>.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code {"language":"bash"} -->
<pre class="wp-block-syntaxhighlighter-code">docker network create -d bridge private</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Note that if you have any other configuration in the <code>deploy.yml</code> file related to Postgres or any other configuration, that does not have to be modified.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Step 4: Add Redis as an accessory</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="">Note that we have added Redis as an accessory. In order to deploy redis, we will use this command:</p>
<!-- /wp:paragraph -->

<!-- wp:syntaxhighlighter/code {"language":"bash"} -->
<pre class="wp-block-syntaxhighlighter-code">kamal env push
kamal accessory boot redis</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Step 5: Deploy</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="">Next step is to deploy on our remote server. We will do:</p>
<!-- /wp:paragraph -->

<!-- wp:syntaxhighlighter/code {"language":"bash"} -->
<pre class="wp-block-syntaxhighlighter-code">kamal deploy</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:heading -->
<h2 class="wp-block-heading">How to check whether it's working?</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">To check whether redis is working fine:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code {"language":"bash"} -->
<pre class="wp-block-syntaxhighlighter-code">irb(main):008:0> redis = Redis.new
=> #&lt;Redis client v4.8.1 for redis://rubypodcatcher-redis:6379/0>
irb(main):009:0> 
irb(main):010:0> redis.set("sample_key", "sample_value")
=> "OK"</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">To check whether Sidekiq is working fine:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code {"language":"bash"} -->
<pre class="wp-block-syntaxhighlighter-code">irb(main):005:0> DummyJob.perform_async
2024-01-18T15:39:15.194Z pid=7 tid=2jb INFO: Sidekiq 7.2.0 connecting to Redis with options {:size=>10, :pool_name=>"internal", :url=>"redis://rubypodcatcher-redis:6379/0"}
=> "2ab8740502724b5d107182cd"</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Conclusion:</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">This article shows how we can deploy Sidekiq and Redis using Kamal on a Rails application. <a href="https://dev.37signals.com/introducing-solid-queue/">Rails 8 is going to use SolidQueue going forward</a> which is a new technology that uses database as a data store instead of Redis. I'll soon write about <a href="https://github.com/basecamp/solid_queue">Solid Queue</a> and Kamal.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">Check out these previous articles from this series:<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class=""><a href="https://joshio1.blog/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">Part 1: Deploying a basic Rails application using Kamal on Hetzner</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class=""><a href="https://joshio1.blog/add-postgres-on-rails-application-deplyed-using-kamal/">Part 2: Add Postgres to deployed Rails application using Kamal</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class=""><a href="https://joshio1.blog/how-to-enable-https-on-rails-application-deployed-using-kamal/">Part 3: Add SSL configuration using Kamal</a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">Listen to <a href="https://podcasts.apple.com/ee/podcast/012-dhh-joins-the-show-to-talk-rails-8-delegated/id1677373826?i=1000626547784">this podcast</a> where DHH talks about Rails and Kamal.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">If you would like to search for specific terms or concepts or names in Ruby/Rails podcasts, check out <a href="https://rubypodcatcher.com/">rubypodcatcher.com</a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p class=""></p>
<!-- /wp:paragraph -->
