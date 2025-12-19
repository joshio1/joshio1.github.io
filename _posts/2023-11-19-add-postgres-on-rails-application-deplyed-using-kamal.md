---
title: "Kamal Series Part 2: Deploy Postgres with your Rails application"
date: 2023-11-19 08:16:48
categories: ['hetzner', 'kamal', 'Kamal', 'Postgres', 'PostgreSQL', 'Rails', 'Rails', 'Ruby', 'ruby on rails', 'RubyOnRails']
---

In <a href="/posts/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">Part 1 of this Kamal series</a>, we deployed a vanilla Rails application to a remote server using Kamal. By default, Rails applications use SQLite, but most production applications require Postgres. This article shows how to configure Postgres and deploy it on the same server as your Rails application using Kamal.

This article assumes you have a Rails application backed by Postgres running locally. If you use a different database like MySQL, you can adapt these instructions accordingly. If you're using SQLite, you can skip this article.

There are two approaches to deploying Postgres with a Rails application:

1. On the same VM as your application
2. Using a managed database service

This article covers the first approach—deploying Postgres on the same server as your Rails application. For a managed database service, see the <a href="/posts/add-rds-to-rails-application-deplyed-using-kamal/">AWS RDS article</a>.

## Step 1: Configure the Database in deploy.yml

- Add database configuration under the accessories section of your `config/deploy.yml`
- Your `config/deploy.yml` should look like:

```yaml
# config/deploy.yml file

# Inject ENV variables into containers (secrets come from .env).
# Remember to run `kamal env push` after making changes!
env:
  clear:
    DB_HOST: <ipv4_address_of_your_server>
    RAILS_SERVE_STATIC_FILES: true
    RAILS_LOG_TO_STDOUT: true
  secret:
    - RAILS_MASTER_KEY
    - POSTGRES_PASSWORD

accessories:  
  db:
    image: postgres:15
    host: <ipv4_address_of_your_server>
    port: 5432
    env:
      clear:
        POSTGRES_USER: 'kamal_app_demo'
        POSTGRES_DB: 'kamal_app_demo_production'
      secret:
        - POSTGRES_PASSWORD
    directories:
      - data:/var/lib/postgresql/data
```

## Step 2: Configure Environment Variables

- Add `POSTGRES_PASSWORD` to your `.env` file:

```bash
# .env file
KAMAL_REGISTRY_PASSWORD=<docker_password>
RAILS_MASTER_KEY=<master_key_of_production_environment>
POSTGRES_PASSWORD=<secure_password>
```

- Choose a strong password for `POSTGRES_PASSWORD` and keep it secure. Never commit this file to version control.

## Step 3: Update database.yml

- Update your `config/database.yml` to use environment variables:

```yaml
# config/database.yml
production:
  <<: *default
  host: <%= ENV["DB_HOST"] %>
  username: <%= ENV["POSTGRES_USER"] %>
  database: <%= ENV["POSTGRES_DB"] %>
  password: <%= ENV["POSTGRES_PASSWORD"] %>
```

## Step 4: Deploy Your Application

After completing the configuration above, deploy to your remote server:

```bash
kamal env push
kamal accessory boot db
kamal deploy
```

To reset the server and deploy with the new Postgres configuration:

```bash
kamal remove
kamal setup
```

## Important Notes

- This configuration deploys Postgres on the same machine as your Rails application
- For advanced setups with Postgres on a separate machine or other complex requirements, refer to the AWS RDS article

## Next Part: Enable HTTPS

So far, we've accessed the server using HTTP. In the next part, we'll configure HTTPS and SSL certificates.

<a href="/posts/how-to-enable-https-on-rails-application-deployed-using-kamal/">Continue to Part 3</a>

**NOTE**:

- If this article is out of date, please don't hesitate to contact me on Twitter from <a href="/about/">this page</a> and I'll be happy to update it.
- Listen to <a href="https://podcasts.apple.com/ee/podcast/012-dhh-joins-the-show-to-talk-rails-8-delegated/id1677373826?i=1000626547784">this podcast</a> where DHH talks about Rails and Kamal.
- If you would like to search for specific terms or concepts or names in Ruby/Rails podcasts, check out <a href="https://rubypodcatcher.com/">rubypodcatcher.com</a>
