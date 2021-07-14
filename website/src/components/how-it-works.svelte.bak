<script lang="ts">
  import { onMount } from 'svelte';
  import Code from '../../components/Code.svelte';
  import { hljs } from '../../../../editor/src/config/highlight';

  onMount(() => {
    document.querySelectorAll('.language-vyaakaran-grammar').forEach((element) => {
      element.innerHTML = hljs.highlight('vyaakaran grammar', element.textContent).value;
    });
  });
</script>

<svelte:head>
  <title>How Vyaakaran works | Vyaakaran</title>
</svelte:head>

<div class="fixed bg-cyan-500 w-96 h-96 rounded-full filter blur-3xl opacity-[0.07] top-10 left-20" />
<section class="max-w-3xl mx-auto px-8 mb-32 prose relative">
  <h1>
    How Vyaakaran works
  </h1>
  <div class="mt-4 flex items-center space-x-3 text-blue-gray-400">
    <img src="https://github.com/blenderskool.png" width="32" height="32" class="rounded-full" />
    <span>By <a href="https://akashhamirwasia.com" target="_blank">Akash Hamirwasia</a></span>
  </div>

  <div class="mt-16 text-blue-gray-400">
    <p>
      Vyaakaran is a browser-based tool to visualize grammars in the form of automata, parse tables, and other concepts in formal language theory.
      I started working on Vyaakaran as a way to better learn compilers and language writing and also build a useful project along the way for
      others to learn the same. I find this as one of the best fields in computer science and by the end of this article, I hope you think the same :)
    </p>

    <h2>
      Understanding the layers in Vyaakaran
    </h2>
    <p>
      The core of Vyaakaran does a lot of things to convert your grammar to respective automata and parse tables. The entire process is broken down
      into a bunch of layers that are responsible for performing a specific operation.
    </p>
    <ul>
      <li><strong>Lexer</strong> &mdash; Breaks down the input grammar to a bunch of individual tokens.</li>
      <li><strong>Parser</strong> &mdash; Uses the tokens from Lexer to validate the syntax of the input grammar and generates a parse tree out of the input grammar.</li>
      <li><strong>Analyzer</strong> &mdash; Analyzes the parse tree to find and perform various checks on the grammar. This may include finding unreachable or undefined symbols, etc.</li>
      <li><strong>Converters</strong> &mdash; Specific algorithms that convert the parse tree to required outputs (eg. Finite automata, parse tables, regular expressions, etc.)</li>
    </ul>
    <p>
      This looks similar to the components taught in the Compiler Design CS courses. And yes, it is! Remember I had mentioned that I was learning about compilers when I started working on Vyaakaran.
      So most of the higher-level architecture is similar to that taught in my course. Let's understand each of the above layers in detail in the further sections.
    </p>

    <h2>1. Lexer</h2>
    <p>
      Lexer's job is to simply break down the input program into a bunch of small indivisible sets of characters. I think it's best explained by the following diagram.
      <img src="/how-it-works/lexer.png" class="rounded-lg my-10" />
      The input in this image was a single line of grammar production. The lexer takes the input and breaks it into an array of individual tokens. These tokens are
      not always just a single character. A token can also be a group of characters. <Code>-></Code> has two characters but is a single token.
    </p>

    <h2>2. Parser</h2>
    <p>
      This is a very important component in the compiler as it is responsible for validating the syntax of the input grammar. Vyaakaran has its own
      syntax that you can read more about <a href="/docs/syntax">here</a>. Before the analysis or conversion of the input grammar happens, the parser first evaluates
      the input grammar to check if it falls in the language understood by Vyaakaran.
    </p>

    <h3>What's a language?</h3>
    <p>
      I'm sure you would have heard of the term "programming language" before in some form. A keyword in this term is "language". What does a language mean?
      Language can be thought of as a set of rules that if followed would give sentences that are a part of that language.
      Many languages that we use for day-to-day conversations are very complex and have a lot of rules that define them. But when we think of a programming language,
      which is very constrained and systematic, we can easily define various rules in that language simply by writing its "grammar".
    </p>
    <p>
      <a href="https://en.wikipedia.org/wiki/Formal_grammar" target="_blank">Grammar</a> is the set of rules that defines a language. I'm not going to go into how they
      are written and their notations, feel free to go through the linked reference. Since Vyaakaran is also a type of programming language, even it has its own grammar
      that looks like this
    </p>

    <pre>
      <code class="language-vyaakaran-grammar">
        // Grammar to match CFGs in Vyaakaran
        S -> Stmt.
        Stmt -> non_terminal follow Symbol Expression dot Stmt | #.
        Expression -> or Symbol Expression | #.
        Term -> non_terminal NextTerm | terminal NextTerm.
        NextTerm -> Term | #.
        Symbol -> Term | empty.
      </code>
    </pre>

    <p class="italic">I sometimes find it very meta that Vyaakaran has a grammar to match other grammars!</p>

    <h3>Working of the parser</h3>
    <p>
      The parser uses the above grammar to match the input grammar using the <a href="https://en.wikipedia.org/wiki/LL_parser" target="_blank">LL(1)</a> parsing
      algorithm. There are many other parsing algorithms like LR(0), LR(1), LALR(1), and so on. I chose to go with LL(1) simply because it was easier to understand
      and code from scratch. Vyaakaran's grammars are all LL(1) parsable, so that was an added bonus.
    </p>
    <p>
      While parsing, the parser also generates a <strong>parse tree</strong> that is a complete representation of the input grammar in the form that can be understood
      by various algorithms at the later stages. Here's how the parse tree of the previous example from Lexer looks like once it's parsed.
      <img src="/how-it-works/parser.png" class="rounded-lg my-10" />
      Pretty big for a small line of code! Parse trees become big and hard to understand very quickly. The above image need not make complete sense for the next sections.
      Designing and building the parser was definitely one of the challenging tasks in this project.
    </p>

    <h2>3. Analyzer</h2>
    <p>
      Also known as a semantic analyzer, the job of this layer is to make sense of the semantics of the input grammar. In programming languages, this component plays
      a vital role in type checking, checking undeclared variables, etc. Special semantic actions are embedded in the grammar rules defined in the parser, which
      the semantic analyzer executes to understand the semantics of the input code.
    </p>
    <p>
      Vyaakaran does not have a traditional semantic analyzer. It performs basic semantic checks on the generated parse tree itself with the help of
      various algorithms. This has its own pros and cons:
    </p>
    <p><strong>Pros:</strong></p>
    <ul>
      <li>The grammar of the language remains easy to understand without any embedded SDTs or SDDs.</li>
      <li>Implementation of the parser remains simple as there's no need to pass semantic state information across rules.</li>
      <li>Algorithms for basic semantic analysis remain separate from each other, making them easy to understand and manage.</li>
    </ul>
    <p><strong>Cons:</strong></p>
    <ul>
      <li>
        The only con I can think of is that the performance might be lesser as each algorithm in semantic analyzer would traverse through
        the parse tree on its own separately. With SDTs and SDDs embedded in the grammar rules themselves, all the semantic analysis can happen
        at once together.
      </li>
    </ul>
    <p>
      The Analyzer layer in Vyaakaran runs a bunch of algorithms on the parse tree of input grammar to check for various things like
      unreachable and undeclared non-terminals and also any left recursion among the rules. These algorithms are moderately difficult since
      they operate on a Tree-like data structure, there is a lot of recursions involved.
    </p>

    <h2>4. Converters</h2>
    <p>
      The last layer in Vyaakaran's core is Converters. They are algorithms that deal with the generation of finite automata, parse tables,
      regular expressions, and much more. They operate on the parse tree generated by the parser and validated by the analyzer.
      This is something different from the standard structure of a compiler, where it would generate intermediate code after semantic analysis.
    </p>
    <p>
      In Vyaakaran, there's <strong>no intermediate code to generate</strong>, hence these algorithms simply use the data gathered by the parser and analyzer
      to generate the required outputs. There are a lot of interesting and recursive algorithms under the hood that makes this possible,
      which I may explain in a different article in the future.
    </p>

    <h2>Conclusion</h2>
    <p>
      Compilers are definitely a fascinating domain in Computer Science. When I started learning about compilers in my college and started building
      Vyaakaran, I realized how it entailed all the core concepts of Computer Science like Data Structures, Algorithms, Theory of Computation, etc.
      Compilers are something not all of us would build in a day-to-day job, but it's still an interesting topic to learn about considering how reliant
      all of us are on them.
    </p>
    <p>
      As for Vyaakaran, even though it may not be a standard compiler by nature, I have learned a lot while building it, and I hope it is helpful
      to anyone learning about these topics.
    </p>
  </div>
</section>