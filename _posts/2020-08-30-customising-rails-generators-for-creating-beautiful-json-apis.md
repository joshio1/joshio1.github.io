---
title: "Custom Rails generators for creating and validating JSON APIs"
date: 2020-08-30 11:43:24
categories: ['Rails', 'Rails', 'Rails Generators', 'Rails JSON API Documentation', 'ruby on rails']
---

<!-- wp:paragraph -->
<p>In the previous post, <a href="https://joshio1.blog/documentation-driven-development-with-apipie/">I wrote about how we can use APIPIE to document and validate a REST API</a>. We define the request response schema format in a separate file outside of our controller which helps manage and re-use several components in the schemas.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>However, writing the schema file whenever you develop an API is still a tedious task. Ruby on Rails provides an inherent way to solve this problem:<br><br>Code generators.<br><br>Ruby on Rails ships with <a href="https://guides.rubyonrails.org/generators.html">support for code generators</a> by default. Ruby on Rails provides features using which you can <a href="https://guides.rubyonrails.org/command_line.html#rails-generate">create a basic scaffold for an application</a>, like a basic model, view, controller, tests and other related files. The  code generation is also customisable in a way which we can play with the defaults and also add custom generators. In general, Automatic code generation is a powerful concept in modern day programming. Automatic code generation offers these following benefits:<br>1. Saves time<br>2. Makes it easier to adhere to a convention throughout your code.<br>3. Minimises developer errors which could be caused because of blind copying and pasting of code.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>I'll not bore you with the basic details of how you can customise Rails default generators and also add custom generators. It's pretty well-documented in the <a href="https://guides.rubyonrails.org/generators.html">Rails guides</a>. Let's jump right in to adding new generators for our purpose, i.e. defining API request / response schemas.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The basic problem we are trying to solve is building that structure of API request response schema files by hand. It's time consuming and tedious. Hence, I've created a generator called as API generator, which will help us with this task.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>This is a snippet from my API generator which shows the parameters which this generator accepts:<br><br><em>lib/generators/api/api_generator.rb:</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code># This class is used to define the generator which will be used to create request / response schema files.
class ApiGenerator &lt; Rails::Generators::NamedBase
  source_root File.expand_path('templates', __dir__)
  argument :actions, type: :array, default: &#91;], banner: "action1 action2"
  class_option :controller_schema_files, type: :boolean, default: true
  class_option :model_schema_file, type: :boolean, default: true
  class_option :controller_file, type: :boolean, default: true
  class_option :include_statement_in_controller, type: :boolean, default: false</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>Since the <code>ApiGenerator</code> extends from <code>Rails::Generators::NamedBase</code>, it takes a <code>name</code> as a mandatory parameter. This name will be the name of the controller in which this API will be placed. The name parameter can also contain namespaces like <code>api::v0::vehicles</code> or <code>api/v0/vehicles</code>. This parameter value will be the same as that the Rails default controller generator accepts.<br>Now, let's go over all the parameters one by one and its meaning:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><code><strong>controller_file</strong></code>: This parameter is to toggle whether you want to create a <strong><em>new</em></strong> controller file or not. By default a new controller file is always created. If you already have a controller file present in <code>app/controllers</code> directory and would like to add an API to an existing controller, you can pass <code>--no-controller-file</code> which would not create this controller file. </p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><code><strong>controller_schema_files</strong></code>: As we saw in the <a href="https://joshio1.blog/documentation-driven-development-with-apipie/">previous post,</a> the API request and response schema is actually defined in files in the schema directory. This flag is to toggle the <strong><em>creation</em></strong> of those files. By default, new request/response files are always created. However, if you already have request response schema files present and would like to add new APIs to existing schema files, you can pass <code>--no-controller-schema-files</code>.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><code><strong>actions</strong></code>: Actions is a list of space separated words which are nothing but the methods in our controller file. For eg. possible values can be <code>index</code>, <code>show</code>, <code>edit</code>, <code>create</code> etc. This will do these following things:<br>1. Create methods for actions inside the controller file.<br>2. Add API request response structure for actions inside the schema files.<br>3. A spec or a test is created for these actions.<br>For example: Here is a sample output after running <code>rails g api api::v0::documents index --no-controller-file --no-schema-files</code><br><br><em>schema/request/api/v0/documents_schema.rb:</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>module Request::Api::V0::DocumentsSchema
  def self.included(klazz)

  klazz.def_param_group :index_documents_request_schema do
  end
