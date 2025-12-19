---
title: "Kamal Series Part 1: Deploy Rails application on Hetzner"
date: 2023-11-02 06:00:28
categories: ['hetzner', 'kamal', 'Kamal', 'Rails', 'Rails', 'Ruby', 'ruby on rails', 'RubyOnRails']
---

<a href="https://kamal-deploy.org/">Kamal</a> is a new shiny way to deploy Rails applications <a href="https://world.hey.com/dhh/introducing-kamal-9330a267">announced by DHH</a> back in February 2023 and also spoke about it in his <a href="https://www.youtube.com/watch?v=iqXjGiQ_D-A">RailsWorld Keynote</a>. Now that <a href="https://www.heroku.com/">Heroku</a> has <a href="https://help.heroku.com/RSBRUH58/removal-of-heroku-free-product-plans-faq#:~:text=For%20non%2DEnterprise%20users%2C%20free,will%20be%20converted%20to%20mini%20.">removed their free tier</a>, Kamal has become excitingly popular since it also resonates with the idea of "<a href="https://world.hey.com/dhh/why-we-re-leaving-the-cloud-654b47e0">leaving the cloud</a>". Most importantly, Kamal is free and <a href="https://github.com/basecamp/kamal">open source</a> and is developed by the folks from <a href="https://basecamp.com/">Basecamp</a> who created Rails.

This means we need to purchase our own server for deploying our Rails application. There are several choices for purchasing like: <a href="https://www.digitalocean.com/">Digital Ocean</a> or <a href="https://aws.amazon.com/?nc2=h_lg">AWS</a> or <a href="https://www.hetzner.com/cloud">Hetzner</a>. We are going to use Hetzner which is one of the crowd favorites. It also gives you the best bang for buck! (We can run our entire Rails application for as little as 4 euros!!!)

This is Part 1 of the Kamal Rails series. In this article, I will cover a basic way of deploying a vanilla Rails application on Hetzner Cloud.

## Pre-Requisites:

- Docker is installed on our local environment. (Make sure the version is according to our OS)
- Docker account is created on <a href="https://hub.docker.com/">Docker hub</a>.
- You have a Rails application "created" using Rails > 6.0

If you don't have a Rails application created yet, you can do so using:




```bash
rails new kamal_demo -T -m https://raw.githubusercontent.com/joshio1/rails_application_template/main/application_template.rb
```

- Account on Hetzner Cloud such that we are ready to create Projects/Servers.

Normally, it takes around a day for the account to be verified after our details are entered.




## Steps:

### 1. Create a VPS on Hetzer Cloud

- Login to Hetzner Cloud and create a new "Project".

![](/assets/images/2023/11/image-1024x373.png)

- After a project is created, add a server to that project by clicking the "Add Server" button below:

![](/assets/images/2023/11/image-1-1024x508.png)

- Select the location for your server and also choose the operating system. In this example, we are going to choose Ubuntu.
- Selected `Shared vCPU(x86) and CPX11` (which is the first plan)

![](/assets/images/2023/11/image-2.png)

- Choose IPv6 and IPv4 both
- Add an SSH key to our server. Below command is how we can copy our public key to the clipboard. Use that to paste in the SSH section on Hetzner cloud while creating the server.

pbcopy < ~/.ssh/id_rsa.pub

- That's it. We don't need any more configurations on the server. Click on `Create and Buy Now`
- It will take around 1 or 2 minutes to create the server. We also get an email from Hetzner. Make sure the server is green and has an IPv4 address next to it. Check if we can SSH to the created server by doing:

ssh root@<ipv4_address_of_the_server>

## 2. Getting our Rails repository ready for deployment

- Now navigate to the root directory of your Rails application and check if you have a `Dockerfile` already present.

If your Rails application was created on Rails version 7.1 or greater, <a href="https://rubyonrails.org/2023/10/5/Rails-7-1-0-has-been-released">Rails now by default ships with a Dockerfile</a>.
- If not, we can use the <a href="https://github.com/fly-apps/dockerfile-rails">dockerfile-rails gem</a> for generating Dockerfile and related files.



