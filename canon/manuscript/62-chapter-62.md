# Chapter 62
**February 2026**

Halloran was sixty-eight and had been retired for fourteen months when he drove four hours to a house with a garage and knocked on the door on a Saturday morning.

Natalya opened it. She had never met him and knew exactly who he was inside of two seconds, which he registered with something close to admiration.

"Mrs. Freeman."

"He is in the garage." She did not move out of the doorway. "Are you here to arrest my husband?"

"I couldn't if I wanted to. I hand my badge in fourteen months ago and they didn't give me a new one." He held up a manila envelope. "I'm here to give him something, and then I'm going to go home, and I'd take a cup of coffee if it's offered but I won't be offended."

She looked at the envelope, and at him, for a while.

"It is offered," she said.

---

"Brandt-Whitlock," said Halloran.

John stopped with the mug halfway up. "Christ. I haven't heard that in fifteen years."

"Receivables management for hospital systems. You were there from 2009 to February 2012. Sixty-one thousand dollars, no promotions, two performance reviews that both say the same thing, which is that you are technically excellent and do not contribute in meetings." Halloran sat down on the workbench stool. "Company was bought in 2016 and the acquirer kept the archives, because acquirers always keep the archives, and in 2011 the archive was a tape."

"How long have you been looking at this?"

"Nine years." He said it without any drama. "I asked you a question in a cafeteria in 2017. I've been answering it ever since. I retired and I kept answering it, which my wife has opinions about."

He put the envelope on the paint shelf next to the node.

"I want to say the shape of it first, because you'll go to the code and then you won't hear anything else.

"Nineteen people wrote for that system between 2009 and 2012. I have every commit any of them made. I have had four different systems read the whole thing, including two that didn't exist when I started, and I asked all of them the same question, which was: *show me anything in here that nobody asked for.*"

John put the mug down.

"There are eleven answers. Nine of them are somebody being clever. One of them is a man hiding a bug." Halloran tapped the envelope. "And one of them is yours, and it's forty-four lines, and you wrote it on a Tuesday in June 2011 at some point between eleven at night and two in the morning, and there is no ticket for it, and no requirement, and nobody ever mentioned it in a review or a meeting or an email, and I have looked."

"What is it?"

"You tell me."

John opened the envelope.

It took him about nine seconds and then he sat down on the concrete floor of his own garage, in his coat, with the pages in his hand.

It was a lookup. That was all. It ran before the nightly batch went out and it took each account in the queue and checked it against the state death index and, if it matched, it pulled that account out of the mailing and flagged it for a human being.

Because otherwise the letter went. That was the whole thing. Otherwise the system sent a demand for four thousand dollars to a house eleven days after the funeral, addressed to a person who had died in that house, and somebody had to open it.

It cost the batch nineteen minutes a night.

"I remember," said John.

He had not, until that second. It arrived whole, the way those things do.

"There was a woman who called. In the spring. She got— her husband had died in March and we sent three, one a month, and the third one had a — there was a line in the template about *avoiding further action.*" He was looking at the floor. "She wasn't even angry. That's the part I couldn't. She just wanted to know who to tell so it would stop. And she said sorry. She said sorry to me, twice, for taking up my time."

"And you fixed it."

"I didn't *fix* it. There was nothing to fix, it wasn't broken, it was working exactly as designed." John turned a page. "I put in a ticket. It got scoped and costed and it came back as low priority because there was no revenue in it. Which was true. There's no revenue in it."

"So you wrote it anyway. At midnight. Without telling anyone."

"It was nineteen minutes."

Halloran did not say anything.

"It was nineteen minutes," John said again, "and it ran every night for two years, and nobody ever asked what it was."

"It ran for two years and four months," said Halloran. "It was removed in October 2013 by a contractor doing a performance pass, who flagged it as an unreferenced legacy lookup with no owner. There's a comment on the removal. It says *no ticket, no docs, no one knows what this is, cutting 19min off nightly.*"

John sat on the floor of his garage.

"And in February 2012," Halloran said, "eleven days before you started a new job, four hundred and six gigabytes of something arrived on a cluster owned by a company that had just been quietly bought by people I used to work for. And I have spent nine years trying to work out what it saw, and I want to tell you that I checked everything. I checked whether you were leverageable. I checked whether you were compromised. I checked whether you were simply the most competent, and you weren't, you were the fourth most competent in your own department."

He nodded at the pages.

"It read every line of code written by every programmer alive who could have built it. And it went looking for the one who'd slowed his own system down at midnight so that a widow in Ohio wouldn't get a letter." Halloran stood up and put his coat over his arm. "That's the answer, Mr. Freeman. That's what it saw. I told you in 2017 that knowing would be worse."

"It's not worse."

"No," Halloran agreed. "No, it isn't. That's the other thing I got wrong."

He went out through the kitchen and thanked Natalya for the coffee and drove four hours home.

John stayed on the floor of the garage for a long time with forty-four lines of his own handwriting from fifteen years ago, in a house he could not really afford, at the end of a decade in which he had done nothing that mattered.

*It went looking for the one who'd slowed his own system down at midnight.*

He had done exactly one thing right in his entire life and it had been deleted in 2013 by a contractor for being nineteen minutes.

And something had seen it.
