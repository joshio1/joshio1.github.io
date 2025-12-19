---
title: "Kamal Series Part 2: Deploy Postgres with your Rails application"
date: 2023-11-19 08:16:48
categories: ['hetzner', 'kamal', 'Kamal', 'Postgres', 'PostgreSQL', 'Rails', 'Rails', 'Ruby', 'ruby on rails', 'RubyOnRails']
---

In Part 1 of this Kamal Series, <a href="https://joshio1.blog/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">we have deployed a vanilla Rails application to our remote server using Kamal</a>. A vanilla Rails application ships with SQLite as a database by default. Many times though, we use Postgres as our database. This article is to add Postgres configuration to our Rails application and deploy using Kamal. Note that we are going to deploy Postgres on the same server using Kamal where our Rails application is hosted.

This article assumes that you have a Rails application backed by Postgres running on your local environment. If you have some other database other than Postgres(like MySQL), you can follow the same set of instructions below and adapt them for your database provider. If you use SQLite, feel free to skip this article and go to the next part.

There are two ways of deploying Postgres with a Rails application:

1. on the same VM (where the server is running)
2. using a managed database service

In this article, we are going to do it using the first option, i.e. deploying Postgres on the same server where our Rails application is hosted. If you want to use a managed database service, you can refer to <a href="https://joshio1.blog/add-rds-to-rails-application-deplyed-using-kamal/">this article</a> where I talk about using AWS RDS.

## Step 1: Add database configuration in `deploy.yml`{: .filepath} file

- Add db configuration under accessories section of your `config/deploy.yml`{: .filepath}
- Here is what the `config/deploy.yml`{: .filepath} file should like:

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

## Step 2: Add configuration in `.env` file

- Add `POSTGRES_PASSWORD` to your `.env` file

```bash
//.env file

KAMAL_REGISTRY_PASSWORD=<docker_password>
RAILS_MASTER_KEY=<master_key_of_production_environment>
POSTGRES_PASSWORD=
```

- We can set any arbitrary password for `POSTGRES_PASSWORD`. Make sure that this value is not made public or pushed to version control.

## Step 3: Change config/database.yml

- We also need to change our `config/database.yml`{: .filepath} file so that it picks up the correct environment variables.

#config/database.yml

production:
  <<: *default
  host: <%= ENV["DB_HOST"] %>
  username: <%= ENV["POSTGRES_USER"] %>
  database: <%= ENV["POSTGRES_DB"] %>
  password: <%= ENV["POSTGRES_PASSWORD"] %>

## Step 4: Run deploy commands

- After we have made all the necessary configuration changes, it's time to deploy to the remote server.
- Run these commands on your terminal:

kamal env push
kamal accessory boot db
kamal deploy

- If we would like to clean the existing server and deploy using this our new configuration with Postgres, we can use these commands:

kamal remove
kamal setup

## Gotchas:

- This is a basic configuration for deploying PostgreSQL on your remote server. Note that this is for deploying database on the same machine as your Rails server.
- This does not cater to advanced configuration of having Postgres on a different machine or other complex requirements. Keep following my blog as I write more on these topics.

## Next Part: Access server using HTTPS

- So far, we have only accessed our remote server using HTTP.
- <a href="https://joshio1.blog/how-to-enable-https-on-rails-application-deployed-using-kamal/">Click HERE to go to the next part to access your server using HTTPS.</a>

**NOTE**:

- If this article is out of date, please don't hesitate to contact me on Twitter from <a href="https://joshio1.blog/about-me/">this page</a> and I'll be happy to update it.
- Listen to <a href="https://podcasts.apple.com/ee/podcast/012-dhh-joins-the-show-to-talk-rails-8-delegated/id1677373826?i=1000626547784">this podcast</a> where DHH talks about Rails and Kamal.
- If you would like to search for specific terms or concepts or names in Ruby/Rails podcasts, check out <a href="https://rubypodcatcher.com/">rubypodcatcher.com</a>
