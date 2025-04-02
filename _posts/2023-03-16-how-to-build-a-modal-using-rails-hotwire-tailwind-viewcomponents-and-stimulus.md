---
title: "How to build a modal using Rails Hotwire, Tailwind, ViewComponents and Stimulus"
date: 2023-03-16 12:59:44
categories: ['Hotwire', 'Modal', 'Rails', 'Rails', 'Ruby', 'RubyOnRails', 'Stimulus', 'TailwindCSS', 'ViewComponent']
---

<!-- wp:paragraph -->
<p>I was recently tasked with this feature to create a <a href="https://en.wikipedia.org/wiki/Modal_window">modal</a> in our <a href="https://m.signalvnoise.com/the-majestic-monolith/">Rails monolithic application</a> at work. This was the acceptance criteria in the ticket:<br></p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":370,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://joshio1.blog/wp-content/uploads/2023/03/image-1-1024x447.png" alt="" class="wp-image-370"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>Bit of background:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>We have an application where we show users their calendar. This calendar page shows slots according to the availability of the user.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>We would like to have a button on the Calendar page which opens a modal. In this modal, users would see their availability.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Users should be able to edit their availability on this modal and the calendar page should update in realtime. </li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>We have assumed that the code to actually update the availability already exists and it works. We will just work around that to build our modal which is the primary focus of this task. </li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>We'll get how to do this in a bit but this is how the finished product looks like:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":371,"sizeSlug":"large","linkDestination":"none","className":"border-1"} -->
<figure class="wp-block-image size-large border-1"><img src="https://joshio1.blog/wp-content/uploads/2023/03/image-2-1024x529.png" alt="" class="wp-image-371"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>Clicking on the <code>View/Edit availability</code> opens a modal which looks like this:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":372,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://joshio1.blog/wp-content/uploads/2023/03/image-3-1024x655.png" alt="" class="wp-image-372"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>Before we get into the details, I'll briefly talk write about the technologies we are going to implement this with:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li><a href="https://hotwired.dev/">Hotwire</a>: Rails Hotwire includes Turbo frames which allows you to swap frames without reloading the entire page. We are going to use this to load our modal data into a frame whenever user clicks on the <code>View/Edit availability</code> button.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="https://tailwindcss.com/">Tailwind CSS</a>: Tailwind is a utility based CSS framework which we are going to use to style our modals.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="https://viewcomponent.org/">ViewComponent</a>: ViewComponent is a library which allows us to modularize our "view" code such that it can be re-used and tested well. Other added benefits are that it creates a well-defined interface for our "views" and has good performance benchmarks.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="https://stimulus.hotwired.dev/">Stimulus</a>: Stimulus is this library from the folks at <a href="https://basecamp.com/">Basecamp</a> which allows us to use minimal javascript only when needed.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>Also, brief disclaimer that the code I am going to write in this post is just rough code which should give you an idea about how this works. It is not full-proof, complete and tested.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Step 1: Create <a href="https://guides.rubyonrails.org/routing.html">Rails routes</a> to view and edit the data in our modal</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Assumption:<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>You should have a Rails environment setup properly which is running and at least able to open the app in a browser.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>All the gems should be installed for the technologies mentioned above.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>We will start with creating normal Rails routes for viewing and updating the availability. For now, we can consider that users will be taken to a new page whenever someone clicks on the <code>View / Edit availability</code> button.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>In order to make the routes RESTful, I am going to add a notion of "Weekly Availability" which is a list of availabilities for days in a week. So, the name of my controller is going to be <code>WeeklyAvailabilitiesController</code> and we are going to have <code>#show </code>and <code>#update</code> actions in the controller.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>This is a rough draft of how the controller looks like:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class WeeklyAvailabilitiesController &lt; ApplicationController
  before_action :authenticate_user!

  def show
  end

  def update
    if current_user.update!(update_params)
      respond_to do |format|
        // TODO: Redirect successful response
      end
    else
      // TODO: Render unsuccessful response
    end
  end

  private

  def user_params
    params.require(:user).permit(availabilities_attributes: &#91;:id, :_destroy, :start_time, :end_time, :dow])
  end

end</code></pre>
<!-- /wp:code -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Of course, we will also have standard code in our views and our routes file when we create a resource like <code>resources :weekly_availabilities, only: [:show, :update]</code></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>We will also hook this up with the <code>View/Edit availability</code> button such that it should be linked with the <code>weekly_availabilities#show</code> action.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>However, important point is to note that the #show action opens in a different page or a new URL altogether when we click on the <code>View/Edit availability</code> button.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>Step 2: Move the #show action code to a ViewComponent</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>So right now we have standard code in our <code>show.html.erb</code>. This is the code which is automatically generated when we create a controller action. In this step, we will replace that code with a component.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>We create a new component called <code>weekly_availability_component</code>. This component will have code which displays the availabilities and also have a form where users can update their availabilities.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>We basically copy the code from <code>show.html.erb</code> and paste it into <code>weekly_availability_component.html.erb</code> .</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>However, using <code>view_component</code> gives us these added benefits:<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>We can now test our code by creating an instance of <code>WeeklyAvailabilityComponent</code> and assert how certain elements are going to look like on that page.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>We also have a clear separation where we pass variables to the component such as the <code>user</code> . i.e. this component is tasked with the responsibility of showing and updating the availability of the passed in user.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>We can now reuse this component on any other place in our app to achieve the same behavior.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>This is how the view component will roughly look like:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// availability_modal_component.html.erb

  &lt;%= form_for current_user, method: :patch, url: weekly_availability_path(current_user), html: { id: 'availability_form', class: 'bg-white' }, data: { turbo: false } do |f| %&gt;
    &lt;div&gt;
      &lt;div&gt;
        // Code to view availabilities and also change availabilities
      &lt;div&gt;
        &lt;%= f.submit 'Save' %&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;%- end %&gt;</code></pre>
<!-- /wp:code -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// availability_modal_component.rb

class AvailabilityModalComponent &lt; ViewComponent::Base
  attr_reader :current_user

  def initialize(current_user:)
    @current_user = current_user
  end
end</code></pre>
<!-- /wp:code -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Few things to note here are:<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>We are using<code> data: { turbo: false }</code> to submit the form. This means we will not use Turbo for submitting the form and it will just be a regular whole page update.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>This can be modified to use Turbo. However, right now, for brevity, we have skipped that. We have also skipped the actual implementation of viewing and modifying the availability since it is not relevant for us right now. </li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>Step 3: Adding a Turbo Frame so that the #show response opens on the same page.</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>This is the most crucial part and something that is different or new to Rails. After implementing this, we should be able to see our <code>week_availabilities#show</code> page on our calendar page itself where we have the button to <code>View/Edit availability</code></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>We start with declaring a <code>data: { turbo_frame: "weekly_availabilities_frame" }</code> on our <code>View / Edit availability</code> button. This will make sure that whenever we click this button, it will look for <code>weekly_availabilities_frame</code> in the response to this request. It will swap this <code>weekly_availabilities_frame</code> which is already on this page with this same frame from the response.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Hence, we'll need to also add a <code>weekly_availabilities_frame</code> to the current calendars page where we would like to see the frame after it is loaded.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>This can be done by simply adding a <code>turbo_frame_tag</code> like this:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>app/views/calendars/show.html.erb

// Other calendar#show view code

&lt;div class="align-self-center whitespace-nowrap mr-0 ml-auto"&gt;
  &lt;%= link_to "View/Edit availability", weekly_availability_path(viewer), data: { turbo_frame: "modal" }, class: "btn btn-outline-primary" %&gt;
&lt;/div&gt;

&lt;div class="container"&gt;
  &lt;%= turbo_frame_tag "<span style="background-color: initial; font-family: inherit; font-size: inherit; color: initial;">weekly_availabilities_frame</span>" %&gt;
&lt;/div&gt;

// other calendar#show view code</code></pre>
<!-- /wp:code -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>This would mean that the <code>weekly_availabilities_frame</code> from our response after clicking the button will be loaded in the <code>div.container</code></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Now, we need to also add the same frame in our response as well. Our response is nothing but the HTML from <code>availability_modal_component.html.erb</code> . We will just wrap that response with a <code>turbo_frame_tag</code>.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// availability_modal_component.html.erb

&lt;%= turbo_frame_tag "<span style="background-color: initial; font-family: inherit; font-size: inherit; color: initial;">weekly_availabilities_frame</span>" do %&gt;
  &lt;%= form_for current_user, method: :patch, url: weekly_availability_path(current_user), html: { id: 'availability_form', class: 'rounded-2xl bg-white h-full' }, data: { turbo: false } do |f| %&gt;
    &lt;div&gt;
      &lt;div&gt;
        // Code to view availabilities and also change availabilities
      &lt;div&gt;
        &lt;%= f.submit 'Save' %&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;%- end %&gt;
&lt;%- end %&gt;</code></pre>
<!-- /wp:code -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>With this change, whenever we click on the button, it should display the <code>AvailabilityModalComponent</code>'s html on the calendar page itself rather than opening on a new page with a different route. </li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>Step 4: Adding a modal such that the Turbo Frame now opens in a dialog</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Now, we already have the turbo frame content loading on the same calendar page which has the <code>View/Edit availability</code> button. Our next step is to load this turbo frame as a popup modal rather than directly embedded inside the calendar view.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>To do this, we remove the <code>turbo_frame_tag</code> which we have in the <code>app/views/calendars/show.html.erb</code> and rather put it in our layout file.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Let's say our calendar view is loaded inside a layout which is located at <code>app/layouts/application.html.erb</code>. We add this <code>turbo_frame_tag</code> inside our layout file below the <code>yield</code> statement.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;html&gt;
&lt;head&gt;
  &lt;%= stylesheet_pack_tag 'application' %&gt;
  &lt;%= stylesheet_link_tag 'fonts', media: 'all', 'data-turbo-track': 'reload' %&gt;
  &lt;%= javascript_pack_tag 'application', 'data-turbo-track': 'reload' %&gt;
  &lt;%= favicon_link_tag %&gt;
  &lt;%= csrf_meta_tags %&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;div class="flex"&gt;
  &lt;main class="bg-white"&gt;
    &lt;%= yield %&gt;
    &lt;div class="container"&gt;
      &lt;%= turbo_frame_tag "weekly_availabilities_frame" %&gt;
    &lt;/div&gt;
  &lt;/main&gt;
&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<!-- /wp:code -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>With this change, we have just moved our <code>turbo_frame_tag</code> from our view file to the layout file. It won't still open as a popup. </li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>To open it like a popup, we need to first make it look like a popup. This is where Tailwind comes in. Tailwind will make it look like a beautiful popup modal. We can go over to the Tailwind components and copy their custom code and paste it in out layout file inside the container class. I am going to be using the components from <a href="https://tailwindui.com/components/application-ui/overlays/modals">Tailwind UI</a> but we can use other modals as well.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>With this change, there will be a few divs and classes added which wrap the <code>turbo_frame_tag</code> in the application layout html file.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>This will make it look like a popup. Now, next step is to actually open the popup when the turbo frame loads. We are going to use a little bit of stimulus for this step. </li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Using stimulus, we will use some javascript to open the turbo frame content in a modal. </li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>We will first replace our &lt;div&gt; container element by a &lt;<code>dialog</code>&gt; element. If we call methods such as <code>showModal</code> on this HTML element, it will open the containing HTML as a popup modal.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Now, we just have to call these methods whenever the turbo frame loads. For this, we use a stimulus controller which will have the dialog as a target. </li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Inside the stimulus controller, we will have methods to <code>open</code> and <code>close</code> the modal. This is how the Stimulus controller looks like:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = &#91;"dialogPopup"]

    open(event) {
        event.preventDefault();

        this.dialogPopupTarget.showModal();
    }

    close(event) {
        event.preventDefault();

        this.dialogPopupTarget.close();
    }
}</code></pre>
<!-- /wp:code -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Now, we need to call the #open method whenever a frame is loaded. We need to call #close whenever the user presses the cancel button in the modal or if user updates the availability. i.e. user updates the form.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="https://turbo.hotwired.dev/reference/events">Turbo provides us with certain events</a> which are called during the lifecycle of a turbo frame load operation. We have a method called <code>turbo:frame-load</code> which is called whenever a frame completely loads. We have another event called turbo:submit-end.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>We call the <code>#open</code> method in the <code>turbo:frame-load</code> callback. We call the <code>#close</code> method in the <code>turbo:submit-end</code> callback and also in the <code>link_to</code> method of the <code>Cancel</code> button in the modal.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>This layout file now looks somewhat like this:</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;html&gt;
&lt;head&gt;
  &lt;%= stylesheet_pack_tag 'application' %&gt;
  &lt;%= stylesheet_link_tag 'fonts', media: 'all', 'data-turbo-track': 'reload' %&gt;
  &lt;%= javascript_pack_tag 'application', 'data-turbo-track': 'reload' %&gt;
  &lt;%= favicon_link_tag %&gt;
  &lt;%= csrf_meta_tags %&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;div class="flex"&gt;
  &lt;main class="bg-white"&gt;
    &lt;%= yield %&gt;
          &lt;div
            data-controller="modal"
            data-action="turbo:frame-load-&gt;modal#open turbo:submit-end-&gt;modal#close"
            data-modal-target="container"
          &gt;
            &lt;dialog data-modal-target="dialogPopup"&gt;
              &lt;div&gt;
                // Tailwind divs for showing a modal
                &lt;div&gt;
                    &lt;%= turbo_frame_tag "weekly_availabilities_frame" %&gt;
                &lt;/div&gt;
              &lt;/div&gt;
            &lt;/dialog&gt;
          &lt;/div&gt;
  &lt;/main&gt;
&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<!-- /wp:code -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>With this change, our turbo frames will load as a popup whenever user clicks on the <code>View/Edit availability</code> button. The popup will close whenever the user submits the form on the modal or closes the modal by pressing <code>Cancel</code></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>Phew! That's it! We have now built a modal using Rails Hotwire Turbo frames, Stimulus, ViewComponents and TailwindCSS. Please let me know in the comments if anything is unclear or if you have any ideas or suggestions.</p>
<!-- /wp:paragraph -->
