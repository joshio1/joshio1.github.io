---
title: "Documentation Driven Development with Apipie"
date: 2020-08-16 07:52:55
categories: ['apipie', 'documentation', 'Rails', 'rails api documentation', 'Rails JSON API', 'Rails JSON API Documentation', 'REST API Documentation', 'ruby on rails']
---

Have you ever had to scavenge through the source code just to figure out how to use the damn REST API?

Have you ever had a bug because the front-end was expecting a response in a different format?

Well, the solution to these problems is one of the most dreaded words as far as developers are concerned.

Documentation.

Documentation is one of the most <a href="https://www.researchgate.net/publication/215566206_Necessary_and_Neglected_An_Empirical_Study_of_Internal_Documentation_in_Agile_Software_Development_Teams">neglected aspects</a> in Software Development(Maybe, unit testing comes a close second?). Especially, if it's not part of the <a href="https://en.wikipedia.org/wiki/Code_review">code review</a> process, writing documentation is like exercise. You really gotta have a good discipline. And the benefits are more long-term than short-term. However, it's one of those things which can either make you or break you. Or, at least your software product.

There are several levels of documentations required in creating a successful software product. For eg. Documentation of user stories or use-cases, <a href="https://en.wikipedia.org/wiki/Product_requirements_document">PRDs</a> or product requirement documentation, release or change-log documentation. The documentation I am going to talk about is API documentation. 
API documentation is the contract which needs to be established using which the frontend will consume the backend APIs. If such a contract is established and **documented**, frontend and backend teams can scale independently and work in parallel. Not just during the development process, documentation also serves as an important tool when onboarding new developers into a team.

Let's talk about different ways you can document an API:

- Inline documentation
- External documentation

Inline documentation is the documentation which is inline in code. This can be in the form of comments, annotations over methods or comment blocks decorated over methods. 
External documentation is the documentation which resides in a different place, like maybe on <a href="https://www.atlassian.com/software/confluence">Confluence</a> or a Wiki or any other external place which is not directly linked with your code-base. This has a benefit of being available to a larger audience and can be made more user-friendly.

Inline documentation has the risk of polluting the actual code or business logic of your application. Also, things like comments in your code are also frowned upon by many developers with the premise that the code itself should be self-documenting as much as possible. 
External documentation has the risk of being out of date since it is not closely coupled with the code it describes. It becomes one more additional  manual task as part of the software development process which relies on developers to do their due diligence. And simply put, developers <a href="https://www.theregister.com/2012/08/03/bad_algorithm_lost_440_million_dollars/">can't</a> <a href="https://www.techrepublic.com/article/report-software-failure-caused-1-7-trillion-in-financial-losses-in-2017/">be</a> <a href="https://en.wikipedia.org/wiki/Year_2000_problem">trusted</a>.

Hence, the ideal solution should be some kind of documentation which is not polluting your actual code but also automatically generating an external user-friendly stylised documentation. One such tool I found which does all this for <a href="https://rubyonrails.org/">Ruby on Rails</a> APIs is <a href="https://github.com/Apipie/apipie-rails">apipie</a>.

<a href="https://github.com/Apipie/apipie-rails">APIPIE</a> has a feature where you can just annotate your controller action with an `api!` statement and it generates an <a href="https://github.com/Apipie/apipie-rails/raw/master/images/screenshot-1.png">HTML documentation</a> which is user-friendly and can be consumed by the front-end developers. It also has a nice feature where it can be divided into re-usable blocks called as `<a href="https://github.com/Apipie/apipie-rails#dry-with-param-group">param_group</a>` which can be defined in other files (out of the controller) and then linked back to the controller action. This helps in not polluting the actual code base with large documentation blocks. As an added bonus, it also generates <a href="https://swagger.io/specification/">Swagger</a> JSON for the API request / response schema which you have defined and provides a simple <a href="https://github.com/Apipie/apipie-rails#response-validation">one-liner matcher</a> which can be used in a test to check whether the API conforms to the schema defined in the `api!` block.

But you may say - Okay, all this is great, but you still have this manual step in the software development process of adding documentation after you are done developing your API, right?
Wrong.
This is where documentation-driven-development comes into picture. Lovingly called as DDD.

The idea is: You write the documentation of the API first. i.e. define the contract of the API first, write a simple test which checks whether the API conforms to the contract(schema) and only then you start implementing the API. In the API, you write code such that it passes this test or returns a response in the manner it is defined in the schema.

Now, let's see how APIPIE helps us do that.

**STEP 1: Define the request / response schema on top of the controller method**.

*app/controllers/api/v0/events_controller.rb:*

