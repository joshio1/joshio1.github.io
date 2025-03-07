---
title: "Rails Testing Magic Tools: seed and bisect"
date: 2022-06-30 11:28:54
categories: ['Minitest', 'Rails', 'Rails Testing', 'Rspec', 'ruby on rails']
---

<!-- wp:paragraph -->
<p>Testing is a huge aspect of a Ruby on Rails developer's life. Concepts like TDD are <a href="https://learntdd.in/rails/">hugely popular</a> and also <a href="https://dhh.dk/2014/tdd-is-dead-long-live-testing.html">heavily contested</a> at the same time in the Rails community. Even if a company follows test-first development  or not, tests still remain crucial to maintain the quality of a Ruby on Rails app. Tests allow a developer to <a href="https://www.codewithjason.com/podcast/9478210-105-the-benefits-of-a-test-oriented-development-workflow-with-chris-labarge/">reduce the cognitive burden</a> while developing a feature. As a Ruby on Rails application increases in size, tests become a significant part of the code base.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>As the number of tests in an application increases, test suite stability becomes a concern. If a test suite is not stable, developers lose confidence and also become less productive. One thing which leads to this lack of productivity are flaky tests. A flaky test by definition is that test which fails intermittently. i.e. if it fails on <a href="https://www.atlassian.com/continuous-delivery/continuous-integration/tools">CI</a>, re-running the same test with the same configuration, the test passes.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>There is one common pattern in investigating and fixing flaky tests. When tests are run on CI, the tests generally run in a random order which is governed by the random <code>seed</code> value generated during every run. I'm taking <code><a href="https://relishapp.com/rspec/rspec-core/v/3-0/docs/configuration/set-the-order-and-or-seed">Rspec</a></code> as an example but similar concepts also exists in <code><a href="https://apidock.com/ruby/MiniTest/Unit/process_args">Minitest</a></code>.<br>For example, we can see below the logs which are generated on running the tests:<br></p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">demo-app git:(development) rspec spec
Run options:
All examples were filtered out; ignoring {:focus=&gt;true}

