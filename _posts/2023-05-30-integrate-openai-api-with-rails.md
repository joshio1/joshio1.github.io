---
title: "Integrate OpenAI API with Rails"
date: 2023-05-30 11:03:20
categories: ['ChatGPT', 'OpenAI', 'OpenAIAPI', 'Rails', 'Rails ChatGPT', 'Rails Open AI', 'Rails OpenAI API']
---

ChatGPT and OpenAI is definitely the rage right now. I'm specifically amazed by the reach of this technology more than anything else. I'd argue that going by this trend, ChatGPT might reach more users than a smart-phone ever did. It's *that* huge.

Given this trend, it's only logical that we as Ruby on Rails developers also jump on this bandwagon. This is my attempt at integrating OpenAI API with a Rails application. I'll also show you one possible approach of how you can design the code around this. Feel free to use this as the base and develop something fun on top of this.

Pre-requisites:

- OpenAI API key
- Working Rails application

Installation:

- Add the openai gem to your `Gemfile`

```ruby
# OpenAI library
gem "ruby-openai"
```

- Run `bundle install` to install this gem.

How to call the API and design your classes:

1. Create a class called `app/models/ai.rb`{: .filepath}

```ruby
class Ai
  def self.answer(prompt:)
    client = OpenAI::Client.new(access_token: Rails.application.credentials.fetch(:open_ai_secret_key))

    response = client.chat(
      parameters: {
        model: "gpt-3.5-turbo", # Required.
        messages: [{ role: "user", content: prompt}], # Required.
        temperature: 0.7,
      })

    response.dig("choices", 0, "message", "content")
  end
end
```

- This class can serve as a basic abstraction for calling any AI API.
- It has a single method called `answer` which accepts a prompt and returns an answer from the API library.
- Using this abstraction, we can plug-n-play with different AI libraries such as `<a href="https://github.com/hwchase17/langchain" data-type="URL" data-id="https://github.com/hwchase17/langchain">langchain</a>` or Google Bard API.

2. Create a class which is specific to the business logic of your app. Something like: `app/models/my_app_ai.rb`{: .filepath}

```ruby
class MyAppAi
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
end
```

TODO:

- In the current implementation, we have just asked the prompt using the `user` role. However, we can make this method more advanced by also having support for `system` messages in this method.

See <a href="https://community.openai.com/t/the-system-role-how-it-influences-the-chat-behavior/87353" data-type="URL" data-id="https://community.openai.com/t/the-system-role-how-it-influences-the-chat-behavior/87353">here</a> for more information about a system role



Also, currently, we are using this `Ai` class only for the completion use-case. However, we can use it similarly for other AI use-cases.

The prompt management that I've done here is also fairly basic. We can build on this to do something more sophisticated.


Example:

- To see how I have made use of AI in real-life, you can have a look at the product I'm building which is <a href="https://jargonnay.com" data-type="URL" data-id="https://jargonnay.com">jargonnay.com</a>

It is a "jargon-manager" powered by AI.
- It is free currently for MAC users. Head over to the website, feel free to try it out and drop me some feedback.