```ruby
api :POST, '/v0/events', "Creates an event"
  param_group :create_event_request_schema
  returns :create_event_response_schema, :code => 201, :desc => "An event"
  def create
  end
```



Note that we are not defining the entire request schema here: We are just referring to a param_group called `create_event_request_schema` for request and `create_event_response_schema` for response. These `param_group` are defined elsewhere so that they do not overwhelm our controller code.

We define a structure so that we can define these "schemas" in a separate place. We will define these schemas as Ruby modules and include them as mixins in our controller:

*app/controllers/api/v0/events_controller.rb:*

```ruby
class Api::V0::EventsController < ApplicationController
  include Request::Api::V0::EventsSchema
  include Response::Api::V0::EventsSchema
```



The schema files are kept in a separate directory called "schema" which is auto-loaded. The request schema is located at `schema/request/api/v0/events_schema.rb`{: .filepath}  and response schema is located at `schema/response/api/v0/events_schema.rb`{: .filepath}. This allows us to scale request and response schema files separately. You could have a strategy where you store the request and response files together for a single controller. However, with the scale of our application, we found this to be a better separation.

*schema/request/api/v0/events_schema.rb:*

```ruby
module Request::Api::V0::EventsSchema
  def self.included(klazz)
    klazz.def_param_group :create_event_request_schema       do
      meta :authentication => [:validate_user_token]
      formats ['json', 'jsonp']
      tags %w[agent-app]
      error :code => 401, :desc => "Unauthorized"
      error :code => 400, :desc => "Bad Request"
      param :start_time, :number, :required => true, :desc => "time when the event will start. (in unix epoch)"
    end
  end
end
```

*schema/response/api/v0/events_schema.rb:*

```ruby
module Response::Api::V0::EventsSchema
  def self.included(klazz)
    klazz.def_param_group :event_response_schema do
      param :message, String, :desc => "Response message"
      param :response, Hash, :desc => "Event Details" do
        property :event_title, String
        property :start_time, :number
        property :end_time, :number
      end
    end
  end
end
```

**STEP 2: Define a basic test which validates the API conforming to the above defined schema.**

*spec/controllers/api/v0/events_controller_spec.rb:*

```json
require "rails_helper"
require 'apipie/rspec/response_validation_helper'

RSpec.describe Api::V0::LeadEventsController, type: :controller, :show_in_doc => true do
  describe "Create events" do
    it "returns a successful response and conforms to the schema" do
      post :create, :params => {start_time: Time.now}
      expect(JSON.parse(response.body)["errors"]).to be_falsey
      expect(response).to have_http_status(:created)
      expect(response).to match_declared_responses
    end
  end
end
```

Here, `expect(response).to match_declared_responses` is  a one-liner matcher provided by APIPIE which checks whether the API response matches the schema defined for the API inside the `returns` block. This matches checks the required keys, their structure along with their validator types. This can be a good starting point for a controller test or request spec. It can be supplemented further with other required assertions.

**Step 3: Define the actual content inside the controller `create` action.**

**Step 4: Run the test using `rake` to check whether the response returned by the API is matching the defined schema.**

**Step 5: Publish the API and the documentation.**

You can view the documentation webpage HTML for your defined request response schema by adding the routes for APIPIE(when you first add the APIPIE gem to your Rails app). The default documentation URL is: `<server_ip>/apipie`

Documentation automatically generated by APIPIE looks like this:

![](/assets/images/2020/08/image-1-1024x865.png)

Bonus Tip: If you run `APIPIE_RECORD=examples rake test`, APIPIE will <a href="https://github.com/Apipie/apipie-rails#examples-recording">record the request response params</a> used while running your test and display them as examples on this documentation webpage.

**Step 6: Finito. This was how you can use APIPIE to create a documentation driven development workflow while developing your API.**

TODO:

- Add code generators for creating API schema files and sample test body. (Future blog post, possibly?)
- Remove strong-parameter dependency. Currently, the API request format need to be again defined in strong params, so that you can permit the necessary params. This results in duplicate definition of your schema. It will be great if we can just rely on APIPIE itself to validate the params and permit only necessary params. (Future blog post?)

References:

- <a href="https://github.com/Apipie/apipie-rails">https://github.com/Apipie/apipie-rails</a>
- <a href="https://github.com/joshio1/apipie-rails">https://github.com/joshio1/apipie-rails</a>
- <a href="https://collectiveidea.com/blog/archives/2014/04/21/on-documentation-driven-development">https://collectiveidea.com/blog/archives/2014/04/21/on-documentation-driven-development</a>
- <a href="https://docs.microsoft.com/en-us/archive/blogs/davidlem/documentation-driven-development">https://docs.microsoft.com/en-us/archive/blogs/davidlem/documentation-driven-development</a>