Randomized with seed 8853</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>As seen above, the test suite ran with a random seed number of <code>8853</code> . If we run the test suite again using <code>rspec spec</code>, we will see that the test suite will be run with a different number. This seed value is responsible for the order in which the test cases are executed inside a test suite. Now, in some cases, intermittent tests are because of the order in which the test-cases are executed. This is the reason why it fails in one CI run whereas it succeeds in a re-run. Hence, we can use this <code>seed</code> value to reproduce the test failure. i.e. let's say a test suite fails with seed number <code>8853</code> but passes on a re-run when the seed number is <code>8752</code> , we could have a way to reproduce the failure. If we run the test suite using <code>rspec spec --seed 8853</code> , we will always get a failure.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Now, once we have a way to reproduce the failure, next step is to find the smallest possible set of test-cases to reproduce the failure. For eg. even if we know that the test suite always fails with seed value of <code>8853</code> , there might be around 5000 tests in a test suite which take around 5 minutes to run. (How to optimize and reduce the unit test execution time is a topic which requires a separate blog post) Since it's very tedious to run the entire test suite of 5000 tests when only a single test is failing, we need to find a better way to reproduce the failure. In other words, we need to find a smaller set of test cases which will help us in reproducing the failure.  There is one magic tool which helps us in this regard. It's called <a href="https://relishapp.com/rspec/rspec-core/docs/command-line/bisect">rspec --bisect</a> or <a href="https://github.com/seattlerb/minitest-bisect">minitest-bisect</a>.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The general idea around <code>bisect</code> is to run the test suite several times using the same seed to reduce the set of test cases to produce a failure. For example, consider a scenario where there are 5000 test-cases in a test suite. There is a test case T1 which fails intermittently. We find out that T1 always fails for a seed value of S1. Generally, when this is the case, there is a test-case T2 which causes the test-case T1 to fail. The flakiness of the test-cases is because of the order in which the test-cases are executed. So, let's say the test suite only fails when T2 is executed before T1. In this scenario, we already have found out the seed number S1 which makes T2 execute before T1. Now, the challenge is to find T2 from a set of 5000 test-cases. Finding T2 is like finding a needle in the haystack. This is where the <code>bisect</code> command helps us. The <code>bisect</code> command essentially runs the test suite several times with seed S1 and finds the minimum possible reproducible command. The basic idea behind <code>bisect</code> is partitioning by binary search. This is how it works:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>Let's say when test suite is run with S1, T2 is the 350th test-case and T1 is the 400th test-case. We know that T1 is the failing test-case. The bisect command just needs to find T2, i.e. the test case number in combination with which the test case T1 fails. At every step, the <code>bisect</code> command only runs half the test-cases along with T1.</li><li>First, the <code>bisect</code> command only runs from test case number 2500 to test case 5000 along with Test case T1. It finds that there were no failures. So, it assumes that T2 must be in 1 to 2499.  It throws away one half from 1 to 2499.</li><li>Hence, the <code>bisect</code> command runs test case number 1251 to test case number 2499 and T1. It finds that again there were no failures. Now, it discards 1251 to 2499. Now, it knows that T2 must be in 1 to 1250</li><li>Now, it runs 625 to 1250 and T1. Again, no failures. Discards 625 to 1250. T2 must only be in 1 to 625.</li><li>It now re-runs the suite only from 312 to 625 and T1. The test suite surprisingly fails this time. The command now knows that T2 must be in 312 to 625 since the test-case T1 failed this time.</li><li>It now runs from 469 to 625. It finds no failures. So, T2 must be in 312 to 469.</li><li>Now, it runs 390 to 469. Discards 390 to 469. Keeps 312 to 390 since it knows that T1 must be in it.</li><li>Runs 351 to 390. Discards 351 to 390. Keeps 312 to 350.</li><li>Runs 331 to 350. Keeps 331 to 350. </li><li>Runs 340 to 350. Keeps 340 to 350.</li><li>Runs 345 to 350. Keeps 345 to 350.</li><li>Runs 348 to 350. Keeps 348 to 350.</li><li>Runs 349 to 350. Keeps 349 to 350.</li><li>Runs 350. Keeps 350.</li><li>Hence, it finally finds test-case T2 which is test-case number 350. Thus, if we run test-case number 350 along with T1, we will always get a failure. This is the minimal possible reproducible command which causes the failure. Now, it's very easy for us to find out what is happening.</li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>This is a sample log output from an actual <code>rspec bisect</code> command:</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre id="block-e57d1569-a08f-44a2-9390-0d420863215d" class="wp-block-preformatted">Round 1: bisecting over non-failing examples 1-210 .. ignoring examples 106-210 (1 minute 15.89 seconds)<br>Round 2: bisecting over non-failing examples 1-105 .. ignoring examples 54-105 (1 minute 9.82 seconds)<br>Round 3: bisecting over non-failing examples 1-53 .. ignoring examples 28-53 (1 minute 10.72 seconds)<br>Round 4: bisecting over non-failing examples 1-27 .. ignoring examples 15-27 (1 minute 0.55 seconds)<br>Round 5: bisecting over non-failing examples 1-14 . ignoring examples 1-7 (24.19 seconds)<br>Round 6: bisecting over non-failing examples 8-14 .. ignoring examples 12-14 (42.96 seconds)<br>Round 7: bisecting over non-failing examples 8-11 . ignoring examples 8-9 (21.37 seconds)<br>Round 8: bisecting over non-failing examples 10-11 .. ignoring example 11 (44.46 seconds)<br>Bisect complete! Reduced necessary non-failing examples from 210 to 1 in 7 minutes 10 seconds.<br><br>The minimal reproduction command is:<br>  rspec ./spec/models/t2_spec.rb[1:5:1:1:1] ./spec/models/t1_spec.rb[1:2:2] --seed 19431</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>Some of the possible patterns in this kind of failures are as follows:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>Let's say one test-case is switching the <a href="https://github.com/mperham/sidekiq/wiki/Testing">Sidekiq testing mode</a> from <code>inline</code> to <code>fake</code> which is impacting the other test-case which needs the Sidekiq mode to be <code>inline</code> </li><li>One test-case could be <a href="https://apidock.com/rails/v5.2.3/ActiveSupport/Testing/TimeHelpers/travel">changing the time</a> and not setting back the default time after the test-case is executed. This fails the other test-case which only passes on the assumption that the time is not modified.</li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>In general, this pattern is observed when a test-case's side-effects spills onto other test-cases. Hence, good practice is to avoid writing test-cases which have a side-effect. Few possible ways to remedy this are as follows:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>If we need to change the Sidekiq testing mode, we should make sure that we do it in a block or have an <a href="https://relishapp.com/rspec/rspec-core/v/2-0/docs/hooks/before-and-after-hooks">after</a> block which restores the setting back to the default value.</li><li>Similarly, if a test-case modifies the clock in any way, it should be either done in a block such that it is automatically rolled back or else it must be in an <code>after</code> block.<br></li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>References:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li><a href="https://relishapp.com/rspec/rspec-core/docs/command-line/bisect">Rspec Bisect</a> </li><li><a href="https://github.com/seattlerb/minitest-bisect">minitest-bisect</a> </li><li><a href="https://relishapp.com/rspec/rspec-core/v/3-0/docs/configuration/set-the-order-and-or-seed">Rspec Seed</a></li></ul>
<!-- /wp:list -->
