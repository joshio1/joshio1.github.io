---
title: "Integrate OpenAI API with Rails"
date: 2023-05-30 11:03:20
categories: ['ChatGPT', 'OpenAI', 'OpenAIAPI', 'Rails', 'Rails ChatGPT', 'Rails Open AI', 'Rails OpenAI API']
---

<!-- wp:paragraph -->
<p>ChatGPT and OpenAI is definitely the rage right now. I'm specifically amazed by the reach of this technology more than anything else. I'd argue that going by this trend, ChatGPT might reach more users than a smart-phone ever did. It's *that* huge.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Given this trend, it's only logical that we as Ruby on Rails developers also jump on this bandwagon. This is my attempt at integrating OpenAI API with a Rails application. I'll also show you one possible approach of how you can design the code around this. Feel free to use this as the base and develop something fun on top of this.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Pre-requisites:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>OpenAI API key</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Working Rails application</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>Installation:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Add the openai gem to your <code>Gemfile</code></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code># OpenAI library
gem "ruby-openai"</code></pre>
<!-- /wp:code -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Run <code>bundle install</code> to install this gem.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>How to call the API and design your classes:</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->
<ol><!-- wp:list-item -->
<li>Create a class called <code>app/models/ai.rb</code></li>
<!-- /wp:list-item --></ol>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class Ai
  def self.answer(prompt:)
    client = OpenAI::Client.new(access_token: Rails.application.credentials.fetch(:open_ai_secret_key))

    response = client.chat(
      parameters: {
        model: "gpt-3.5-turbo", # Required.
        messages: &#91;{ role: "user", content: prompt}], # Required.
        temperature: 0.7,
      })

    response.dig("choices", 0, "message", "content")
  end
end</code></pre>
<!-- /wp:code -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>This class can serve as a basic abstraction for calling any AI API.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>It has a single method called <code>answer</code> which accepts a prompt and returns an answer from the API library.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Using this abstraction, we can plug-n-play with different AI libraries such as <code><a href="https://github.com/hwchase17/langchain" data-type="URL" data-id="https://github.com/hwchase17/langchain">langchain</a></code> or Google Bard API.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>     2. Create a class which is specific to the business logic of your app. Something like: <code>app/models/my_app_ai.rb</code></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class MyAppAi
  def initialize(question:, current_user:)
    @question = question
    @current_user = current_user
  end

  def jargon_meaning
    Ai.answer(prompt: prompt)
  end

  private

  def prompt
    prefix_prompt + "Please answer this question in the most concise way possible: \"#{@question}?\" "
  end

  def prefix_prompt
    if @current_user.profession.present?
      "For a person who is a #{@current_user.profession} professional, "
    end
  end
end</code></pre>
<!-- /wp:code -->

<!-- wp:list {"ordered":true} -->
<ol><!-- wp:list-item -->
<li></li>
<!-- /wp:list-item --></ol>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>TODO:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>In the current implementation, we have just asked the prompt using the <code>user</code> role. However, we can make this method more advanced by also having support for <code>system</code> messages in this method.<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>See <a href="https://community.openai.com/t/the-system-role-how-it-influences-the-chat-behavior/87353" data-type="URL" data-id="https://community.openai.com/t/the-system-role-how-it-influences-the-chat-behavior/87353">here</a> for more information about a system role</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Also, currently, we are using this <code>Ai</code> class only for the completion use-case. However, we can use it similarly for other AI use-cases.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>The prompt management that I've done here is also fairly basic. We can build on this to do something more sophisticated.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Example:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>To see how I have made use of AI in real-life, you can have a look at the product I'm building which is <a href="https://jargonnay.com" data-type="URL" data-id="https://jargonnay.com">jargonnay.com</a><!-- wp:list -->
<ul><!-- wp:list-item -->
<li>It is a "jargon-manager" powered by AI.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>It is free currently for MAC users. Head over to the website, feel free to try it out and drop me some feedback.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->
