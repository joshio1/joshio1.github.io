---
title: "Kamal Rails Series: Kamal Quick Commands"
date: 2025-12-15 14:29:20
categories: ['hetzner', 'HTTPS', 'Kamal', 'kamal', 'LetsEncrypt', 'Rails', 'Rails', 'Ruby', 'ruby on rails', 'RubyOnRails', 'SSL']
---

Here are some commonly used Kamal commands that I find helpful during development and deployment.

## Application Commands

- `kamal app logs -f -r web`
  - Tail web application logs in real-time
- `kamal app exec -p 'bin/rails runner "puts Rails.application.config.time_zone"'`
  - Execute a command on the Rails server
- `kamal app exec -i bash`
  - Start an interactive bash session on the app server
- `kamal app exec -i 'bin/rails console'`
  - Start a Rails console on the app server

## Important Notes

- Changes must be committed to git before deploying, as Kamal only picks up committed files
- Docker must be installed manually on AWS EC2 instances
- Ensure your Dockerfile is present and up to date

## AWS EC2 Connectivity Commands

- `nc -vz <ip_address> 22`
  - Check SSH connectivity to the server
- `ssh -vvv ubuntu@<public_ip>`
  - Connect to the EC2 instance with verbose output for debugging
