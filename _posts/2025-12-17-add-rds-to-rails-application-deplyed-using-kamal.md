---
title: "Kamal Rails on AWS Series Part 2: Add AWS RDS to your Rails application"
date: 2025-12-17 08:16:48
categories: ['RDS', 'AWS', 'kamal', 'Kamal', 'Postgres', 'PostgreSQL', 'Rails', 'Rails', 'Ruby', 'ruby on rails', 'RubyOnRails']
---

In <a href="/posts/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-aws/">Part 1 of this Kamal series</a>, we deployed a vanilla Rails application to a remote server using Kamal. By default, Rails applications use SQLite, but most production applications require Postgres. This article shows how to configure Postgres and deploy it using Kamal with AWS RDS as a managed database service.

This article assumes you have a Rails application backed by Postgres running locally. If you use a different database like MySQL, you can adapt these instructions accordingly. If you're using SQLite, you can skip this article.

There are two approaches to deploying Postgres with a Rails application:
- On the same VM as your application (less common)
- Using a managed database service like AWS RDS (more common)

We'll use AWS RDS for this guide.

## Step 1: Create an RDS Instance in AWS

- Log in to AWS
- Navigate to RDS and click "Create database"
- Select "PostgreSQL" as the database engine
- Choose your preferred Postgres instance size and keep other settings at their defaults
- When prompted to connect with an EC2 instance, select yes
- Choose the EC2 instance you created in Part 1
  - AWS automatically creates a security group allowing your EC2 instance to connect to RDS
  - After creating the RDS instance, verify connectivity from your EC2 instance:
    ```bash
    psql "host=YOUR_RDS_ENDPOINT port=5432 dbname=postgres user=MASTER_USER password=MASTER_PASSWORD sslmode=require"
    ```
  - Find RDS details in `AWS Console → RDS → Databases → your DB → Configuration`
  - You may need to check AWS Secrets Manager for the username and password
  - Install `psql` on your EC2 instance if needed: `sudo apt-get install postgresql-client`

## Step 2: Configure Your database.yml to Use Environment Variables

- Update your `database.yml` to read the database URL from environment variables:

```yaml
production:
  <<: *default
  url: <%= ENV["DATABASE_URL"] %>
```

- If you're using PostGIS and need to replace `postgres://` with `postgis://`, use:

```yaml
production:
  <<: *default
  url: <%= ENV["DATABASE_URL"].gsub("postgres://", "postgis://") %>
```

- If you encounter parsing errors due to special characters in the password (like `@` or `:`), split the URL into individual components:

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

- Set the database name to `kamal_app_demo_production`

## Step 3: Configure Environment Variables in deploy.yml

- Add the following to your `config/deploy.yml` file:

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

- Add these keys to your `.kamal/secrets` file:

```yaml
# .kamal/secrets
secrets:
  RAILS_MASTER_KEY: $RAILS_MASTER_KEY
  DB_HOST: $DB_HOST
  DB_NAME: $DB_NAME
  DB_USER: $DB_USER
  DB_PASSWORD: $DB_PASSWORD
```

- Store actual credentials in your `.env` file:

```bash
# .env file

RAILS_MASTER_KEY=<our_rails_production_master_key>
DB_HOST=<our_rds_endpoint>
DB_NAME=<our_rds_db_name>
DB_USER=<our_rds_username>
DB_PASSWORD=<our_rds_password>
```

## Step 4: Deploy Your Application

After completing the configuration above, deploy your Rails application with RDS:

```bash
kamal deploy
```

Your Rails application should now be running with RDS as the database.

For commonly used Kamal commands, see <a href="/posts/kamal-quick-commands/">this article</a>.

## Next Steps

You've now completed the AWS series with a Rails application deployed on AWS with RDS. For additional Kamal configuration topics, check out:

- <a href="/posts/kamal-rails-series-configure-sidekiq-and-redis/">Configure Redis and Sidekiq with Kamal</a>
- <a href="/posts/kamal-quick-commands/">Kamal Quick Commands</a>

**Previous articles in this AWS series:**
- <a href="/posts/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-aws/">Part 1: Deploy Rails application on AWS</a>

**NOTE**:

- If this article is out of date, please don't hesitate to contact me on Twitter from <a href="/about/">this page</a> and I'll be happy to update it.
- Listen to <a href="https://podcasts.apple.com/ee/podcast/012-dhh-joins-the-show-to-talk-rails-8-delegated/id1677373826?i=1000626547784">this podcast</a> where DHH talks about Rails and Kamal.
- If you would like to search for specific terms or concepts or names in Ruby/Rails podcasts, check out <a href="https://rubypodcatcher.com/">rubypodcatcher.com</a>
