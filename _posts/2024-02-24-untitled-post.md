---
title: "How to test if mailer in enqueued"
date: 2024-02-24 11:39:31
categories: ['Uncategorized']
---

<!-- wp:paragraph -->
<p class=""></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class=""></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class=""></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>  let(:mailer) { double(:tutor_mailer) }

  before do
    allow(TutorMailer).to receive(:disconnect_connection_reminder_email).and_return(mailer)
    allow(mailer).to receive(:deliver_now)
  end

 expect(TutorMailer).to have_received(:disconnect_connection_reminder_email)
    expect(mailer).to have_received(:deliver_now)</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p class="">Issue with above is that Rubocop complains because <code>instance_double</code> are preferred over <code>double</code></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>   allow(TutorMailer).to receive_message_chain(:send_approval_email, :deliver_now)
expect(TutorMailer).to have_received(:send_approval_email).with(user)</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p class=""></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="">if we use the <code>with</code> syntax while calling mailers, we can do this:</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>    context 'when user is a partner owner' do
      let(:user) { create(:user, user_type: 'general', admin: true) }
      let(:partner) { create(:partner, admin: user) }

      before do
        allow(UserMailer).to receive_message_chain(:with, :partner_owner_account_created, :deliver_now)
      end

      it 'sends an email' do
        described_class.new.perform(partner.admin.id)

        expect(UserMailer).to have_received(:with).with(user: partner.admin)
      end
    end</code></pre>
<!-- /wp:code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Here while asserting, we are not actually testing the mailer method called.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>      Sidekiq::Testing.inline! do
        expect do
          post :create, params: partner_params
        end.to change { ActionMailer::Base.deliveries.count }.by(1)

        email = ActionMailer::Base.deliveries.last
        expect(email.subject).to eq('Welcome to Learn To Be!')
        expect(email.body.encoded).to include('Login')
        expect(email.body.encoded).to include("Congratulations! You have been accepted as a Partner with Learn to Be! We've created a Partner Admin Owner account for you at learntobe.org")
        expect(email.body.encoded).to include('emily.darcy@learntobe.org')
        expect(email.to).to eq(&#91;user.email])
      end</code></pre>
<!-- /wp:code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">This is if we actually wanna test the delivery of the email without mocking</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">Issue is that we are not testing the entire email body.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">If it fails, include statement is heard to read.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p class="">Other type of mailer test is to test this mailer class as a unit test individually.</p>
<!-- /wp:paragraph -->
