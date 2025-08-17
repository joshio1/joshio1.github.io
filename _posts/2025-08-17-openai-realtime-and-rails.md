---
title: "OpenAI Realtime and Rails Simplified"
date: 2025-08-17 10:00:00
categories: ['Rails', 'OpenAI', 'AI', 'WebRTC', 'WebSockets']
---

OpenAI has a new API called <a href="https://platform.openai.com/docs/guides/realtime">OpenAI Realtime API</a>. Now you might ask how is this different from the existing OpenAI API? Or where can we use this?

This article is to answer all these basic questions to decide which solution to go forward with.

> **Note**: If you're new to integrating OpenAI with Rails, check out my previous post on <a href="/posts/integrate-openai-api-with-rails/">how to integrate OpenAI API with Rails</a> which covers the basics of using the standard Completions API.

# How is this different from the existing OpenAI API?

OpenAI has their usual <a href="https://platform.openai.com/docs/guides/text-generation">Completions API</a> which is similar to ChatGPT. i.e. you send a prompt and it sends back a response.

For some applications where we need instantaneous response, this Completions API is not suitable.
For example - If we are developing a voice chatbot, waiting for the AI to respond may seem slow.

In such cases, we use the <a href="https://platform.openai.com/docs/guides/realtime">OpenAI Realtime API</a>.

# Different implementation - WebSockets vs WebRTC

After you have decided that you need this realtime API, you have two options to implement this:

1. <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API">WebSockets</a>
2. <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API">WebRTC</a>

The key difference is in how the data flows. There are three key players:
1. User's browser
2. Rails server
3. OpenAI server

Let's consider a voice chatbot. i.e. user asks a question to AI using audio and AI responds back with audio.

**WebSockets approach:**
In WebSockets, the user's audio is sent to the Rails server and the Rails server sends this to the OpenAI server. OpenAI responds back and the Rails server relays this response to the user's browser.

> For Rails WebSocket implementation, you can use <a href="https://guides.rubyonrails.org/action_cable_overview.html">Action Cable</a> which provides a seamless integration with your Rails application.

**WebRTC approach:**
In WebRTC, the user's audio is sent directly to AI by the browser and the AI's response is sent back to the browser. The browser can then relay this information to the Rails backend server to store information.
 

# When to use WebRTC vs WebSockets?

- **WebRTC** is the general recommended solution for production ready apps since it has less latency and gives a more "realtime" feel.
- However if you want to modify the AI's response before sending it to the user, you should use **WebSockets**. Or if you want to do any processing on the AI's response before sending it to the user, you should use **WebSockets**.
- If you want to modify the user's audio before sending it to AI, you should use **WebSockets**.
- If you don't need any of the above, **WebRTC** is the way to go.

# Getting Started

To get started with implementing either approach in your Rails application:

1. **For WebSockets**: Check out the <a href="https://guides.rubyonrails.org/action_cable_overview.html">Rails Action Cable documentation</a> and the <a href="https://platform.openai.com/docs/guides/realtime/integration">OpenAI Realtime integration guide</a>.

2. **For WebRTC**: Review the <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_the_Network_Audio_API">WebRTC Audio API documentation</a> and OpenAI's <a href="https://platform.openai.com/docs/guides/realtime">official Realtime API examples</a>.

3. **Authentication**: Don't forget to secure your implementation. For WebSocket approaches, you can leverage Rails' built-in authentication, while WebRTC implementations will need to handle API key management carefully on the client side.

# Conclusion

The OpenAI Realtime API opens up exciting possibilities for building more interactive and responsive AI-powered applications. Whether you choose WebSockets or WebRTC depends on your specific use case, latency requirements, and whether you need server-side processing of the audio data.

For most Rails developers, starting with the WebSocket approach using Action Cable might be more familiar and easier to integrate with existing Rails authentication and business logic patterns.
