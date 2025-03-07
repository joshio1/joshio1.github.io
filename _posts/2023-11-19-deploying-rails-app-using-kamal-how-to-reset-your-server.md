---
title: "Deploying Rails app using Kamal - How to reset your server"
date: 2023-11-19 06:14:59
categories: ['hetzner', 'kamal', 'Kamal', 'Rails', 'Rails', 'Ruby', 'ruby on rails', 'RubyOnRails']
---

<!-- wp:paragraph -->
<p class="">Kamal is still it in its early stages and is getting battle-tested. While we try to use Kamal to deploy our Rails applications, there are several instances where we mess things up on the server and we would like to start from scratch. There is no <code>rails db:reset</code> command or similar. So how do we start from scratch and get back to our original state?</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Step 1: Remove kamal</h2>
<!-- /wp:heading -->

<!-- wp:code -->
<pre class="wp-block-code"><code>kamal remove</code></pre>
<!-- /wp:code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">This will remove all the app and accessory containers from your server. It will also remove the environment variables and bring back the server to its original state.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Step 2: Setup Kamal</h2>
<!-- /wp:heading -->

<!-- wp:code -->
<pre class="wp-block-code"><code>kamal setup</code></pre>
<!-- /wp:code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">This will initialize Kamal which means it will add the environment variables and also deploy all the containers.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p class=""></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="">Ofcourse, the other option is to just delete the server and start again from scratch by running those two commands. But deleting the server is not always an option and the above two commands should serve you well for resetting the environment.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="">Please check <a href="https://joshio1.blog/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">this article</a> for more information  on how to deploy a Rails application on a Hetzner instance.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="">References:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class=""><a href="https://kamal-deploy.org/docs/commands">Kamal Commands</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class=""><a href="https://kamal-deploy.org/docs/configuration">Kamal Configuration</a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->
