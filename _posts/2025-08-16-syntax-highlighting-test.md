---
layout: post
title: "Syntax Highlighting Test"
date: 2025-08-16 01:50:00 +0530
categories: [test, syntax]
---

# Syntax Highlighting Test

This post tests the syntax highlighting across different programming languages.

## Ruby Code

```ruby
class User < ApplicationRecord
  has_many :posts, dependent: :destroy
  validates :email, presence: true, uniqueness: true
  
  def full_name
    "#{first_name} #{last_name}"
  end
  
  private
  
  def generate_token
    SecureRandom.hex(16)
  end
end
```

## JavaScript Code

```javascript
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const userData = await response.json();
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};
```

## HTML/ERB Code

```erb
<div class="user-profile">
  <h1><%= @user.full_name %></h1>
  
  <% if @user.posts.any? %>
    <div class="posts">
      <% @user.posts.each do |post| %>
        <article class="post">
          <h2><%= link_to post.title, post_path(post) %></h2>
          <p><%= truncate(post.content, length: 150) %></p>
          <time><%= post.created_at.strftime("%B %d, %Y") %></time>
        </article>
      <% end %>
    </div>
  <% else %>
    <p>No posts yet.</p>
  <% end %>
</div>
```

## CSS Code

```css
.highlight {
  background-color: #272822;
  color: #f8f8f2;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.highlight .k { color: #66d9ef; } /* Keywords */
.highlight .s { color: #e6db74; } /* Strings */
.highlight .c { color: #75715e; } /* Comments */
```

## Bash/Shell Code

```bash
#!/bin/bash

# Deploy script
echo "Starting deployment..."

bundle install
bundle exec rails db:migrate
bundle exec rails assets:precompile

if [ $? -eq 0 ]; then
  echo "Deployment successful!"
  sudo systemctl restart myapp
else
  echo "Deployment failed!"
  exit 1
fi
```

The syntax highlighting should now be consistent across all pages with proper colors and dark theme!
