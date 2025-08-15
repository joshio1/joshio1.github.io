---
layout: post
title: "Enhanced Syntax Highlighting Demo"
date: 2025-01-15 12:00:00 +0530
categories: [jekyll, demo, coding]
tags: [syntax-highlighting, code, ruby, javascript, python]
description: "Demonstrating the enhanced syntax highlighting and code block features"
---

This post demonstrates the enhanced syntax highlighting and code block features that have been added to this Jekyll blog.

## Ruby Code Example

Here's a Ruby method with enhanced syntax highlighting:

{% highlight ruby %}
class BlogPost
  attr_reader :title, :content, :published_at
  
  def initialize(title, content)
    @title = title
    @content = content
    @published_at = Time.current
  end
  
  def publish!
    return false if published?
    
    self.published_at = Time.current
    save!
    
    # Send notifications
    NotificationService.new(self).send_publication_notice
    
    true
  rescue StandardError => e
    Rails.logger.error "Failed to publish post: #{e.message}"
    false
  end
  
  private
  
  def published?
    published_at.present?
  end
end
{% endhighlight %}

## JavaScript Example

Here's some modern JavaScript with async/await:

{% highlight javascript %}
class ApiClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
  }
  
  async fetchPosts(page = 1, limit = 10) {
    try {
      const response = await fetch(`${this.baseUrl}/posts?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.posts;
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      throw error;
    }
  }
  
  async createPost(postData) {
    const response = await fetch(`${this.baseUrl}/posts`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(postData)
    });
    
    return response.json();
  }
}

// Usage
const client = new ApiClient('https://api.example.com', 'your-api-key');
const posts = await client.fetchPosts(1, 20);
{% endhighlight %}

## Python Example

Here's a Python class with type hints:

{% highlight python %}
from typing import List, Optional, Dict, Any
from dataclasses import dataclass
from datetime import datetime
import asyncio
import aiohttp

@dataclass
class BlogPost:
    title: str
    content: str
    author_id: int
    published_at: Optional[datetime] = None
    tags: List[str] = None
    
    def __post_init__(self):
        if self.tags is None:
            self.tags = []
    
    @property
    def is_published(self) -> bool:
        return self.published_at is not None
    
    def add_tag(self, tag: str) -> None:
        if tag not in self.tags:
            self.tags.append(tag)

class BlogService:
    def __init__(self, api_url: str, api_key: str):
        self.api_url = api_url
        self.api_key = api_key
        self.session: Optional[aiohttp.ClientSession] = None
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            headers={'Authorization': f'Bearer {self.api_key}'}
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def get_posts(self, limit: int = 10) -> List[Dict[str, Any]]:
        async with self.session.get(f'{self.api_url}/posts?limit={limit}') as response:
            response.raise_for_status()
            data = await response.json()
            return data['posts']

# Usage
async def main():
    async with BlogService('https://api.example.com', 'api-key') as service:
        posts = await service.get_posts(20)
        print(f"Retrieved {len(posts)} posts")

if __name__ == '__main__':
    asyncio.run(main())
{% endhighlight %}

## Features

The enhanced code blocks now include:

- **Better syntax highlighting** with carefully chosen colors for different code elements
- **Copy buttons** that appear on hover - try hovering over any code block above
- **Language labels** showing the programming language in the top-right corner
- **Line numbers** for better reference
- **Improved fonts** using JetBrains Mono for better readability
- **Dark mode support** with appropriate color schemes
- **Better spacing and typography** for improved readability

You can copy any code block by clicking the "Copy" button or using the keyboard shortcut `Ctrl+Shift+C` while hovering over a code block.

## Inline Code

Inline code like `const variable = 'value'` and `def method_name` also has improved styling with subtle backgrounds and better contrast.

The syntax highlighting uses a custom color scheme that's easy on the eyes while maintaining good contrast for readability.
