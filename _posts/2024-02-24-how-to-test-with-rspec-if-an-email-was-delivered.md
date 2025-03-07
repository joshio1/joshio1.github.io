---
title: "How to test with Rspec if an email was delivered?"
date: 2024-02-24 11:43:30
categories: ['Rails', 'Rails', 'ruby on rails', 'RubyOnRails']
---

<!-- wp:paragraph -->
<p class="">Many times, we would like to validate if a class or a method sends an email. We don't wanna worry too much about the specific details (i.e. body, subject, from, to) of the email but just wanna ensure that a certain mailer method is invoked with certain arguments.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class=""></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">This is how you can do it in <a href="https://rspec.info/">Rspec</a>:</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class=""></p>
<!-- /wp:paragraph -->

<!-- wp:syntaxhighlighter/code {"language":"ruby"} -->
<pre class="wp-block-syntaxhighlighter-code">RSpec.describe UserWelcomeWorker, type: :worker do
  let(:message_delivery) { instance_double(ActionMailer::MessageDelivery)}

  before do
     allow(UserMailer).to receive(:send_welcome_email).and_return(message_delivery)
     allow(message_delivery).to receive(:deliver_now)
  end

  it 'sends welcome email to users' do
     described_class.new.perform(user.id)

     expect(UserMailer).to have_received(:send_welcome_email).with(user).once
  end
end</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:paragraph -->
<p class=""></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">A Better Way:  Writing Custom Matcher</h2>
<!-- /wp:heading -->

<!-- wp:syntaxhighlighter/code {"language":"ruby"} -->
<pre class="wp-block-syntaxhighlighter-code">#spec/support/matchers/send_email_with.rb

RSpec::Matchers.define :send_email_with do |mailer, mailer_method, args = anything|
  match do |block|
    message_delivery = instance_double(ActionMailer::MessageDelivery)
    allow(mailer).to receive(mailer_method).and_return(message_delivery)
    allow(message_delivery).to receive(:deliver_now)
    block.call
    begin
      expect(mailer).to have_received(mailer_method).with(args).once
    rescue RSpec::Expectations::ExpectationNotMetError => e
      @error = e
      return false
    end
    true
  end

  supports_block_expectations

  failure_message do |t|
    @error
  end
end

# We can use this in our test like this:

it 'sends welcome email to users' do
  expect {
    described_class.new.perform(user)
  }.to send_email_with(UserMailer, :send_welcome_email, user)
end</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:heading -->
<h2 class="wp-block-heading">What this does not cover?</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">If an email was scheduled to be sent using <code>deliver_later</code></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">If an email was invoked using the <code>with</code> syntax like: <code>UserMailer.with(user: user).send_welcome_email</code></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">This does not include validation of the actual contents of the email including subject, email, body, from, to email address. We use mailer specs for that.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">This only shows an example in Rspec. We can follow the same approach for Minitest.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p class=""></p>
<!-- /wp:paragraph -->
