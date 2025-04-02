---
title: "Kamal Rails Series Part 3: Enable HTTPS and SSL Certificate"
date: 2023-12-29 14:29:20
categories: ['hetzner', 'HTTPS', 'Kamal', 'kamal', 'LetsEncrypt', 'Rails', 'Rails', 'Ruby', 'ruby on rails', 'RubyOnRails', 'SSL']
---

<!-- wp:paragraph -->
<p class="">This is Part 3 of my Kamal Rails Series. So far, <a href="https://joshio1.blog/add-postgres-on-rails-application-deplyed-using-kamal/">we've deployed a Rails application and accessed the application using the HTTP protocol</a>. However, in production, we rarely do this and always deploy our application using HTTPS recommended secure way with an SSL certificate. This article is to add HTTPS and SSL configuration to our already deployed Rails application using Kamal. </p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Pre-Requisites</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Already deployed Rails application using Kamal</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">Can access the Rails application using <code>&lt;SERVER_IP&gt;/up</code> command.<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">This GET request should return a 200 OK response.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">Bought a domain on any domain provider like <a href="https://www.namecheap.com/">Namecheap</a> or <a href="https://www.godaddy.com/en-in">GoDaddy</a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Step 1: Add traefik configuration to deploy.yml</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">These are the things we need to add in our <code>config/deploy.yml</code></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code {"language":"yaml"} -->
<pre class="wp-block-syntaxhighlighter-code"># Name of your application. Used to uniquely configure containers.
service: rubypodcatcher

# Name of the container image.
image: joshio1/rubypodcatcher

# Deploy to these servers.
servers:
  web:
    hosts:
      - &lt;SERVER_IP>
    labels:
      traefik.http.routers.rubypodcatcher.rule: Host(`rubypodcatcher.com`)
      traefik.http.routers.rubypodcatcher_secure.entrypoints: websecure
      traefik.http.routers.rubypodcatcher_secure.rule: Host(`rubypodcatcher.com`)
      traefik.http.routers.rubypodcatcher_secure.tls: true
      traefik.http.routers.rubypodcatcher_secure.tls.certresolver: letsencrypt
    options:
      network: "private"

# Credentials for your image host.
registry:
  # Specify the registry server, if you're not using Docker Hub
  # server: registry.digitalocean.com / ghcr.io / ...
  username: joshio1

  # Always use an access token rather than real password when possible.
  password:
    - KAMAL_REGISTRY_PASSWORD

# Inject ENV variables into containers (secrets come from .env).
# Remember to run `kamal env push` after making changes!
env:
  clear:
    HOSTNAME: rubypodcatcher.com
  secret:
    - RAILS_MASTER_KEY

# Configure custom arguments for Traefik
traefik:
  options:
    publish:
      - "443:443"
    volume:
      - "/letsencrypt/acme.json:/letsencrypt/acme.json"
    network: "private"
  args:
    entryPoints.web.address: ":80"
    entryPoints.websecure.address: ":443"
    certificatesResolvers.letsencrypt.acme.email: "omkar.nitin.joshi@gmail.com"
    certificatesResolvers.letsencrypt.acme.storage: "/letsencrypt/acme.json"
    certificatesResolvers.letsencrypt.acme.httpchallenge: true
    certificatesResolvers.letsencrypt.acme.httpchallenge.entrypoint: web</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Replace &lt;SERVER_IP&gt; with the IP address of your remote server.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Step 2: Create LetsEncrypt acme file and docker network on remote server</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">We are going to use <a href="https://letsencrypt.org/">letsencrypt</a> for our HTTPS configuration as you may have seen from the <code>deploy.yml</code> file above.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">We will need to create an <code>acme.json</code> file on the remote server for our <code>deploy.yml</code> changes to work.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">We also need to create a "private" Docker network changes which we use to communicate internally.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">We can do that by SSHing to the remote server as follows:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code {"language":"bash"} -->
<pre class="wp-block-syntaxhighlighter-code">$ ssh root@&lt;SERVER_IP>
root# mkdir -p /letsencrypt &amp;&amp; touch /letsencrypt/acme.json &amp;&amp; chmod 600 /letsencrypt/acme.json
root# docker network create -d bridge private</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">We can also automate this by using Kamal hooks but this is just a one-time task and not needed for every deploy (of course) </li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Step 3: Change force_ssl to true in <code>production.rb</code></h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">If you followed my <a href="https://joshio1.blog/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">previous articles</a>, I had configured <code>config.force_ssl</code> to be <code>false</code> so that we can access our server using HTTP as well.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">We need to revert this change and instead <code>force_ssl</code> should be set to <code>true</code></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code {"language":"ruby"} -->
<pre class="wp-block-syntaxhighlighter-code"># config/production.rb
  
# Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  config.force_ssl = true</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Step 4: Allow inbound HTTPS connections</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">We need to also allow inbound HTTPS connections to our remote server.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">To do this, create a firewall and allow inbound connections to port 80 and 443 into the remote server.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:image {"id":466,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://joshio1.blog/wp-content/uploads/2023/12/image-1-1024x546.png" alt="" class="wp-image-466"/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Step 5: Add A record and CNAME in domain provider settings</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">We need to point our domain to the IP address of our remote server.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">To do this, we will need to add the following records in the DNS settings of our domain provider (i.e. wherever we have purchased our domain from)</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">We need to add an <code>A record</code> with <code>HOST</code> value of <code>@</code> and value will be the IP address of the remote server.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">We also need to add a <code>CNAME record</code> with <code>HOST</code> value of <code>www</code> and value will be the name of our <code>domain</code> ending with <code>.com</code>.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">Note that these settings might change based on your domain provider. Hence, please check with your domain provider. (Above settings are applicable for Namecheap which is where I have my domain from) </li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Step 6: Deploy using Kamal</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Once we are done with all the configuration, it is time to deploy our changes to the remote server.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">We will run these following commands:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code {"language":"bash"} -->
<pre class="wp-block-syntaxhighlighter-code">kamal setup
kamal deploy
kamal traefik restart</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">After running these commands, if we visit our website directly using the domain name, we should be able to see our Rails application up and running.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:image {"id":467,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://joshio1.blog/wp-content/uploads/2023/12/image-2-1024x569.png" alt="" class="wp-image-467"/></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class=""> Other commands you might wanna try for debugging in case there was some error:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code {"language":"bash"} -->
<pre class="wp-block-syntaxhighlighter-code">kamal traefik logs
kamal app logs</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Also, you can use <code>kamal env push</code> to push your environment variables and <code>kamal traefik reboot</code> to reboot traefik. Please check <code>kamal traefik help</code> for more information.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">This concludes our steps to add HTTPS and SSL certificate to our Rails application using Kamal.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Next Part: Sidekiq and Redis</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Click <a href="https://joshio1.blog/kamal-rails-series-configure-sidekiq-and-redis/">HERE</a> to read the next post where I talk about adding Redis and Sidekiq to our Kamal configuration.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">Check out these previous articles from this series:<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class=""><a href="https://joshio1.blog/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">Part 1: Deploying a basic Rails application using Kamal on Hetzner</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class=""><a href="https://joshio1.blog/add-postgres-on-rails-application-deplyed-using-kamal/">Part 2: Add Postgres to deployed Rails application using Kamal</a></li>
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