end</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p><em>schema/response/api/v0/documents_schema.rb:</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>module Response::Api::V0::DocumentsSchema
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
end</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p><em>app/controllers/api/v0/documents_controller.rb:</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class Api::V0::DocumentsController &lt; ApplicationController
  include Request::Api::V0::DocumentsSchema
  include Response::Api::V0::DocumentsSchema

  wrap_parameters false

  api!
  param_group :index_documents_request_schema
  returns :index_documents_response_schema, :code => 200, :desc => "Successful response"
  def index
    render_response(200, {response: {}})
  end</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p><em>spec/controllers/api/v0/documents_controller_spec.rb:</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>require 'rails_helper'
require 'apipie/rspec/response_validation_helper'

RSpec.describe Api::V0::DocumentsController, type: :controller do

  describe "GET #index" do
    it "returns http success" do
      get :index
      expect(response).to have_http_status(:success)
      expect(response).to match_declared_responses
    end
  end</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p><br>This is how we can define the API request response schema for the action <code>index</code> and link it back to the controller method <code>index</code>.  <br>Note that the flags <code>--no-controller-file</code> and <code>--no-schema-files</code> are just so that the controller file and schema files are not <strong><em>created</em></strong>. The generator will assume that the files already exist and <strong><em>modify</em></strong> the files to add the corresponding actions.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>include_statement_in_controller</strong>: This flag is pretty self-explanatory. A schema file is linked with the controller using the include statement on the controller. By default, a controller is created and include statement is injected into the controller at the top of the file.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>model_schema_file</strong>: Now, comes the interesting part. If you see the response schema file in the above example(<em>schema/response/api/v0/documents_schema.rb</em>), you will see a reference to a param_group <code>document_response_schema</code>. This is a model schema and is defined in <code>schema/response/document_schema.rb</code>. This schema is automatically generated by looking up the column data as defined in the <code>db/schema.rb</code> file. This is with the assumption that generally in the response we send back the entire resource or a subset of the resource. This provides a quick way of generating a re-usable response schema DSL instead of going back and forth between the model columns and the response schema file. Here is a sample output for the model schema file:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><em>schema/response/document_schema.rb:</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>module Response
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
end</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>This is a set of all the columns defined in the documents table. You can create a subset out of this schema according to your API requirements. This provides a handy way instead of creating a schema DSL from the table columns.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>This was how you can leverage the power of Rails generators to enforce a documentation driven development design. You can see how we are enforcing certain things like a standard response format, a test for every action and the documentation driven style of development itself. This goes a long way in maintaining the quality of the code.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Few more things which can be done to enhance these generators:<br>1. Create methods and tests according to the name of the actions. For eg. Currently, every action like create or update also is treated as a GET request. Instead of that, for a create request, we can create a schema with a route of POST, a test which calls the post method and a response code of 201 by default.<br>2. Add before_action methods on top of the controllers.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Bonus Tip:<br>* While using generators, use the <code>-p</code> flag to check which files will the generators modify. For eg. <code>rails g api vehicles --no--schema-files -p</code><br>* Rails generators are reversible in a way such that they can be destroyed as they were created. Use the <code>rails d</code> flag to destroy the generators created using a certain configuration. For eg. <code>rails d api vehicles --no-schema-files -p</code> will destroy exactly the same files which it would have created. <br></p>
<!-- /wp:paragraph -->
