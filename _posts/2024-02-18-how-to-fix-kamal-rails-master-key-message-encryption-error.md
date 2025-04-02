---
title: "How to fix Kamal Rails Master Key Message Encryption error"
date: 2024-02-18 13:05:36
categories: ['Kamal', 'Rails']
---

<!-- wp:paragraph -->
<p class="">When <a href="https://joshio1.blog/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">deploying a Rails application using Kamal</a>, we set <code>RAILS_MASTER_KEY</code> in our <code>.env</code> file. However, this <code>RAILS_MASTER_KEY</code> is for our production environment. When we try to run the same application on our development environment, we get <code>ActiveSupport::MessageEncryptor::InvalidMessage</code> error because Rails is not able to decrypt the development credentials file. This article will show you how to fix this Master Key Encryption error when using <a href="https://github.com/ddollar/foreman">foreman</a> to start the development environment. </p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="">This is a typical stack trace we get when this happens:</p>
<!-- /wp:paragraph -->

<!-- wp:syntaxhighlighter/code {"language":"bash"} -->
<pre class="wp-block-syntaxhighlighter-code">18:12:06 web.1    | Exiting
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
18:12:06 web.1    |     from /Users/omkarjoshi/Projects/rubypodcatcher/.bundle/ruby/3.2.0/gems/devise-4.9.2/lib/devise/rails.rb:37:in `block in &lt;class:Engine>'
18:12:06 web.1    |     from /Users/omkarjoshi/Projects/rubypodcatcher/.bundle/ruby/3.2.0/gems/railties-7.1.1/lib/rails/initializable.rb:32:in `instance_exec'
18:12:06 web.1    |     from /Users/omkarjoshi/Projects/rubypodcatcher/.bundle/ruby/3.2.0/gems/railties-7.1.1/lib/rails/initializable.rb:32:in `run'</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:paragraph -->
<p class=""></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="">In this case, we have typically run the Rails application in our development environment using the <code>bin/dev</code> command and we use <code><a href="https://github.com/ddollar/foreman">foreman</a></code> in our <code>Procfile.dev</code>.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">The Fix:</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Create a separate environment variable file for our local environment:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code {"language":"bash"} -->
<pre class="wp-block-syntaxhighlighter-code"># .env.local

RAILS_MASTER_KEY=&lt;development_master_key></pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Explicitly specify this environment variable when foreman starts in Procfile.dev</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:syntaxhighlighter/code {"language":"bash"} -->
<pre class="wp-block-syntaxhighlighter-code"># Procfile.dev

exec foreman start -e .env.local -f Procfile.dev "$@"</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Why does this work?</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Earlier our Procfile.dev, simply started foreman using this command: <code>exec foreman start -f Procfile.dev "<em>$@</em>"</code>. This command automatically picks up the <code>.env</code> file which is present in the root directory.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">In our case, this <code>.env</code> file has configuration for the production environment which are required for Kamal.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">In our fix, we explicitly point foreman to a different "local" environment variable file which gets rid of this error.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p class="">Check out <a href="https://joshio1.blog/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">my Rails Kamal Series</a> for step by step guide to deploy Rails application using Kamal. </p>
<!-- /wp:paragraph -->
