---
layout: page
title: Categories
---

# Categories

{% assign categories = site.categories | sort %}
{% for category in categories %}
  <h3>{{ category[0] }}</h3>
  <ul>
    {% for post in category[1] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a> - <time>{{ post.date | date: "%B %d, %Y" }}</time></li>
    {% endfor %}
  </ul>
{% endfor %}
