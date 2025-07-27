---
layout: post
title:  "Text To Speech and Speech to Text using Rails"
date:   2025-03-07 19:35:42 +0530
categories: ['Rails']
---


# Why?

# What?

- Text to speech and speech to text using Rails
  - Realtime vs Non-realtime
    - There is no delay. i.e. for speech to text, words appear on the screen as and when they are spoken.
    - In non-realtime, they wait for the sentence to complete and only then show the transcript of what was spoken.
    - Same for Text to speech, it does not play the audio until the entire response is ready.
    - For realtime text to speech, it plays the audio while the response is being generated.
    - How much of a difference is that? We will need to check
  - Lets just consider realtime for now and not non-realtime
  - Different providers for Realtime STT and TTS:
    - OpenAI Realtime using Websockets
      - In websocket implementation, browser interacts with Open AI via the Rails server.
      - Implementation:
        - Either use ruby-openai directly as per snippets from [this discussion](https://github.com/alexrudall/ruby-openai/issues/524)
        - Or use [Open AI realtime gem](https://github.com/openai/openai-realtime-api-beta?tab=readme-ov-file)
        - Or using Faye for websockets which is similar to [this](https://github.com/alexrudall/ruby-openai/pull/545) or [this](https://jonsully.net/blog/twilio-openai-realtime-rails) -> (this is also the current implementation)
        - Or using Async for websockets
    - OpenAI realtime using WebRTC
      - In webrtc implementation, browser interacts with OpenAI directly after Rails server just creates initial token.
      - Implementation:
        - Either use ruby-openai directly as per snippets from [this discussion](https://github.com/alexrudall/ruby-openai/issues/524)
        - Use [this branch](https://github.com/alexrudall/ruby-openai/pull/582) which is an addition on ruby-openai just for generating ephemeral token which is needed for webrtc.
    - Google Cloud STT and TTS
      - This is robust but paid and not Ruby centric.
    - Webspeech API (Only in Chrome)
      - This only happens directly in the browser, i.e. TTS and STT happens in the browser.
      - It is fast but is browser specific, i.e only supported in chrome I think   
    - Asssembly, Eleven Labs, Deepgram
      - These are either good for TTS and STT
      - None of these have a direct ruby client and will need to be investigated individually as for how to implement.
     

## Implementation with OpenAI and Websockets

- There are three important js files:
  - voice_chat_ai_manager.js
  - audio_manager.js
  - voice_chat_ai_channel.js
  - realtime_controller.js
- There are also corresponding rb files
  - voice_chat_ai_channel.rb
   

### Doubts

- audio management is done in audio_manager and is also done in voice_chat_ai_manager. Is it required in both?
- there are many unused variables in voice_chat_ai_manager. can we remove those?
