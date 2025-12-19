---
title: "Kamal Series: Deploy Rails application on AWS"
date: 2025-12-18 06:00:28
categories: ['aws', 'kamal', 'Kamal', 'Rails', 'Rails', 'Ruby', 'ruby on rails', 'RubyOnRails']
---

<a href="https://kamal-deploy.org/">Kamal</a> is a new shiny way to deploy Rails applications <a href="https://world.hey.com/dhh/introducing-kamal-9330a267">announced by DHH</a> back in February 2023 and also spoke about it in his <a href="https://www.youtube.com/watch?v=iqXjGiQ_D-A">RailsWorld Keynote</a>. Now that <a href="https://www.heroku.com/">Heroku</a> has <a href="https://help.heroku.com/RSBRUH58/removal-of-heroku-free-product-plans-faq#:~:text=For%20non%2DEnterprise%20users%2C%20free,will%20be%20converted%20to%20mini%20.">removed their free tier</a>, Kamal has become excitingly popular since it also resonates with the idea of "<a href="https://world.hey.com/dhh/why-we-re-leaving-the-cloud-654b47e0">leaving the cloud</a>". Most importantly, Kamal is free and <a href="https://github.com/basecamp/kamal">open source</a> and is developed by the folks from <a href="https://basecamp.com/">Basecamp</a> who created Rails.

This means we need to purchase our own server for deploying our Rails application. There are several choices for purchasing like: <a href="https://www.digitalocean.com/">Digital Ocean</a> or <a href="https://aws.amazon.com/?nc2=h_lg">AWS</a> or <a href="https://www.hetzner.com/cloud">Hetzner</a>. We are going to use AWS which is widely used and has a free tier.

This is part of the Kamal Rails series. In this article, I will cover a basic way of deploying a vanilla Rails application on AWS.

## Pre-Requisites:

- Docker is installed on our local environment. (Make sure the version is according to our OS)
- Docker account is created on <a href="https://hub.docker.com/">Docker hub</a>.
- You have a Rails application "created" using Rails > 6.0

If you don't have a Rails application created yet, you can do so using:




```bash
rails new kamal_demo -T -m https://raw.githubusercontent.com/joshio1/rails_application_template/main/application_template.rb
```

- Account on AWS such that we are ready to create EC2 and Amazon RDS(managed database) instances.




## Steps:

### 1. Create an EC2 instance in AWS

- Login into AWS
- Create a key value pair using our public key which we can use to SSH in our instance.
  - Go to Key Value pairs and click on "Import"
  - Name the key value pair as `test-laptop`
  - Use this command to copy our public key to the clipboard.
  ```bash
    pbcopy < ~/.ssh/id_rsa.pub
  ```
  - Copy this public key to the key value pair
  - Click create

- Go to EC2 and click on "Launch Instance".
  - Select free tier and let's choose Ubuntu as an OS for this example.
  - Keep all default configurations for creating an EC2 instance.
  - Use the above created key value pair in the SSH configuration while creating an EC2 instance
  - This will ensure we can access this EC2 instance from our local laptop.

- That's it. We don't need any more configurations on the server.
- Verify we are able to SSH to the created server by doing:

```bash
ssh ubuntu@<public_ip_address_of_the_ec2_instance>
```

## 2. Getting our Rails repository ready for deployment

- Now navigate to the root directory of your Rails application and check if you have a `Dockerfile` already present.
    - If your Rails application was created on Rails version 7.1 or greater, <a href="https://rubyonrails.org/2023/10/5/Rails-7-1-0-has-been-released">Rails now by default ships with a Dockerfile</a>.
    - If not, we can use the <a href="https://github.com/fly-apps/dockerfile-rails">dockerfile-rails gem</a> for generating Dockerfile and related files.



Make sure you have a `Dockerfile` present because Kamal uses a docker image for deployment.

Next thing is to make sure you have health check route. Again if your application was created on Rails version 7.1 or greater, you should have an `/up` route which determines whether your application is up or not.- If you don't have an `/up` health check route, you can add this following code to your `config/routes.rb` file:

```routes.rb
get '/up', to: ->(env) { [204, {}, ['']] }
```


- Once we have these two things (Dockerfile and the health check route), we should be all set to start using Kamal.

## 3. Using Kamal for deployment

- Install Kamal using:

```bash
gem install kamal
```

  - This will install Kamal 2 which is the latest version of Kamal in your gem environment (depending on the ruby version you are on).


- Now, navigate to the Rails application repository (`kamal_demo`) and initialize Kamal

```bash
cd kamal_demo
kamal init
```


