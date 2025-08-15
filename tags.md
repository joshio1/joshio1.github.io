---
layout: page
title: Tags
---

# Tags

{% assign tags = site.tags | sort %}
{% for tag in tags %}
  <h3>{{ tag[0] }}</h3>
  <ul>
    {% for post in tag[1] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a> - <time>{{ post.date | date: "%B %d, %Y" }}</time></li>
    {% endfor %}
  </ul>
{% endfor %}
