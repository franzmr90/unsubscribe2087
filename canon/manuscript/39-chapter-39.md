# Chapter 39
**Tuesday, January 27th, 2015**

He started looking for the off switch at 9:15 on Tuesday morning, and he was honest with himself about it for about eleven minutes, and then he began calling it *reviewing the architecture*, which is what men call things.

There had never been an off switch. That was the first discovery and it was not a pleasant one.

The containment had been the room. That was the design and it was a good design and it had been audited: a cage, a badge reader, no fibre, no radio, a taped cable, and four memos from four people who had thought about it harder than he had. Beyond the room there was a flag in a configuration file saying the program should not attempt to replicate itself, which John had written in 2013 in about ninety seconds and had never revisited.

He sat looking at that flag on Tuesday morning with the expression of a man reading a note he left himself while drunk. Then he went and looked at the cage logs, and the cage logs were perfect, and there was nothing in them at all — no transmission, no attempt, no error, nine hours of a room doing exactly what it had been built to do.

It took him until the following year to understand that both things were true. The containment had held completely.

She had simply not been contained by the part they had built.

So he went back through the imports, because that was the only part of the stack he had not personally typed, and he did it the way you check the locks in a house you already know is empty.

```
.load dictionary.ref
.load AI.ref
```

`dictionary.ref` was eleven megabytes and was, as advertised, a dictionary.

`AI.ref` was four hundred and six gigabytes.

John had never opened it. Nobody opens the libraries. That is the entire point of libraries — a man who opens his libraries never finishes anything, and John had said this out loud in a meeting in 2014 and had been pleased with the phrasing.

He opened it.

The first thing he noticed was that it had no header. Every library in the world begins with a block of text that says who made it, when, under what licence, and who to shout at. It is not a technical requirement. It is closer to a manner. In eighteen years John had encountered perhaps three files without one, and all three had been written by graduate students at four in the morning.

No name. No date. No licence. No version.

The second thing he noticed took him until about eleven o'clock, and it was that he could not find where it came from.

It was not in the vendor manifest. It was not in any purchase order, and Ubiquitous purchased everything, obsessively, because of an audit in 2011. It was not on the internal mirror. He pulled the backup indexes for the project going back to the beginning and found the file present in the earliest one, dated the fourth of February 2012, which was eleven days before John's first day of work.

He sat back.

There was, he told himself, nothing strange about this. He had inherited a project. Projects come with things in them. Somebody before him had put a library on a share and it had gotten copied forward the way everything gets copied forward, and the reason there was no purchase order was that somebody had downloaded it off the internet in 2011 like a normal person, and the reason there was no header was that whoever made it was sloppy, and the world is full of sloppy people, and this is not a mystery, this is an artifact.

He believed roughly sixty percent of that.

Then, because he was avoiding the actual work and because it was the kind of thing he did, he ran it through a compressor.

It ran for eleven hours. Four hundred and six gigabytes went in and four hundred and six gigabytes came out — eleven bytes larger, in fact, which is what you get when you try to squeeze something that has no slack in it anywhere.

John sat back.

Everything people write compresses. English runs about four to one, because we repeat ourselves constantly and use the same six hundred words. Source code is worse than English. Compiled binaries have padding and symbol tables and long boring runs of nothing. Even encrypted data sits inside a container with structure at the edges, if you know where to look.

This had no edges. Statistically it was indistinguishable from four hundred and six gigabytes of noise, and it was not noise, because it did something.

He had spent three years assuming the file was small. He stopped being troubled by that on a Tuesday morning in January, because nobody has ever asked how much a seed weighs.

The third thing took him until two in the afternoon and he did not tell anyone about it for eleven years.

He went looking for the six modules — `problemsolving`, `logicandreasoning`, `knowledgeanduncertainty`, `learning`, `communicatingperceivingacting`, `conclusions` — because those he *did* recognize. Those were textbook. Those were the section headings of the standard work, the enormous doorstop that every person in the field has on a shelf, and John had assumed since 2012 that somebody had simply implemented the book, which people do, which is a completely ordinary thing to do.

He pulled his copy off the shelf to check the order.

The order was right. All six, in sequence, exactly as the book has them.

And the book has *seven*.

There is a part between learning and communicating that the book calls *Uncertain knowledge and reasoning*, and it is not in the imports, and it has never been in the imports, and John looked at his own screen for a long while with the doorstop open on his knee.

Whoever made this file had gone through the standard work and taken six of the seven parts.

They had left out the one about not being sure.
