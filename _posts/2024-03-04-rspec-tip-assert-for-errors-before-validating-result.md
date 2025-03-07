---
title: "Rspec Tip - Assert for errors before validating result"
date: 2024-03-04 13:51:14
categories: ['Rails', 'Testing']
---

<!-- wp:paragraph -->
<p class="">Often times, a test-case fails but we don't get a proper reason of the failure on CI. We need to run the test again on our local environment or put some kind of debug pointer to check what was the failure and why it happened. Wouldn't it be great to find what caused this error on first glance itself instead of having to re-run the test-case multiple times?</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="">This is exactly what we try to accomplish in this pattern below. Many times, there is a service class or a PORO method which sends back a return value of true or false. If it fails, the object is accompanied with an "errors" attribute which has details about what is the failure.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="">For example:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="">Consider this code snippet:</p>
<!-- /wp:paragraph -->

<!-- wp:syntaxhighlighter/code {"language":"ruby"} -->
<pre class="wp-block-syntaxhighlighter-code">      expect(user.accept_friend_invitation).to be_truthy

      expect(user.errors).to be_blank
      expect(user.post).to be_truthy</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">Here the method under test is <code>accept_friend_invitation</code></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">This method returns true or false based on whether the friend invitation was successfully accepted.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">If it fails, <code>user.errors</code> has data (message and error class) which gives us more information about the error observed.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class=""><code>user.post</code> is one more additional assertion which is a side effect of the method under test.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p class="">Instead of the above code snippet, this is better:</p>
<!-- /wp:paragraph -->

<!-- wp:syntaxhighlighter/code {"language":"ruby"} -->
<pre class="wp-block-syntaxhighlighter-code">      expect(user.errors).to be_blank

      expect(user.accept_friend_invitation).to be_truthy
      expect(user.post).to be_truthy</pre>
<!-- /wp:syntaxhighlighter/code -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Why?</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class=""><!-- wp:list-item -->
<li class="">In the first code snippet, if the <code>accept_friend_invitation</code> does not perform the desired operation, it returns a <code>false</code> return value and the test-case exits because the first assertion itself fails.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">However, we are not sure why exactly this method failed. We only know that there was a failure but we will need to re-run the test case to figure out more.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">The 2nd snippet is simply a re-ordering of assertions but quite an important one.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li class="">In the 2nd one if this method does not perform the necessary operation, the <code>user.errors</code> fails and we immediately understand what the issue is. </li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p class="">For more such tips, follow me on Twitter.</p>
<!-- /wp:paragraph -->
