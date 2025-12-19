---
title: "Kamal Rails Series Part 3: Enable HTTPS and SSL Certificate"
date: 2023-12-29 14:29:20
categories: ['hetzner', 'HTTPS', 'Kamal', 'kamal', 'LetsEncrypt', 'Rails', 'Rails', 'Ruby', 'ruby on rails', 'RubyOnRails', 'SSL']
---

This is Part 3 of the Kamal Rails series. So far, <a href="/posts/add-postgres-on-rails-application-deplyed-using-kamal/">we've deployed a Rails application and accessed it using HTTP</a>. In production, we always use HTTPS with an SSL certificate for security. This article shows how to add HTTPS and SSL configuration to your deployed Rails application using Kamal.

## Prerequisites

- A Rails application already deployed with Kamal
- Ability to access the application at `<SERVER_IP>/up` (should return 200 OK)
- A domain purchased from a provider like <a href="https://www.namecheap.com/">Namecheap</a> or <a href="https://www.godaddy.com/en-in">GoDaddy</a>


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

## Step 2: Create Let's Encrypt ACME File and Docker Network

- We use <a href="https://letsencrypt.org/">Let's Encrypt</a> for HTTPS configuration (as shown in the `deploy.yml` above)
- Create an `acme.json` file on the remote server for the configuration to work
- Create a "private" Docker network for internal communication
- SSH into the remote server and run:

```bash
$ ssh root@<SERVER_IP>
root# mkdir -p /letsencrypt && touch /letsencrypt/acme.json && chmod 600 /letsencrypt/acme.json
root# docker network create -d bridge private
```

- You can automate this with Kamal hooks, but since it's a one-time setup, manual execution is fine

## Step 3: Enable force_ssl in production.rb

- In the <a href="/posts/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">previous articles</a>, we set `config.force_ssl` to `false` to allow HTTP access
- Now, change it to `true` to enforce HTTPS:

```ruby
# config/production.rb
  
# Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  config.force_ssl = true
```

## Step 4: Allow Inbound HTTPS Connections

- Create a firewall rule to allow inbound connections on ports 80 (HTTP) and 443 (HTTPS)

![](/assets/images/2023/12/image-1-1024x546.png)

## Step 5: Configure DNS Records

- Point your domain to your remote server's IP address by adding DNS records in your domain provider's settings
- Add an `A record` with `HOST` value of `@` pointing to your server's IP address
- Add a `CNAME record` with `HOST` value of `www` pointing to your domain name (e.g., `example.com`)
- Note: These settings vary by provider. The above applies to Namecheap.

## Step 6: Deploy Your Application

After completing all configuration, deploy your changes:

```bash
kamal setup
kamal deploy
kamal traefik restart
```

Your Rails application should now be accessible at your domain with HTTPS enabled.

![](/assets/images/2023/12/image-2-1024x569.png)

For debugging, use:

```bash
kamal traefik logs
kamal app logs
```

You can also use `kamal env push` to update environment variables and `kamal traefik reboot` to restart Traefik. See `kamal traefik help` for more options.

## Next Part: Configure Sidekiq and Redis

<a href="/posts/kamal-rails-series-configure-sidekiq-and-redis/">Continue to Part 4</a> to add Redis and Sidekiq to your Kamal configuration.

**Previous articles in this series:**
- <a href="/posts/basic-guide-to-deploy-a-rails-7-application-using-kamal-on-hetzner-cloud/">Part 1: Deploy a basic Rails application using Kamal on Hetzner</a>
- <a href="/posts/add-postgres-on-rails-application-deplyed-using-kamal/">Part 2: Add Postgres to your deployed Rails application</a>



Listen to <a href="https://podcasts.apple.com/ee/podcast/012-dhh-joins-the-show-to-talk-rails-8-delegated/id1677373826?i=1000626547784">this podcast</a> where DHH talks about Rails and Kamal.

If you would like to search for specific terms or concepts or names in Ruby/Rails podcasts, check out <a href="https://rubypodcatcher.com/">rubypodcatcher.com</a>
