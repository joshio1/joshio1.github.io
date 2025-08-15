---
layout: page
title: Archives
---

# Archives

## All Posts

{% for post in site.posts %}
  {% assign currentdate = post.date | date: "%Y" %}
  {% if currentdate != date %}
    {% unless forloop.first %}</ul>{% endunless %}
    <h3>{{ currentdate }}</h3>
    <ul>
    {% assign date = currentdate %}
  {% endif %}
    <li><a href="{{ post.url }}">{{ post.title }}</a> - <time>{{ post.date | date: "%B %d, %Y" }}</time></li>
  {% if forloop.last %}</ul>{% endif %}
{% endfor %}
