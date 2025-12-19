---
title: "Kamal Series: Add AWS RDS to your Rails application using Kamal"
date: 2025-12-17 08:16:48
categories: ['RDS', 'AWS', 'kamal', 'Kamal', 'Postgres', 'PostgreSQL', 'Rails', 'Rails', 'Ruby', 'ruby on rails', 'RubyOnRails']
---

In Part 1 of this Kamal Series, <a href="/posts/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-aws/">we have deployed a vanilla Rails application to our remote server using Kamal</a>. A vanilla Rails application ships with SQLite as a database by default. Many times though, we use Postgres as our database. This article is to add Postgres configuration to our Rails application and deploy using Kamal. Note that we are going to deploy Postgres on the same server using Kamal where our Rails application is hosted.

This article assumes that you have a Rails application backed by Postgres running on your local environment. If you have some other database other than Postgres(like MySQL), you can follow the same set of instructions below and adapt them for your database provider. If you use SQLite, feel free to skip this article and go to the next part.

There are two ways of deploying Postgres with a Rails application:
  - on the same VM (where the server is running - less common)
  - using a managed database service (more common)

We are going to use AWS RDS for our managed database service.

## Step 1: Create an RDS instance in AWS

- Login into AWS
- Go to RDS and click on "Create database"
- Select "PostgreSQL" as the engine
- Choose a Postgres server size of your preference and keep all other default configuration.
- When asked whether we would like to connect with an EC2 instance, click yes
- Select the EC2 instance we created in Part 1 of this series.
  - This will automatically create a security group for our RDS instance which will allow our EC2 instance to connect to the RDS instance.
  - After you have created an RDS instance, you can verify the connectivity from your EC2 instance to the RDS instance by doing:
      ```
    psql "host=YOUR_RDS_ENDPOINT port=5432 dbname=postgres user=MASTER_USER password=MASTER_PASSWORD sslmode=require"
    ```
    - You will get the details about your RDS instance by going to `AWS Console → RDS → Databases → your DB → Configuration`
    - You may need to click on the secrets in secret manager to view the username and password.
    - You may need to install `psql` on your EC2 instance to be able to connect to the RDS instance.

## Step 2: Modify your database.yml such that the URL comes from environment variables:

- This could be how your database.yml could look like:

```yaml
production:
  <<: *default
  url: <%= ENV["DATABASE_URL"] %>
```

- If you are using a driver like `postgis` and need to replace the `postgres//` with `postgis://`, you can do something like this:

```yaml
production:
  <<: *default
  url: <%= ENV["DATABASE_URL"].gsub("postgres://", "postgis://") %>
```

- If this is giving parsing errors since the password has characters like `@` or `:`, you can wrap the password in quotes or split the URL like this:

```yaml
production:
  <<: *default
  host: <%= ENV["DB_HOST"] %>
  username: <%= ENV["DB_USER"] %>
  database: <%= ENV["DB_NAME"] %>
  password: <%= ENV["DB_PASSWORD"] %>
  adapter: postgis
  sslmode: require
```

- Set `postgres_db` as `kamal_app_demo_production`


## Step 3: Pass environment variables via deploy.yml

- Add the following to your `config/deploy.yml`{: .filepath} file:

```yaml
env:
  clear:
    PORT: 3000
  secret:
    - RAILS_MASTER_KEY
    - DB_HOST
    - DB_NAME
    - DB_USER
    - DB_PASSWORD
```

- Add these keys to your `.kamal/secrets` file.

```yaml
# .kamal/secrets

secrets:
  RAILS_MASTER_KEY: $RAILS_MASTER_KEY
  DB_HOST: $DB_HOST
  DB_NAME: $DB_NAME
  DB_USER: $DB_USER
  DB_PASSWORD: $DB_PASSWORD
```

- Actual credentials reside in your .env file like:

```bash
# .env file

RAILS_MASTER_KEY=<our_rails_production_master_key>
DB_HOST=<our_rds_endpoint>
DB_NAME=<our_rds_db_name>
DB_USER=<our_rds_username>
DB_PASSWORD=<our_rds_password>
```

## Step 4: Run deploy commands

- After we have made all the necessary configuration changes, it's time to deploy to the remote server.
- Run:

```bash
kamal deploy
```

- This should deploy our Rails application with RDS as the database.

- If you would like to see commonly used Kamal commands, check out <a href="/posts/kamal-quick-commands/">this article</a>.

## Next Part: Access server using HTTPS

- So far, we have only accessed our remote server using HTTP.
- <a href="/posts/how-to-enable-https-on-rails-application-deployed-using-kamal/">Click HERE to go to the next part to access your server using HTTPS.</a>

**NOTE**:

- If this article is out of date, please don't hesitate to contact me on Twitter from <a href="/about/">this page</a> and I'll be happy to update it.
- Listen to <a href="https://podcasts.apple.com/ee/podcast/012-dhh-joins-the-show-to-talk-rails-8-delegated/id1677373826?i=1000626547784">this podcast</a> where DHH talks about Rails and Kamal.
- If you would like to search for specific terms or concepts or names in Ruby/Rails podcasts, check out <a href="https://rubypodcatcher.com/">rubypodcatcher.com</a>
