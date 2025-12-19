---
title: "Custom Rails generators for creating and validating JSON APIs"
date: 2020-08-30 11:43:24
categories: ['Rails', 'Rails', 'Rails Generators', 'Rails JSON API Documentation', 'ruby on rails']
---

In the previous post, <a href="/posts/documentation-driven-development-with-apipie/">I wrote about how we can use APIPIE to document and validate a REST API</a>. We define the request response schema format in a separate file outside of our controller which helps manage and re-use several components in the schemas.

However, writing the schema file whenever you develop an API is still a tedious task. Ruby on Rails provides an inherent way to solve this problem:

Code generators.

Ruby on Rails ships with <a href="https://guides.rubyonrails.org/generators.html">support for code generators</a> by default. Ruby on Rails provides features using which you can <a href="https://guides.rubyonrails.org/command_line.html#rails-generate">create a basic scaffold for an application</a>, like a basic model, view, controller, tests and other related files. The  code generation is also customisable in a way which we can play with the defaults and also add custom generators. In general, Automatic code generation is a powerful concept in modern day programming. Automatic code generation offers these following benefits:
1. Saves time
2. Makes it easier to adhere to a convention throughout your code.
3. Minimises developer errors which could be caused because of blind copying and pasting of code.

I'll not bore you with the basic details of how you can customise Rails default generators and also add custom generators. It's pretty well-documented in the <a href="https://guides.rubyonrails.org/generators.html">Rails guides</a>. Let's jump right in to adding new generators for our purpose, i.e. defining API request / response schemas.

The basic problem we are trying to solve is building that structure of API request response schema files by hand. It's time consuming and tedious. Hence, I've created a generator called as API generator, which will help us with this task.

This is a snippet from my API generator which shows the parameters which this generator accepts:

*lib/generators/api/api_generator.rb:*

```ruby
# This class is used to define the generator which will be used to create request / response schema files.
class ApiGenerator < Rails::Generators::NamedBase
  source_root File.expand_path('templates', __dir__)
  argument :actions, type: :array, default: [], banner: "action1 action2"
  class_option :controller_schema_files, type: :boolean, default: true
  class_option :model_schema_file, type: :boolean, default: true
  class_option :controller_file, type: :boolean, default: true
  class_option :include_statement_in_controller, type: :boolean, default: false
```

Since the `ApiGenerator` extends from `Rails::Generators::NamedBase`, it takes a `name` as a mandatory parameter. This name will be the name of the controller in which this API will be placed. The name parameter can also contain namespaces like `api::v0::vehicles` or `api/v0/vehicles`. This parameter value will be the same as that the Rails default controller generator accepts.
Now, let's go over all the parameters one by one and its meaning:

`**controller_file**`: This parameter is to toggle whether you want to create a ***new*** controller file or not. By default a new controller file is always created. If you already have a controller file present in `app/controllers` directory and would like to add an API to an existing controller, you can pass `--no-controller-file` which would not create this controller file.

`**controller_schema_files**`: As we saw in the <a href="/posts/documentation-driven-development-with-apipie/">previous post,</a> the API request and response schema is actually defined in files in the schema directory. This flag is to toggle the ***creation*** of those files. By default, new request/response files are always created. However, if you already have request response schema files present and would like to add new APIs to existing schema files, you can pass `--no-controller-schema-files`.

`**actions**`: Actions is a list of space separated words which are nothing but the methods in our controller file. For eg. possible values can be `index`, `show`, `edit`, `create` etc. This will do these following things:
1. Create methods for actions inside the controller file.
2. Add API request response structure for actions inside the schema files.
3. A spec or a test is created for these actions.
For example: Here is a sample output after running `rails g api api::v0::documents index --no-controller-file --no-schema-files`

*schema/request/api/v0/documents_schema.rb:*

```ruby
module Request::Api::V0::DocumentsSchema
  def self.included(klazz)

  klazz.def_param_group :index_documents_request_schema do
  end
end
```

*schema/response/api/v0/documents_schema.rb:*

