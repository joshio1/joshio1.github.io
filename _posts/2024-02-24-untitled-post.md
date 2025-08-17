---
title: "How to test if mailer in enqueued"
date: 2024-02-24 11:39:31
categories: ['Uncategorized']
---

```json
let(:mailer) { double(:tutor_mailer) }

  before do
    allow(TutorMailer).to receive(:disconnect_connection_reminder_email).and_return(mailer)
    allow(mailer).to receive(:deliver_now)
  end

 expect(TutorMailer).to have_received(:disconnect_connection_reminder_email)
    expect(mailer).to have_received(:deliver_now)
```

Issue with above is that Rubocop complains because `instance_double` are preferred over `double`

```shell
allow(TutorMailer).to receive_message_chain(:send_approval_email, :deliver_now)
expect(TutorMailer).to have_received(:send_approval_email).with(user)
```

if we use the `with` syntax while calling mailers, we can do this:

```json
context 'when user is a partner owner' do
      let(:user) { create(:user, user_type: 'general', admin: true) }
      let(:partner) { create(:partner, admin: user) }

      before do
        allow(UserMailer).to receive_message_chain(:with, :partner_owner_account_created, :deliver_now)
      end

      it 'sends an email' do
        described_class.new.perform(partner.admin.id)

        expect(UserMailer).to have_received(:with).with(user: partner.admin)
      end
    end
```

- Here while asserting, we are not actually testing the mailer method called.

```json
Sidekiq::Testing.inline! do
        expect do
          post :create, params: partner_params
        end.to change { ActionMailer::Base.deliveries.count }.by(1)

        email = ActionMailer::Base.deliveries.last
        expect(email.subject).to eq('Welcome to Learn To Be!')
        expect(email.body.encoded).to include('Login')
        expect(email.body.encoded).to include("Congratulations! You have been accepted as a Partner with Learn to Be! We've created a Partner Admin Owner account for you at learntobe.org")
        expect(email.body.encoded).to include('emily.darcy@learntobe.org')
        expect(email.to).to eq([user.email])
      end
```

- This is if we actually wanna test the delivery of the email without mocking
- Issue is that we are not testing the entire email body.
- If it fails, include statement is heard to read.

Other type of mailer test is to test this mailer class as a unit test individually.
