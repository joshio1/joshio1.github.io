---
title: "How to build a modal using Rails Hotwire, Tailwind, ViewComponents and Stimulus"
date: 2023-03-16 12:59:44
categories: ['Hotwire', 'Modal', 'Rails', 'Rails', 'Ruby', 'RubyOnRails', 'Stimulus', 'TailwindCSS', 'ViewComponent']
---

I was recently tasked with this feature to create a <a href="https://en.wikipedia.org/wiki/Modal_window">modal</a> in our <a href="https://m.signalvnoise.com/the-majestic-monolith/">Rails monolithic application</a> at work. This was the acceptance criteria in the ticket:

![](https://joshio1.blog/wp-content/uploads/2023/03/image-1-1024x447.png)

Bit of background:

- We have an application where we show users their calendar. This calendar page shows slots according to the availability of the user.
- We would like to have a button on the Calendar page which opens a modal. In this modal, users would see their availability.
- Users should be able to edit their availability on this modal and the calendar page should update in realtime.
- We have assumed that the code to actually update the availability already exists and it works. We will just work around that to build our modal which is the primary focus of this task.

We'll get how to do this in a bit but this is how the finished product looks like:

![](https://joshio1.blog/wp-content/uploads/2023/03/image-2-1024x529.png)

Clicking on the `View/Edit availability` opens a modal which looks like this:

![](https://joshio1.blog/wp-content/uploads/2023/03/image-3-1024x655.png)

Before we get into the details, I'll briefly talk write about the technologies we are going to implement this with:

- <a href="https://hotwired.dev/">Hotwire</a>: Rails Hotwire includes Turbo frames which allows you to swap frames without reloading the entire page. We are going to use this to load our modal data into a frame whenever user clicks on the `View/Edit availability` button.
- <a href="https://tailwindcss.com/">Tailwind CSS</a>: Tailwind is a utility based CSS framework which we are going to use to style our modals.
- <a href="https://viewcomponent.org/">ViewComponent</a>: ViewComponent is a library which allows us to modularize our "view" code such that it can be re-used and tested well. Other added benefits are that it creates a well-defined interface for our "views" and has good performance benchmarks.
- <a href="https://stimulus.hotwired.dev/">Stimulus</a>: Stimulus is this library from the folks at <a href="https://basecamp.com/">Basecamp</a> which allows us to use minimal javascript only when needed.

Also, brief disclaimer that the code I am going to write in this post is just rough code which should give you an idea about how this works. It is not full-proof, complete and tested.

## Step 1: Create <a href="https://guides.rubyonrails.org/routing.html">Rails routes</a> to view and edit the data in our modal

- Assumption:

You should have a Rails environment setup properly which is running and at least able to open the app in a browser.
- All the gems should be installed for the technologies mentioned above.




- We will start with creating normal Rails routes for viewing and updating the availability. For now, we can consider that users will be taken to a new page whenever someone clicks on the `View / Edit availability` button.
- In order to make the routes RESTful, I am going to add a notion of "Weekly Availability" which is a list of availabilities for days in a week. So, the name of my controller is going to be `WeeklyAvailabilitiesController` and we are going to have `#show`and `#update` actions in the controller.
- This is a rough draft of how the controller looks like:

```ruby
class WeeklyAvailabilitiesController < ApplicationController
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
    params.require(:user).permit(availabilities_attributes: [:id, :_destroy, :start_time, :end_time, :dow])
  end

end
```

- Of course, we will also have standard code in our views and our routes file when we create a resource like `resources :weekly_availabilities, only: [:show, :update]`
- We will also hook this up with the `View/Edit availability` button such that it should be linked with the `weekly_availabilities#show` action.
- However, important point is to note that the #show action opens in a different page or a new URL altogether when we click on the `View/Edit availability` button.

## Step 2: Move the #show action code to a ViewComponent

- So right now we have standard code in our `show.html.erb`{: .filepath}. This is the code which is automatically generated when we create a controller action. In this step, we will replace that code with a component.
- We create a new component called `weekly_availability_component`. This component will have code which displays the availabilities and also have a form where users can update their availabilities.
- We basically copy the code from `show.html.erb`{: .filepath} and paste it into `weekly_availability_component.html.erb`{: .filepath} .
- However, using `view_component` gives us these added benefits:

We can now test our code by creating an instance of `WeeklyAvailabilityComponent` and assert how certain elements are going to look like on that page.
- We also have a clear separation where we pass variables to the component such as the `user` . i.e. this component is tasked with the responsibility of showing and updating the availability of the passed in user.
- We can now reuse this component on any other place in our app to achieve the same behavior.



This is how the view component will roughly look like:


```html
// availability_modal_component.html.erb

  <%= form_for current_user, method: :patch, url: weekly_availability_path(current_user), html: { id: 'availability_form', class: 'bg-white' }, data: { turbo: false } do |f| %>
    
      
        // Code to view availabilities and also change availabilities
      
        <%= f.submit 'Save' %>
      
    
  <%- end %>
```

```ruby
// availability_modal_component.rb

class AvailabilityModalComponent < ViewComponent::Base
  attr_reader :current_user

  def initialize(current_user:)
    @current_user = current_user
  end
end
```

- Few things to note here are:

We are using`data: { turbo: false }` to submit the form. This means we will not use Turbo for submitting the form and it will just be a regular whole page update.
- This can be modified to use Turbo. However, right now, for brevity, we have skipped that. We have also skipped the actual implementation of viewing and modifying the availability since it is not relevant for us right now.




## Step 3: Adding a Turbo Frame so that the #show response opens on the same page.

- This is the most crucial part and something that is different or new to Rails. After implementing this, we should be able to see our `week_availabilities#show` page on our calendar page itself where we have the button to `View/Edit availability`
- We start with declaring a `data: { turbo_frame: "weekly_availabilities_frame" }` on our `View / Edit availability` button. This will make sure that whenever we click this button, it will look for `weekly_availabilities_frame` in the response to this request. It will swap this `weekly_availabilities_frame` which is already on this page with this same frame from the response.
- Hence, we'll need to also add a `weekly_availabilities_frame` to the current calendars page where we would like to see the frame after it is loaded.
- This can be done by simply adding a `turbo_frame_tag` like this:

```html
app/views/calendars/show.html.erb

// Other calendar#show view code


  <%= link_to "View/Edit availability", weekly_availability_path(viewer), data: { turbo_frame: "modal" }, class: "btn btn-outline-primary" %>



  <%= turbo_frame_tag "weekly_availabilities_frame" %>


// other calendar#show view code
```

- This would mean that the `weekly_availabilities_frame` from our response after clicking the button will be loaded in the `div.container`
- Now, we need to also add the same frame in our response as well. Our response is nothing but the HTML from `availability_modal_component.html.erb`{: .filepath} . We will just wrap that response with a `turbo_frame_tag`.

```html
// availability_modal_component.html.erb

<%= turbo_frame_tag "weekly_availabilities_frame" do %>
  <%= form_for current_user, method: :patch, url: weekly_availability_path(current_user), html: { id: 'availability_form', class: 'rounded-2xl bg-white h-full' }, data: { turbo: false } do |f| %>
    
      
        // Code to view availabilities and also change availabilities
      
        <%= f.submit 'Save' %>
      
    
  <%- end %>
<%- end %>
```

- With this change, whenever we click on the button, it should display the `AvailabilityModalComponent`'s html on the calendar page itself rather than opening on a new page with a different route.

## Step 4: Adding a modal such that the Turbo Frame now opens in a dialog

- Now, we already have the turbo frame content loading on the same calendar page which has the `View/Edit availability` button. Our next step is to load this turbo frame as a popup modal rather than directly embedded inside the calendar view.
- To do this, we remove the `turbo_frame_tag` which we have in the `app/views/calendars/show.html.erb`{: .filepath} and rather put it in our layout file.
- Let's say our calendar view is loaded inside a layout which is located at `app/layouts/application.html.erb`{: .filepath}. We add this `turbo_frame_tag` inside our layout file below the `yield` statement.

```html
<html>
<head>
  <%= stylesheet_pack_tag 'application' %>
  <%= stylesheet_link_tag 'fonts', media: 'all', 'data-turbo-track': 'reload' %>
  <%= javascript_pack_tag 'application', 'data-turbo-track': 'reload' %>
  <%= favicon_link_tag %>
  <%= csrf_meta_tags %>
</head>

<body>

  <main class="bg-white">
    <%= yield %>
    
      <%= turbo_frame_tag "weekly_availabilities_frame" %>
    
  </main>

</body>
</html>
```

- With this change, we have just moved our `turbo_frame_tag` from our view file to the layout file. It won't still open as a popup.
- To open it like a popup, we need to first make it look like a popup. This is where Tailwind comes in. Tailwind will make it look like a beautiful popup modal. We can go over to the Tailwind components and copy their custom code and paste it in out layout file inside the container class. I am going to be using the components from <a href="https://tailwindui.com/components/application-ui/overlays/modals">Tailwind UI</a> but we can use other modals as well.
- With this change, there will be a few divs and classes added which wrap the `turbo_frame_tag` in the application layout html file.
- This will make it look like a popup. Now, next step is to actually open the popup when the turbo frame loads. We are going to use a little bit of stimulus for this step.
- Using stimulus, we will use some javascript to open the turbo frame content in a modal.
- We will first replace our  container element by a <`dialog`> element. If we call methods such as `showModal` on this HTML element, it will open the containing HTML as a popup modal.
- Now, we just have to call these methods whenever the turbo frame loads. For this, we use a stimulus controller which will have the dialog as a target.
- Inside the stimulus controller, we will have methods to `open` and `close` the modal. This is how the Stimulus controller looks like:

```json
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["dialogPopup"]

    open(event) {
        event.preventDefault();

        this.dialogPopupTarget.showModal();
    }

    close(event) {
        event.preventDefault();

        this.dialogPopupTarget.close();
    }
}
```

- Now, we need to call the #open method whenever a frame is loaded. We need to call #close whenever the user presses the cancel button in the modal or if user updates the availability. i.e. user updates the form.
- <a href="https://turbo.hotwired.dev/reference/events">Turbo provides us with certain events</a> which are called during the lifecycle of a turbo frame load operation. We have a method called `turbo:frame-load` which is called whenever a frame completely loads. We have another event called turbo:submit-end.
- We call the `#open` method in the `turbo:frame-load` callback. We call the `#close` method in the `turbo:submit-end` callback and also in the `link_to` method of the `Cancel` button in the modal.
- This layout file now looks somewhat like this:

```html
<html>
<head>
  <%= stylesheet_pack_tag 'application' %>
  <%= stylesheet_link_tag 'fonts', media: 'all', 'data-turbo-track': 'reload' %>
  <%= javascript_pack_tag 'application', 'data-turbo-track': 'reload' %>
  <%= favicon_link_tag %>
  <%= csrf_meta_tags %>
</head>

<body>

  <main class="bg-white">
    <%= yield %>
          modal#open turbo:submit-end->modal#close"
            data-modal-target="container"
          >
            <dialog data-modal-target="dialogPopup">
              
                // Tailwind divs for showing a modal
                
                    <%= turbo_frame_tag "weekly_availabilities_frame" %>
                
              
            </dialog>
          
  </main>

</body>
</html>
```

- With this change, our turbo frames will load as a popup whenever user clicks on the `View/Edit availability` button. The popup will close whenever the user submits the form on the modal or closes the modal by pressing `Cancel`

Phew! That's it! We have now built a modal using Rails Hotwire Turbo frames, Stimulus, ViewComponents and TailwindCSS. Please let me know in the comments if anything is unclear or if you have any ideas or suggestions.
