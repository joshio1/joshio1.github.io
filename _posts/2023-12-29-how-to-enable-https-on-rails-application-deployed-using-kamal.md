---
title: "Kamal Rails Series Part 3: Enable HTTPS and SSL Certificate"
date: 2023-12-29 14:29:20
categories: ['hetzner', 'HTTPS', 'Kamal', 'kamal', 'LetsEncrypt', 'Rails', 'Rails', 'Ruby', 'ruby on rails', 'RubyOnRails', 'SSL']
---

This is Part 3 of my Kamal Rails Series. So far, <a href="https://joshio1.blog/add-postgres-on-rails-application-deplyed-using-kamal/">we've deployed a Rails application and accessed the application using the HTTP protocol</a>. However, in production, we rarely do this and always deploy our application using HTTPS recommended secure way with an SSL certificate. This article is to add HTTPS and SSL configuration to our already deployed Rails application using Kamal.

## Pre-Requisites

- Already deployed Rails application using Kamal
- Can access the Rails application using `<SERVER_IP>/up` command.

This GET request should return a 200 OK response.



Bought a domain on any domain provider like <a href="https://www.namecheap.com/">Namecheap</a> or <a href="https://www.godaddy.com/en-in">GoDaddy</a>


## Step 1: Add traefik configuration to deploy.yml

- These are the things we need to add in our `config/deploy.yml`{: .filepath}

```yaml
# Name of your application. Used to uniquely configure containers.
service: rubypodcatcher

# Name of the container image.
image: joshio1/rubypodcatcher

# Deploy to these servers.
servers:
  web:
    hosts:
      - <SERVER_IP>
    labels:
      traefik.http.routers.rubypodcatcher.rule: Host(`rubypodcatcher.com`)
      traefik.http.routers.rubypodcatcher_secure.entrypoints: websecure
      traefik.http.routers.rubypodcatcher_secure.rule: Host(`rubypodcatcher.com`)
      traefik.http.routers.rubypodcatcher_secure.tls: true
      traefik.http.routers.rubypodcatcher_secure.tls.certresolver: letsencrypt
    options:
      network: "private"

# Credentials for your image host.
registry:
  # Specify the registry server, if you're not using Docker Hub
  # server: registry.digitalocean.com / ghcr.io / ...
  username: joshio1

  # Always use an access token rather than real password when possible.
  password:
    - KAMAL_REGISTRY_PASSWORD

# Inject ENV variables into containers (secrets come from .env).
# Remember to run `kamal env push` after making changes!
env:
  clear:
    HOSTNAME: rubypodcatcher.com
  secret:
    - RAILS_MASTER_KEY

# Configure custom arguments for Traefik
traefik:
  options:
    publish:
      - "443:443"
    volume:
      - "/letsencrypt/acme.json:/letsencrypt/acme.json"
    network: "private"
  args:
    entryPoints.web.address: ":80"
    entryPoints.websecure.address: ":443"
    certificatesResolvers.letsencrypt.acme.email: "omkar.nitin.joshi@gmail.com"
    certificatesResolvers.letsencrypt.acme.storage: "/letsencrypt/acme.json"
    certificatesResolvers.letsencrypt.acme.httpchallenge: true
    certificatesResolvers.letsencrypt.acme.httpchallenge.entrypoint: web
```

- Replace <SERVER_IP> with the IP address of your remote server.

## Step 2: Create LetsEncrypt acme file and docker network on remote server

- We are going to use <a href="https://letsencrypt.org/">letsencrypt</a> for our HTTPS configuration as you may have seen from the `deploy.yml`{: .filepath} file above.
- We will need to create an `acme.json`{: .filepath} file on the remote server for our `deploy.yml`{: .filepath} changes to work.
- We also need to create a "private" Docker network changes which we use to communicate internally.
- We can do that by SSHing to the remote server as follows:

```bash
$ ssh root@<SERVER_IP>
root# mkdir -p /letsencrypt && touch /letsencrypt/acme.json && chmod 600 /letsencrypt/acme.json
root# docker network create -d bridge private
```

- We can also automate this by using Kamal hooks but this is just a one-time task and not needed for every deploy (of course)

## Step 3: Change force_ssl to true in `production.rb`{: .filepath}

- If you followed my <a href="https://joshio1.blog/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">previous articles</a>, I had configured `config.force_ssl` to be `false` so that we can access our server using HTTP as well.
- We need to revert this change and instead `force_ssl` should be set to `true`

```ruby
# config/production.rb
  
# Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  config.force_ssl = true
```

## Step 4: Allow inbound HTTPS connections

- We need to also allow inbound HTTPS connections to our remote server.
- To do this, create a firewall and allow inbound connections to port 80 and 443 into the remote server.

![](/assets/images/2023/12/image-1-1024x546.png)

## Step 5: Add A record and CNAME in domain provider settings

- We need to point our domain to the IP address of our remote server.
- To do this, we will need to add the following records in the DNS settings of our domain provider (i.e. wherever we have purchased our domain from)
- We need to add an `A record` with `HOST` value of `@` and value will be the IP address of the remote server.
- We also need to add a `CNAME record` with `HOST` value of `www` and value will be the name of our `domain` ending with `.com`.
- Note that these settings might change based on your domain provider. Hence, please check with your domain provider. (Above settings are applicable for Namecheap which is where I have my domain from)

## Step 6: Deploy using Kamal

- Once we are done with all the configuration, it is time to deploy our changes to the remote server.
- We will run these following commands:

```bash
kamal setup
kamal deploy
kamal traefik restart
```

- After running these commands, if we visit our website directly using the domain name, we should be able to see our Rails application up and running.

![](/assets/images/2023/12/image-2-1024x569.png)

- Other commands you might wanna try for debugging in case there was some error:

```bash
kamal traefik logs
kamal app logs
```

- Also, you can use `kamal env push` to push your environment variables and `kamal traefik reboot` to reboot traefik. Please check `kamal traefik help` for more information.
- This concludes our steps to add HTTPS and SSL certificate to our Rails application using Kamal.

## Next Part: Sidekiq and Redis

- Click <a href="https://joshio1.blog/kamal-rails-series-configure-sidekiq-and-redis/">HERE</a> to read the next post where I talk about adding Redis and Sidekiq to our Kamal configuration.
- Check out these previous articles from this series:

<a href="https://joshio1.blog/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">Part 1: Deploying a basic Rails application using Kamal on Hetzner</a>
- <a href="https://joshio1.blog/add-postgres-on-rails-application-deplyed-using-kamal/">Part 2: Add Postgres to deployed Rails application using Kamal</a>



Listen to <a href="https://podcasts.apple.com/ee/podcast/012-dhh-joins-the-show-to-talk-rails-8-delegated/id1677373826?i=1000626547784">this podcast</a> where DHH talks about Rails and Kamal.

If you would like to search for specific terms or concepts or names in Ruby/Rails podcasts, check out <a href="https://rubypodcatcher.com/">rubypodcatcher.com</a>
