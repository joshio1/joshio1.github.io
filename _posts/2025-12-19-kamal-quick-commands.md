---
title: "Kamal Rails Series: Kamal Quick Commands"
date: 2025-12-15 14:29:20
categories: ['hetzner', 'HTTPS', 'Kamal', 'kamal', 'LetsEncrypt', 'Rails', 'Rails', 'Ruby', 'ruby on rails', 'RubyOnRails', 'SSL']
---

These are some commands I use often when working with Kamal.

## Commands

- `kamal app logs -f -r web`
  - Tails web logs
- `kamal app exec -p 'bin/rails runner "puts Rails.application.config.time_zone"'`
  - Run a command on the raisl server
- `kamal app exec -i bash`
  - Start an interactive bash session on the app server
- `kamal app exec -i 'bin/rails console'`
  - Start a rails console on the app server


## Gotchas

- If you are running Kamal from your local, the changes need to be committed to be pushed to the server.
- For pushing on AWS, we will need to install docker manually
- Dockerfile needs to be present and be updated
  
### AWS EC2 quick commands:

- `nc -vz <ip_address> 22`
- `ssh -vvv ubuntu@<public_ip>`
