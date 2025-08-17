---
title: "Rspec Tip - Assert for errors before validating result"
date: 2024-03-04 13:51:14
categories: ['Rails', 'Testing']
---

Often times, a test-case fails but we don't get a proper reason of the failure on CI. We need to run the test again on our local environment or put some kind of debug pointer to check what was the failure and why it happened. Wouldn't it be great to find what caused this error on first glance itself instead of having to re-run the test-case multiple times?

This is exactly what we try to accomplish in this pattern below. Many times, there is a service class or a PORO method which sends back a return value of true or false. If it fails, the object is accompanied with an "errors" attribute which has details about what is the failure.

For example:

Consider this code snippet:

```ruby
expect(user.accept_friend_invitation).to be_truthy

      expect(user.errors).to be_blank
      expect(user.post).to be_truthy
```

- Here the method under test is `accept_friend_invitation`
- This method returns true or false based on whether the friend invitation was successfully accepted.
- If it fails, `user.errors` has data (message and error class) which gives us more information about the error observed.
- `user.post` is one more additional assertion which is a side effect of the method under test.

Instead of the above code snippet, this is better:

```ruby
expect(user.errors).to be_blank

      expect(user.accept_friend_invitation).to be_truthy
      expect(user.post).to be_truthy
```

## Why?

- In the first code snippet, if the `accept_friend_invitation` does not perform the desired operation, it returns a `false` return value and the test-case exits because the first assertion itself fails.
- However, we are not sure why exactly this method failed. We only know that there was a failure but we will need to re-run the test case to figure out more.
- The 2nd snippet is simply a re-ordering of assertions but quite an important one.
- In the 2nd one if this method does not perform the necessary operation, the `user.errors` fails and we immediately understand what the issue is.

For more such tips, follow me on Twitter.
