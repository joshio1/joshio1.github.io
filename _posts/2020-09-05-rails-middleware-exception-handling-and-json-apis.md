---
title: "Rails Middleware, Exception Handling and JSON APIs"
date: 2020-09-05 13:03:45
categories: ['Exception Handling', 'Rails JSON API', 'Uncategorized']
---

A Ruby on Rails web app is nothing but <a href="https://guides.rubyonrails.org/rails_on_rack.html">several Rack apps stacked on top of each other</a>. When a request is made to a Ruby on Rails web server, the request is passed along several Rack apps before it hits our controller code. The list of the Rails middleware that a request goes through can be figured by this command:

```ruby
rails middleware
```

```ruby
use Rack::Sendfile
use ActionDispatch::Static
use ActionDispatch::Executor
use ActiveSupport::Cache::Strategy::LocalCache::Middleware
use Rack::Runtime
use Rack::MethodOverride
use ActionDispatch::RequestId
use ActionDispatch::RemoteIp
use Sprockets::Rails::QuietAssets
use Rails::Rack::Logger
use ActionDispatch::ShowExceptions
use WebConsole::Middleware
use ActionDispatch::DebugExceptions
use ActionDispatch::Reloader
use ActionDispatch::Callbacks
use ActiveRecord::Migration::CheckPending
use ActionDispatch::Cookies
use ActionDispatch::Session::CookieStore
use ActionDispatch::Flash
use ActionDispatch::ContentSecurityPolicy::Middleware
use Rack::Head
use Rack::ConditionalGet
use Rack::ETag
use Rack::TempfileReaper
run MyApp::Application.routes
```

Above you can see the list of middleware a request goes through before it reaches the `MyApp::Application.routes` application. This application looks at the `config/routes.rb`{: .filepath} file to determine which controller method to call for this request. When the response is sent back from the controller method, these same middleware are invoked in the reverse order and popped off the stack one by one.

Now, as far as exception handling is concerned, these following middleware are important:

```shell
use ActionDispatch::ShowExceptions
use ActionDispatch::DebugExceptions
```

Let's look at what these are about:

`<a href="https://api.rubyonrails.org/classes/ActionDispatch/DebugExceptions.html">ActionDispatch::DebugExceptions</a>:` This middleware is responsible for logging exceptions. It shows a clean and concise backtrace. Also, if the request is local(i.e. in case of development environments), this middleware is responsible for showing the classic Rails HTML debugging page.

`<a href="https://api.rubyonrails.org/classes/ActionDispatch/ShowExceptions.html">ActionDispatch::ShowExceptions</a>:` This middleware is responsible to divert the error to a user configured exceptions app. An exceptions app (Rack app) can be created by the user if the user wants to change the way in which the error responses are rendered. This exceptions app can be set in the Rails application config and then this middleware redirects the exceptions to the configured app by calling routes such as /500.html or /422.html, depending on the status code and response of the error.

Many applications over-engineer on exception handling. These are some of the patterns which I have seen:
- Re-raising errors without actually doing anything with it.
- Losing out on information contained in the error. This includes the stack-trace about where the error occurred, error message and exception class.
- Not logging the error

In general, it's not needed to handle exceptions in our application code. i.e. I can even say that there is no need for any `rescue` blocks in your `app/controllers`, `app/models` directory. Exception handling code is only needed for explicit `raise` statements in case of things like custom validations. Even in this case, you do not need any `rescue` blocks since the exceptions can be rescued at a global level, like in an application controller base class. (Rescuing can only be needed in some cases like when a Sidekiq worker action needs to be rescued for some reason)

If exceptions are handled at a global level, the application code(models and controller) becomes clean, clear and concise. Also, we can print the error and log the backtrace at one single point in our code.

We can write our own middleware to handle these errors at a global level. I've written a <a href="https://github.com/joshio1/beekeeper">gem</a> which handles these errors, logs them and renders a response. Check it out and feel free to send PRs, if you want to see any new features in it.

References:

- Beekeeper Gem - <a href="https://github.com/joshio1/beekeeper">https://github.com/joshio1/beekeeper</a>
- Rails on Rack - <a href="https://guides.rubyonrails.org/rails_on_rack.html">https://guides.rubyonrails.org/rails_on_rack.html</a>
- Rails Action Controller guide - <a href="https://edgeguides.rubyonrails.org/action_controller_overview.html">https://edgeguides.rubyonrails.org/action_controller_overview.html</a>
