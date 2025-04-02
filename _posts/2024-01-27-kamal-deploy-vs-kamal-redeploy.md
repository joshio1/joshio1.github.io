---
title: "When to use Kamal Deploy vs Redeploy?"
date: 2024-01-27 04:35:40
categories: ['kamal', 'Kamal', 'Rails', 'redeploy', 'ruby on rails']
---

<!-- wp:paragraph -->
<p class="">What is the difference between kamal deploy and kamal redeploy? When using Kamal, when we do <code>kamal help</code>, there are two commands which seem similar. They are kamal deploy and kamal redeploy. In this article, we will find out the difference between both of those commands:</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">kamal deploy</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="">This is the documentation for <code><a href="https://github.com/basecamp/kamal/blob/main/lib/kamal/cli/main.rb#L20">kamal deploy</a></code></p>
<!-- /wp:paragraph -->

<!-- wp:syntaxhighlighter/code -->
<pre class="wp-block-syntaxhighlighter-code">Deploy app to servers

Flags:
option :skip_push, aliases: "-P", type: :boolean, default: false, desc: "Skip image build and push"</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:heading -->
<h2 class="wp-block-heading">kamal redeploy</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="">This is the documentation for <code><a href="https://github.com/basecamp/kamal/blob/main/lib/kamal/cli/main.rb#L61">kamal redeploy</a></code></p>
<!-- /wp:paragraph -->

<!-- wp:syntaxhighlighter/code -->
<pre class="wp-block-syntaxhighlighter-code">Deploy app to servers without bootstrapping servers, starting Traefik, pruning, and registry login

Flags:
option :skip_push, aliases: "-P", type: :boolean, default: false, desc: "Skip image build and push"</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:paragraph -->
<p class="">As you can see from the documentation above, <code>kamal redeploy</code> just deploys the application to remote servers without doing anything else.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Conclusion</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">When deploying your application for the first time, use <code>kamal deploy</code>. </li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">For subsequent deploys, you can use <code>kamal redeploy</code> . This should be faster since it doesn't do  bootstrapping servers, starting Traefik, pruning and registry login which are required just once.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">If for some reason <code>kamal redeploy</code> doesn't work for subsequent deploys, feel free to use <code>kamal deploy</code>. It's not like <code>kamal deploy</code> will throw an error for subsequent deploys.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p class="">If you're looking for a guide to deploy a Rails application using Kamal, check out the <a href="https://joshio1.blog/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">Rails Kamal Series</a>.</p>
<!-- /wp:paragraph -->
