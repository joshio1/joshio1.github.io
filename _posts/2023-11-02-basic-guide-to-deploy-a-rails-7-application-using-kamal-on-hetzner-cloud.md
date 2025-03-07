---
title: "Kamal Series Part 1: Deploy Rails application on Hetzner"
date: 2023-11-02 06:00:28
categories: ['hetzner', 'kamal', 'Kamal', 'Rails', 'Rails', 'Ruby', 'ruby on rails', 'RubyOnRails']
---

<!-- wp:paragraph -->
<p class=""><a href="https://kamal-deploy.org/">Kamal</a> is a new shiny way to deploy Rails applications <a href="https://world.hey.com/dhh/introducing-kamal-9330a267">announced by DHH</a> back in February 2023 and also spoke about it in his <a href="https://www.youtube.com/watch?v=iqXjGiQ_D-A">RailsWorld Keynote</a>. Now that <a href="https://www.heroku.com/">Heroku</a> has <a href="https://help.heroku.com/RSBRUH58/removal-of-heroku-free-product-plans-faq#:~:text=For%20non%2DEnterprise%20users%2C%20free,will%20be%20converted%20to%20mini%20.">removed their free tier</a>, Kamal has become excitingly popular since it also resonates with the idea of "<a href="https://world.hey.com/dhh/why-we-re-leaving-the-cloud-654b47e0">leaving the cloud</a>". Most importantly, Kamal is free and <a href="https://github.com/basecamp/kamal">open source</a> and is developed by the folks from <a href="https://basecamp.com/">Basecamp</a> who created Rails. </p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="">This means we need to purchase our own server for deploying our Rails application. There are several choices for purchasing like: <a href="https://www.digitalocean.com/">Digital Ocean</a> or <a href="https://aws.amazon.com/?nc2=h_lg">AWS</a> or <a href="https://www.hetzner.com/cloud">Hetzner</a>. We are going to use Hetzner which is one of the crowd favorites. It also gives you the best bang for buck! (We can run our entire Rails application for as little as 4 euros!!!)</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class=""> This is Part 1 of the Kamal Rails series. In this article, I will cover a basic way of deploying a vanilla Rails application on Hetzner Cloud.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Pre-Requisites:</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Docker is installed on our local environment. (Make sure the version is according to our OS)</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">Docker account is created on <a href="https://hub.docker.com/">Docker hub</a>. </li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">You have a Rails application "created" using Rails &gt; 6.0<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">If you don't have a Rails application created yet, you can do so using:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p class=""></p>
<!-- /wp:paragraph -->

<!-- wp:syntaxhighlighter/code {"language":"bash"} -->
<pre class="wp-block-syntaxhighlighter-code">rails new kamal_demo -T -m https://raw.githubusercontent.com/joshio1/rails_application_template/main/application_template.rb</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Account on Hetzner Cloud such that we are ready to create Projects/Servers.<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Normally, it takes around a day for the account to be verified after our details are entered.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Steps:</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class=""></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">1. Create a VPS on Hetzer Cloud</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Login to Hetzner Cloud and create a new "Project".</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:image {"id":414,"sizeSlug":"large","linkDestination":"none","align":"center"} -->
<figure class="wp-block-image aligncenter size-large"><img src="https://joshio1.blog/wp-content/uploads/2023/11/image-1024x373.png" alt="" class="wp-image-414"/></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">After a project is created, add a server to that project by clicking the "Add Server" button below:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:image {"id":415,"sizeSlug":"large","linkDestination":"none","align":"center"} -->
<figure class="wp-block-image aligncenter size-large"><img src="https://joshio1.blog/wp-content/uploads/2023/11/image-1-1024x508.png" alt="" class="wp-image-415"/></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Select the location for your server and also choose the operating system. In this example, we are going to choose Ubuntu.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">Selected <code>Shared vCPU(x86) and CPX11</code> (which is the first plan)</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:image {"id":416,"sizeSlug":"full","linkDestination":"none","align":"center"} -->
<figure class="wp-block-image aligncenter size-full"><img src="https://joshio1.blog/wp-content/uploads/2023/11/image-2.png" alt="" class="wp-image-416"/></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Choose IPv6 and IPv4 both</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">Add an SSH key to our server. Below command is how we can copy our public key to the clipboard. Use that to paste in the SSH section on Hetzner cloud while creating the server.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code -->
<pre class="wp-block-syntaxhighlighter-code">pbcopy &lt; ~/.ssh/id_rsa.pub</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">That's it. We don't need any more configurations on the server. Click on <code>Create and Buy Now</code></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">It will take around 1 or 2 minutes to create the server. We also get an email from Hetzner. Make sure the server is green and has an IPv4 address next to it. Check if we can SSH to the created server by doing:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code -->
<pre class="wp-block-syntaxhighlighter-code">ssh root@&lt;ipv4_address_of_the_server></pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:heading -->
<h2 class="wp-block-heading">2. Getting our Rails repository ready for deployment</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Now navigate to the root directory of your Rails application and check if you have a <code>Dockerfile</code> already present.<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">If your Rails application was created on Rails version 7.1 or greater, <a href="https://rubyonrails.org/2023/10/5/Rails-7-1-0-has-been-released">Rails now by default ships with a Dockerfile</a>.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">If not, we can use the <a href="https://github.com/fly-apps/dockerfile-rails">dockerfile-rails gem</a> for generating Dockerfile and related files.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">Make sure you have a <code>Dockerfile</code> present because Kamal uses a docker image for deployment.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">Next thing is to make sure you have health check route. Again if your application was created on Rails version 7.1 or greater, you should have an <code>/up</code> route which determines whether your application is up or not.<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">If you don't have an <code>/up</code> health check route, you can add this following code to your <code>config/routes.rb</code> file:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code -->
<pre class="wp-block-syntaxhighlighter-code">get '/up', to: ->(env) { [204, {}, ['']] }</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Once we have these two things (Dockerfile and the health check route), we should be all set to start using Kamal.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">3. Using Kamal for deployment</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Install Kamal using:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code -->
<pre class="wp-block-syntaxhighlighter-code">gem install kamal</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Now, navigate to the Rails application repository (<code>kamal_demo</code>) and initialize Kamal</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code -->
<pre class="wp-block-syntaxhighlighter-code">cd kamal_demo
kamal init</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">This will create a bunch of files like <code>.env</code>, <code>config/deploy.yml</code> and some hooks. Modify the <code>.env</code> file to insert Docker Registry password and Rails master key.<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Docker Registry Key can be found by logging in to your Docker account and going to <code>Account Settings &gt; Security &gt; New Access Token</code> to create a new access token.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class=""><code>RAILS_MASTER_KEY</code> for production environment is located in <code>config/credentials/production.key</code> of our Rails application which is used to decrypt Rails credentials.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">The <code>.env</code> file should look something like this:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code -->
<pre class="wp-block-syntaxhighlighter-code">KAMAL_REGISTRY_PASSWORD=&lt;our_docker_access_token>
RAILS_MASTER_KEY=&lt;our_rails_production_master_key></pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">The <code>kamal init</code> command also creates a <code>confi</code>g/<code>deploy.yml</code> file. This file is responsible for storing the configuration of our Rails application which is necessary to deploy on a remote server. Edit this file and change it to something like this: </li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code {"language":"yaml"} -->
<pre class="wp-block-syntaxhighlighter-code">service: kamal_demo
image: joshio1/kamal_demo
servers:
  - &lt;ipv4_address_of_Hetzner_server>