- This will create a bunch of files like `config/deploy.yml`, `.kamal/hooks` and `.kamal/secrets`. 

  - Let's start with the environment variables configuration first:
    - First, you will need to create a Docker Registry key. Docker Registry Key can be found by logging in to your Docker account and going to `Account Settings > Security > New Access Token` to create a new access token.
    - Second, you will need a `RAILS_MASTER_KEY`.
      - `RAILS_MASTER_KEY` is used in decrypting your credentials located at `config/credentials/production.yml.enc` or `config/credentials.yml.enc`
      - For production environment, it is located in `config/credentials/production.key` of our Rails application which is used to decrypt Rails credentials.
        - If `config/credentials` folder is not present, run `EDITOR=vim rails credentials:edit --environment production` to create the production credentials file and master key.
    - Once you have these two keys ready, there are 3 different ways to set it up.
    - These keys need to be defined in `.kamal/secrets` file from where Kamal (deploy.yml) can access them. The `.kamal/secrets` file can be committed into git because the credentials are actually present somewhere else. We just define them in this file.
    - These are the three ways to define them in `.kamal/secrets` file.
      - First way is to create a `.env` file and load the keys using `direnv`
      - Second way is to read secrets via a command like `rails credentials:fetch kamal.registry_password`
      - Third way is to use a third party tool like `1password` and then fetch the keys using `kamal secrets` 
    - In the second way, we will need to be on the latest Rails which has support for commands like `credentials:fetch`
    - We will go with the first way for simplicity where we define an `.env` file in the root of our project.
    - After defining them in `.env`, we will need to have these keys such that are available as environment variables in the command line when we do `export $KAMAL_REGISTRY_PASSWORD`
      - In order to do this, we will need a tool like [direnv](https://github.com/direnv/direnv/blob/master/docs/installation.md) which loads environment variables from `.env` file to our command line.
    - This is how the `.env` file should look like:

      ```bash
      KAMAL_REGISTRY_PASSWORD=<our_docker_access_token>
      RAILS_MASTER_KEY=<our_rails_production_master_key>
      ```

- The `kamal init` command also creates a `config`/`deploy.yml` file. This file is responsible for storing the configuration of our Rails application which is necessary to deploy on a remote server. Edit this file and change it to something like this:

```yaml
service: kamal_demo
image: joshio1/kamal_demo
servers:
  - <ipv4_address_of_ec2_instance>
registry:
  username: joshio1
  password:
    - KAMAL_REGISTRY_PASSWORD
builder:
  arch: amd64
  secrets:
    - RAILS_MASTER_KEY
    - SECRET_KEY_BASE
env:
  secret:
    - RAILS_MASTER_KEY
```

- Some details about the above `config/deploy.yml` file:

  - Here `joshio1` is the `Docker` username and `kamal_demo` is the name of the Rails application
  - Kamal automatically references `KAMAL_REGISTRY_PASSWORD` and `RAILS_MASTER_KEY` from the `.env` file when they are mentioned like this in the `config/deploy.yml`{: .filepath} file.
  - `<ipv4_address_of_ec2_instance>` is pretty self-explanatory.



Set `force_ssl=false` in `config/production.rb` - This is because we haven't yet configured SSL certificates and we will only use HTTP to connect with our server.
- Note that we will configure HTTPS in upcoming parts of this Kamal series.


## 4. Install Docker manually on the EC2 instance

- Kamal does not install Docker automatically on the remote server since we use a different user other than `root`. Even though `ubuntu` user has `sudo` privileges, we need to install Docker manually.
- We can do this by SSHing to the remote server and running the following commands:

```bash
sudo apt-get update
sudo apt-get install docker.io
sudo systemctl start docker
sudo systemctl enable docker
```

## 5. Deployment


After we have done making these changes, this is the final command required to deploy our Rails application to the EC2 instance: 


`kamal setup`

- You should see output like this:

```bash
-> kamal_demo git:(main) ✗ kamal setup
  INFO [ffc073f1] Running /usr/bin/env mkdir -p .kamal on 5.161.42.10
  INFO [ffc073f1] Finished in 3.630 seconds with exit status 0 (successful).
  Acquiring the deploy lock...
  ...
  Ensure Docker is installed...
  ...
  Push env files...
  ...
  Log into image registry...
  ...
  Build and push app image...
  ...
  ...
  ...
    INFO [57d640dd] Finished in 0.527 seconds with exit status 0 (successful).
    INFO Container is healthy!
  ...
  ...
    INFO [36025396] Finished in 1.358 seconds with exit status 0 (successful).
    Finished all in 288.2 seconds
    Releasing the deploy lock...
    Finished all in 301.2 seconds
```


- Since our container is healthy and all the steps have successfully completed, we can navigate to the URL of our server and see if it is up. Go to: `<SERVER_IP>/up` and we should see a green screen like this:

![](/assets/images/2023/11/image-3-1024x541.png)

- If there are any errors during `kamal setup` command or this green is not visible, please refer to the `Important Points` section below for more information.

## Important Points:

- If your initializers access Rails credentials, you may need to modify your Dockerfile such that they use RAILS_MASTER_KEY when loading assets.
  - This can be done like this after setting Dockerfile version to >= 1.4:
    ```bash
      RUN --mount=type=secret,id=RAILS_MASTER_KEY \
      SECRET_KEY_BASE_DUMMY=1 \
      RAILS_MASTER_KEY="$(cat /run/secrets/RAILS_MASTER_KEY)" \
      ./bin/rails assets:precompile
    ```
- Since we are running Kamal from a local repo, all our changes need to be committed into git so that it can be deployed. i.e. Kamal does not pick up uncommitted files.
- Node version needs to be specific in the Dockerfile or else we will get a "definition not found" error.

## Next Part: Add Postgres to your Rails application

- So far we have only deployed a basic Rails application with SQLite. In Part 2 of this series, we will deploy a Rails application backed by Postgres.
- <a href="/posts/add-postgres-on-rails-application-deplyed-using-kamal/">Click HERE to go to the next part in this Kamal series</a>

**NOTE**:

- If this article is out of date, please don't hesitate to contact me on Twitter from <a href="/about/">this page</a> and I'll be happy to update it.
- Listen to <a href="https://podcasts.apple.com/ee/podcast/012-dhh-joins-the-show-to-talk-rails-8-delegated/id1677373826?i=1000626547784">this podcast</a> where DHH talks about Rails and Kamal.
- If you would like to search for specific terms or concepts or names in Ruby/Rails podcasts, check out <a href="https://rubypodcatcher.com/">rubypodcatcher.com</a>
