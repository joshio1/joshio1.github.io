# Omkar's Musings

A personal blog about Ruby on Rails, Software Engineering, and Life, built with Jekyll and the Chirpy theme.

🌐 **Live Site**: [https://joshio1.github.io](https://joshio1.github.io)

## About This Blog

This blog covers topics including:
- Ruby on Rails development and best practices
- Software engineering concepts and patterns
- Testing strategies and tools (RSpec, Rails testing)
- Deployment and DevOps (Kamal, Heroku, Docker)
- Database design and optimization
- Personal reflections on software development

## 🚀 Getting Started

### Prerequisites

- Ruby (version 2.7 or higher)
- Bundler gem
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/joshio1/joshio1.github.io.git
   cd joshio1.github.io
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Start the development server**
   ```bash
   bundle exec jekyll serve
   ```
   
   Your blog will be available at `http://localhost:4000`

4. **Start server with drafts** (to preview unpublished posts)
   ```bash
   bundle exec jekyll serve --drafts
   ```

### 📝 Writing Posts

#### Published Posts
- Create new posts in the `_posts/` directory
- Use the naming convention: `YYYY-MM-DD-title.md`
- Include front matter with title, date, and categories

Example:
```markdown
---
title: "Your Post Title"
date: 2025-01-17 10:00:00 +0530
categories: [Rails, Testing]
tags: [ruby, rspec, testing]
---

Your post content here...
```

#### Draft Posts
- Create drafts in the `_drafts/` directory
- No date prefix needed in filename
- No date field required in front matter
- View drafts locally with `bundle exec jekyll serve --drafts`

Example draft:
```markdown
---
title: "Work in Progress Post"
categories: [Rails]
---

Draft content here...
```

#### Publishing a Draft
1. Move from `_drafts/` to `_posts/`
2. Add date prefix to filename
3. Add `date:` field to front matter

### 🗂️ Project Structure

```
.
├── _config.yml          # Site configuration
├── _posts/              # Published blog posts
├── _drafts/             # Draft posts (not published)
├── _tabs/               # Static pages (About, Archives, etc.)
├── _data/               # Data files
├── assets/              # Images, CSS, JS
├── Gemfile              # Ruby dependencies
└── README.md            # This file
```

### 🛠️ Common Commands

```bash
# Start development server
bundle exec jekyll serve

# Start with drafts
bundle exec jekyll serve --drafts

# Start with live reload (auto-refresh browser)
bundle exec jekyll serve --livereload

# Build site for production
bundle exec jekyll build

# Update dependencies
bundle update

# Check for broken links (requires html-proofer)
bundle exec htmlproofer ./_site
```

### 📋 Current Drafts

The following drafts are available in `_drafts/`:
- `database-design-composite-keys.md` - About composite keys in database design
- `heroku-sidekiq-puma-redis-connections-explained.md` - Heroku architecture deep dive
- `how-to-test-if-mailer-is-enqueued.md` - Rails mailer testing strategies
- `http-caching-and-server-push.md` - HTTP caching concepts
- `rails-continuous-delivery-pipeline.md` - CI/CD for Rails applications

### 🎨 Theme

This blog uses the [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) theme, which provides:
- Responsive design
- Dark/light mode toggle
- Search functionality
- Category and tag organization
- Social media integration
- SEO optimization

### 🔧 Configuration

Key configuration files:
- `_config.yml` - Main site configuration (title, description, social links)
- `Gemfile` - Ruby gem dependencies
- `_data/contact.yml` - Contact information and social links

### 📚 Useful Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Chirpy Theme Documentation](https://github.com/cotes2020/jekyll-theme-chirpy/wiki)
- [Markdown Guide](https://www.markdownguide.org/)
- [Jekyll Posts Guide](https://jekyllrb.com/docs/posts/)

### 🚀 Deployment

This blog is automatically deployed to GitHub Pages when changes are pushed to the main branch.

### 📞 Contact

- **Author**: Omkar Joshi
- **Email**: omkar.nitin.joshi@gmail.com
- **Twitter**: [@meJoshio1](https://twitter.com/meJoshio1)
- **GitHub**: [@joshio1](https://github.com/joshio1)

### 📄 License

This work is published under [MIT License](LICENSE).