registry:
  username: joshio1
  password:
    - KAMAL_REGISTRY_PASSWORD
env:
  secret:
    - RAILS_MASTER_KEY</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Some details about the above <code>config/deploy.yml</code> file:<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Here <code>joshio1</code> is the <code>Docker</code> username and <code>kamal_demo</code> is the name of the Rails application</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">Kamal automatically references <code>KAMAL_REGISTRY_PASSWORD</code> and <code>RAILS_MASTER_KEY</code> from the <code>.env</code> file when they are mentioned like this in the <code>config/deploy.yml</code> file.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class=""><code>&lt;ipv4_address_of_hetzer_server&gt;</code> is pretty self-explanatory.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">Set <code>force_ssl=false</code> in <code>config/production.rb</code> <!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">This is because we haven't yet configured SSL certificates and we will only use HTTP to connect with our server.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">Note that we will configure HTTPS in upcoming parts of this Kamal series.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">After we have done making these changes, this is the final command required to deploy our Rails application to the Hetzer server: </li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code -->
<pre class="wp-block-syntaxhighlighter-code">kamal setup</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">You should see output like this:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code -->
<pre class="wp-block-syntaxhighlighter-code">➜  kamal_demo git:(main) ✗ kamal setup
  INFO [ffc073f1] Running /usr/bin/env mkdir -p .kamal on 5.161.42.10
  INFO [ffc073f1] Finished in 3.630 seconds with exit status 0 (successful).
Acquiring the deploy lock...
...
Ensure Docker is installed...
...
Push env files...
...
Log into image registry...
...
Build and push app image...
...
...
...
  INFO [57d640dd] Finished in 0.527 seconds with exit status 0 (successful).
  INFO Container is healthy!
...
...
  INFO [36025396] Finished in 1.358 seconds with exit status 0 (successful).
  Finished all in 288.2 seconds
Releasing the deploy lock...
  Finished all in 301.2 seconds</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Since our container is healthy and all the steps have successfully completed, we can navigate to the  URL of our server and see if it is up. Go to: <code>&lt;SERVER_IP&gt;/up</code> and we should see a green screen like this:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:image {"id":421,"sizeSlug":"large","linkDestination":"none","align":"center"} -->
<figure class="wp-block-image aligncenter size-large"><img src="https://joshio1.blog/wp-content/uploads/2023/11/image-3-1024x541.png" alt="" class="wp-image-421"/></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">If there are any errors during <code>kamal setup</code> command or this green is not visible, please refer to the <code>Important Points</code> section below for more information.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Next Part: Add Postgres to your Rails application</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">So far we have only deployed a basic Rails application with SQLite. In Part 2 of this series, we will deploy a Rails application backed by Postgres.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class=""><a href="https://joshio1.blog/add-postgres-on-rails-application-deplyed-using-kamal/">Click HERE to go to the next part in this Kamal series</a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p class=""></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class=""><strong>NOTE</strong>: </p>
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