```ruby
module Response::Api::V0::DocumentsSchema
  def self.included(klazz)
  klazz.class_eval do
    include Response::DocumentSchema
  end

  klazz.def_param_group :index_documents_response_schema do
    param :status, String, :desc => "Status of the response"
    param :message, String, :desc => "Response message"
    param :data, Hash, :desc => "Response data" do
      param_group :document_response_schema
    end
  end
end
```

*app/controllers/api/v0/documents_controller.rb:*

```ruby
class Api::V0::DocumentsController < ApplicationController
  include Request::Api::V0::DocumentsSchema
  include Response::Api::V0::DocumentsSchema

  wrap_parameters false

  api!
  param_group :index_documents_request_schema
  returns :index_documents_response_schema, :code => 200, :desc => "Successful response"
  def index
    render_response(200, {response: {}})
  end
```

*spec/controllers/api/v0/documents_controller_spec.rb:*

```shell
require 'rails_helper'
require 'apipie/rspec/response_validation_helper'

RSpec.describe Api::V0::DocumentsController, type: :controller do

  describe "GET #index" do
    it "returns http success" do
      get :index
      expect(response).to have_http_status(:success)
      expect(response).to match_declared_responses
    end
  end
```

This is how we can define the API request response schema for the action `index` and link it back to the controller method `index`.  
Note that the flags `--no-controller-file` and `--no-schema-files` are just so that the controller file and schema files are not ***created***. The generator will assume that the files already exist and ***modify*** the files to add the corresponding actions.

**include_statement_in_controller**: This flag is pretty self-explanatory. A schema file is linked with the controller using the include statement on the controller. By default, a controller is created and include statement is injected into the controller at the top of the file.

**model_schema_file**: Now, comes the interesting part. If you see the response schema file in the above example(*schema/response/api/v0/documents_schema.rb*), you will see a reference to a param_group `document_response_schema`. This is a model schema and is defined in `schema/response/document_schema.rb`{: .filepath}. This schema is automatically generated by looking up the column data as defined in the `db/schema.rb`{: .filepath} file. This is with the assumption that generally in the response we send back the entire resource or a subset of the resource. This provides a quick way of generating a re-usable response schema DSL instead of going back and forth between the model columns and the response schema file. Here is a sample output for the model schema file:

*schema/response/document_schema.rb:*

```ruby
module Response
  module DocumentSchema
    def self.included(klazz)

      klazz.def_param_group :document_response_schema do
        param :id, Integer, required: true, desc: "integer value for id"
        param :status_id, Integer, required: false, desc: "integer value for status_id"
        param :name, String, required: false, desc: "string value for name"
        param :category, String, required: false, desc: "string value for category"
        param :resource_url, jsonb, required: false, desc: "jsonb value for resource_url"
        param :created_at, String, required: true, desc: "datetime value for created_at"
        param :updated_at, String, required: true, desc: "datetime value for updated_at"
      end
    end
  end
end
```

This is a set of all the columns defined in the documents table. You can create a subset out of this schema according to your API requirements. This provides a handy way instead of creating a schema DSL from the table columns.

This was how you can leverage the power of Rails generators to enforce a documentation driven development design. You can see how we are enforcing certain things like a standard response format, a test for every action and the documentation driven style of development itself. This goes a long way in maintaining the quality of the code.

Few more things which can be done to enhance these generators:
1. Create methods and tests according to the name of the actions. For eg. Currently, every action like create or update also is treated as a GET request. Instead of that, for a create request, we can create a schema with a route of POST, a test which calls the post method and a response code of 201 by default.
2. Add before_action methods on top of the controllers.

Bonus Tip:
* While using generators, use the `-p` flag to check which files will the generators modify. For eg. `rails g api vehicles --no--schema-files -p`
* Rails generators are reversible in a way such that they can be destroyed as they were created. Use the `rails d` flag to destroy the generators created using a certain configuration. For eg. `rails d api vehicles --no-schema-files -p` will destroy exactly the same files which it would have created.