Make sure you have a `Dockerfile` present because Kamal uses a docker image for deployment.

Next thing is to make sure you have health check route. Again if your application was created on Rails version 7.1 or greater, you should have an `/up` route which determines whether your application is up or not.- If you don't have an `/up` health check route, you can add this following code to your `config/routes.rb`{: .filepath} file:



```routes.rb
get '/up', to: ->(env) { [204, {}, ['']] }
```


- Once we have these two things (Dockerfile and the health check route), we should be all set to start using Kamal.

## 3. Using Kamal for deployment

- Install Kamal using:

gem install kamal

- Now, navigate to the Rails application repository (`kamal_demo`) and initialize Kamal

cd kamal_demo
kamal init

- This will create a bunch of files like `.env`, `config/deploy.yml`{: .filepath} and some hooks. Modify the `.env` file to insert Docker Registry password and Rails master key.

Docker Registry Key can be found by logging in to your Docker account and going to `Account Settings > Security > New Access Token` to create a new access token.
- `RAILS_MASTER_KEY` for production environment is located in `config/credentials/production.key` of our Rails application which is used to decrypt Rails credentials.
- The `.env` file should look something like this:




KAMAL_REGISTRY_PASSWORD=<our_docker_access_token>
RAILS_MASTER_KEY=<our_rails_production_master_key>

- The `kamal init` command also creates a `confi`g/`deploy.yml`{: .filepath} file. This file is responsible for storing the configuration of our Rails application which is necessary to deploy on a remote server. Edit this file and change it to something like this:

```yaml
service: kamal_demo
image: joshio1/kamal_demo
servers:
  - <ipv4_address_of_Hetzner_server>
registry:
  username: joshio1
  password:
    - KAMAL_REGISTRY_PASSWORD
env:
  secret:
    - RAILS_MASTER_KEY
```

- Some details about the above `config/deploy.yml`{: .filepath} file:

Here `joshio1` is the `Docker` username and `kamal_demo` is the name of the Rails application
- Kamal automatically references `KAMAL_REGISTRY_PASSWORD` and `RAILS_MASTER_KEY` from the `.env` file when they are mentioned like this in the `config/deploy.yml`{: .filepath} file.
- `<ipv4_address_of_hetzer_server>` is pretty self-explanatory.



Set `force_ssl=false` in `config/production.rb`{: .filepath} - This is because we haven't yet configured SSL certificates and we will only use HTTP to connect with our server.
- Note that we will configure HTTPS in upcoming parts of this Kamal series.



After we have done making these changes, this is the final command required to deploy our Rails application to the Hetzer server: 


kamal setup

- You should see output like this:

➜  kamal_demo git:(main) ✗ kamal setup
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

- Since our container is healthy and all the steps have successfully completed, we can navigate to the  URL of our server and see if it is up. Go to: `<SERVER_IP>/up` and we should see a green screen like this:

![](/assets/images/2023/11/image-3-1024x541.png)

- If there are any errors during `kamal setup` command or this green is not visible, please refer to the `Important Points` section below for more information.

## Next Part: Add Postgres to your Rails application

- So far we have only deployed a basic Rails application with SQLite. In Part 2 of this series, we will deploy a Rails application backed by Postgres.
- <a href="https://joshio1.blog/add-postgres-on-rails-application-deplyed-using-kamal/">Click HERE to go to the next part in this Kamal series</a>

**NOTE**:

- If this article is out of date, please don't hesitate to contact me on Twitter from <a href="https://joshio1.blog/about-me/">this page</a> and I'll be happy to update it.
- Listen to <a href="https://podcasts.apple.com/ee/podcast/012-dhh-joins-the-show-to-talk-rails-8-delegated/id1677373826?i=1000626547784">this podcast</a> where DHH talks about Rails and Kamal.
- If you would like to search for specific terms or concepts or names in Ruby/Rails podcasts, check out <a href="https://rubypodcatcher.com/">rubypodcatcher.com</a>
