---
title: "Heroku, Sidekiq, Puma and Redis Connections Explained"
date: 2023-10-26 05:52:39
categories: ['Uncategorized']
---

Have you ever wondered what different terminologies like dynos, workers, processes, threads and queues mean? 
Have you gotten any error which has forced you to investigate the configuration you have for Heroku, Sidekiq, Puma or Redis ?
Or are you curious to know how exactly your Rails application processes web requests?

If your answer to any of the above questions is yes and you would like a "human" to explain this for you, this article is for you.

First, let's start from the top with the terminology. Whenever a request is made to a Rails application using a public URL, the request comes to your hosted server or virtual machine. Now, we are going to skip the initial part where the URL is translated using DNS and there could be Nginx or Cloudflare setup. We are going to start with the part when the request hits your machine. Since we are talking about Heroku here, this machine is a server owned and hosted by Heroku.

Broadly, there are two types of servers which Heroku provides: "web" and "workers". "web" is for processing web requests from users and "workers" is for background jobs. Since we are considering a scenario when a request is made by the user, we are going to deal with the "web" for now.

`**Dyno**`:

For requests that hit the Heroku "web" servers, the request is first processed by a "dyno".  A "dyno" is a linux container and is a building block of Heroku. We can define the number of "dynos" to give for our web process on our Heroku dashboard:

![](https://joshio1.blog/wp-content/uploads/2023/10/image-1024x78.png)

In the above image, we can see that we have set number of dynos to 4. This means there will be 4 linux containers that will process requests from users in parallel. Now, these containers can be inside the same machine or a different machine (that is really up to Heroku). For us, we just care about the number of different containers that can process the request concurrently.

`**Puma Worker**`:

If you see in the above image, we use puma as a web server for processing requests. Puma is a web server which allows you to process several requests in parallel. How Puma does this is using workers and threads. The difference between workers and threads is that a worker is a different OS process whereas a thread is a single execution flow inside the process. So, let's say our request comes to a Heroku dyno (which is a Linux container in a server or VM), there will be different processes inside this container which are also known as `Puma Workers`. Multiple workers can process request at a time since those are different OS processes. This is how we specify the number of workers in our Puma config:

```json
# Specifies the number of `workers` to boot in clustered mode.
# Workers are forked web server processes. If using threads and workers together
# the concurrency of the application would be max `threads` * `workers`.
# Workers do not work on JRuby or Windows (both of which do not support
# processes).
#
workers ENV.fetch('WEB_CONCURRENCY') { 2 }
```

Note that the default configuration is 2 workers. However, it is not mandatory. If we set this to 1, it will mean that only one OS process caters to the request inside a dyno.

`**Puma Threads**`:

Now, we briefly touched upon Puma threads earlier when we said Puma has two ways to achieve concurrency: processes and threads. Puma threads are nothing but regular threads inside a single process. Typically, there are 5 (default) threads inside a single process and each thread can handle a web request independently. This is how the configuration looks like in `config/puma.rb`{: .filepath}

```json
# Puma can serve each request in a thread from an internal thread pool.
# The `threads` method setting takes two numbers: a minimum and maximum.
# Any libraries that use thread pools should be configured to match
# the maximum value specified for Puma. Default is set to 5 threads for minimum
# and maximum; this matches the default thread size of Active Record.
#
max_threads_count = ENV.fetch('RAILS_MAX_THREADS') { 5 }
min_threads_count = ENV.fetch('RAILS_MIN_THREADS') { max_threads_count }
threads min_threads_count, max_threads_count
```

Hence, to summarize this is how they are layered: "Server / VM" => "Heroku Dyno" => "Puma Worker" => "Puma Thread"

If we have a configuration with 4 Heroku Dynos, 2 Puma workers and 5 Puma threads, our application can process 40 web requests in parallel.
