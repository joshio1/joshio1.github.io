---
title: "Favorite Ruby Gems Series – Episode #1 – annotate"
date: 2023-03-04 07:16:35
categories: ['annotate', 'annotate gem', 'Favorite Ruby Gems', 'rails annotate gem', 'rails gems', 'ruby gems']
---

<!-- wp:paragraph -->
<p>I am going to start a series where I write about some of my favorite gems in Ruby / Ruby on Rails. These gems are in no specific order. I would like to start this series with the <a href="https://github.com/ctran/annotate_models">annotate gem</a>.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>What is this annotate gem?</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>The <a href="https://github.com/ctran/annotate_models">annotate gem</a> adds metadata in your Rails code about your database schema. To be more specific, it adds a bunch of comments to the top of your model files, factory files. These comments are well-formatted and tell us more about the underlying database schema of that specific model file or factory file.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>Why is the annotate gem useful?</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>So, let's say you are working on a model file to add new public method or you are writing test for a model class. In case you would like to know what are the names of the columns in the table for this class or you would like to know which foreign key this table holds, you would usually go to the <code>db/schema.rb</code> file or <code>db/schema.sql</code> file.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>This gem essentially avoids that trip. You can just scroll to the top of the class and you'd instantly know what is the database schema for this particular table that you are working on.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>This is super useful if you are new to a code-base and are not familiar with the database schema. </li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Even if you are not new to a code-base, this gem is very helpful because it quickly tells you about  things like the data-type of a column, which constraints it has or what indices this table has.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Also, the comments are automatically generated / updated whenever someone runs a migration so the onboarding process is super simple.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>How to install the annotate gem?</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Head over to their <a href="https://github.com/ctran/annotate_models#install">github repository</a> and follow the instructions from that page.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>In case you would like to avoid that hop, these are the instructions:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code># Add gem to your gemfile

group :development do
  gem 'annotate'
end

# Perform a bundle install
bundle install

# This command will annotate your models
bundle exec annotate --models

# Create annotate config file so that we can always annotate on running migrations (Optional)
bundle exec rails g annotate:install</code></pre>
<!-- /wp:code -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>There are a bunch of other configuration options. You can also head over to the <a href="https://github.com/ctran/annotate_models#configuration-in-rails">Github Repo</a> to find out more.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading {"level":3} -->
<h3>Are there any drawbacks?</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Well, it can get a little confusing if you have multiple people working on the same model and if you do a lot of rolling-back of migrations, you might get some merge conflicts where you would have to be cautious.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Make sure you only add this gem on <code>development</code> mode because it's not needed in other environments.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading {"level":3} -->
<h3>Final thoughts?</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Overall, I really like this gem for the convenience it provides. It is one of the first gems I add when working with a new codebase. </li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->
