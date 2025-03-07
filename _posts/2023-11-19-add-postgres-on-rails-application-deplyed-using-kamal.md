---
title: "Kamal Series Part 2: Deploy Postgres with your Rails application"
date: 2023-11-19 08:16:48
categories: ['hetzner', 'kamal', 'Kamal', 'Postgres', 'PostgreSQL', 'Rails', 'Rails', 'Ruby', 'ruby on rails', 'RubyOnRails']
---

<!-- wp:paragraph -->
<p class="">In Part 1 of this Kamal Series, <a href="https://joshio1.blog/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">we have deployed a vanilla Rails application to our remote server using Kamal</a>. A vanilla Rails application ships with SQLite as a database by default. Many times though, we use Postgres as our database. This article is to add Postgres configuration to our Rails application and deploy using Kamal. Note that we are going to deploy Postgres on the same server using Kamal where our Rails application is hosted.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="">This article assumes that you have a Rails application backed by Postgres running on your local environment. If you have some other database other than Postgres(like MySQL), you can follow the same set of instructions below and adapt them for your database provider. If you use SQLite, feel free to skip this article and go to the next part.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Step 1: Add database configuration in <code>deploy.yml</code> file</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Add db configuration under accessories section of your <code>config/deploy.yml</code></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">Here is what the <code>config/deploy.yml</code> file should like: </li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code {"language":"yaml"} -->
<pre class="wp-block-syntaxhighlighter-code"># config/deploy.yml file

# Inject ENV variables into containers (secrets come from .env).
# Remember to run `kamal env push` after making changes!
env:
  clear:
    DB_HOST: &lt;ipv4_address_of_your_server>
    RAILS_SERVE_STATIC_FILES: true
    RAILS_LOG_TO_STDOUT: true
  secret:
    - RAILS_MASTER_KEY
    - POSTGRES_PASSWORD

accessories:  
  db:
    image: postgres:15
    host: &lt;ipv4_address_of_your_server>
    port: 5432
    env:
      clear:
        POSTGRES_USER: 'kamal_app_demo'
        POSTGRES_DB: 'kamal_app_demo_production'
      secret:
        - POSTGRES_PASSWORD
    directories:
      - data:/var/lib/postgresql/data</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Step 2: Add configuration in <code>.env</code> file</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Add <code>POSTGRES_PASSWORD</code> to your <code>.env</code> file</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code {"language":"bash"} -->
<pre class="wp-block-syntaxhighlighter-code">//.env file

KAMAL_REGISTRY_PASSWORD=&lt;docker_password>
RAILS_MASTER_KEY=&lt;master_key_of_production_environment>
POSTGRES_PASSWORD=&lt;password_of_database></pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">We can set any arbitrary password for <code>POSTGRES_PASSWORD</code>. Make sure that this value is not made public or pushed to version control.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Step 3: Change config/database.yml</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">We also need to change our <code>config/database.yml</code> file so that it picks up the correct environment variables. </li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code -->
<pre class="wp-block-syntaxhighlighter-code">#config/database.yml

production:
  &lt;&lt;: *default
  host: &lt;%= ENV["DB_HOST"] %>
  username: &lt;%= ENV["POSTGRES_USER"] %>
  database: &lt;%= ENV["POSTGRES_DB"] %>
  password: &lt;%= ENV["POSTGRES_PASSWORD"] %></pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Step 4: Run deploy commands</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">After we have made all the necessary configuration changes, it's time to deploy to the remote server.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">Run these commands on your terminal:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code -->
<pre class="wp-block-syntaxhighlighter-code">kamal env push
kamal accessory boot db
kamal deploy</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">If we would like to clean the existing server and deploy using this our new configuration with Postgres, we can use these commands:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code -->
<pre class="wp-block-syntaxhighlighter-code">kamal remove
kamal setup</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Gotchas:</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">This is a basic configuration for deploying PostgreSQL on your remote server. Note that this is for deploying database on the same machine as your Rails server. </li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">This does not cater to advanced configuration of having Postgres on a different machine or other complex requirements. Keep following my blog as I write more on these topics.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Next Part: Access server using HTTPS</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">So far, we have only accessed our remote server using HTTP.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class=""><a href="https://joshio1.blog/how-to-enable-https-on-rails-application-deployed-using-kamal/">Click HERE to go to the next part to access your server using HTTPS.</a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p class=""></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class=""><strong>NOTE</strong>:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">If this article is out of date, please don't hesitate to contact me on Twitter from <a href="https://joshio1.blog/about-me/">this page</a> and I'll be happy to update it.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">Listen to <a href="https://podcasts.apple.com/ee/podcast/012-dhh-joins-the-show-to-talk-rails-8-delegated/id1677373826?i=1000626547784">this podcast</a> where DHH talks about Rails and Kamal.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">If you would like to search for specific terms or concepts or names in Ruby/Rails podcasts, check out <a href="https://rubypodcatcher.com/">rubypodcatcher.com</a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->
