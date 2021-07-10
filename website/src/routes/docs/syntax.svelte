<script lang="ts">
  import { onMount } from 'svelte';
  import { hljs } from '../../../../editor/src/config/highlight';
  import Code from '../../components/Code.svelte';

  onMount(() => {
    document.querySelectorAll('.language-vyaakaran-grammar').forEach((element) => {
      element.innerHTML = hljs.highlight('vyaakaran grammar', element.textContent).value;
    });
  });
</script>

<svelte:head>
  <title>Syntax cheatsheet | Vyaakaran</title>
</svelte:head>

<div class="fixed bg-cyan-500 w-96 h-96 rounded-full filter blur-3xl opacity-[0.07] top-10 left-20" />
<section class="max-w-3xl mx-auto px-8 mb-32 prose relative">
  <h1>
    Vyaakaran Syntax
  </h1>
  <div class="mt-4 flex items-center space-x-3 text-blue-gray-400">
    <img src="https://github.com/blenderskool.png" width="32" height="32" class="rounded-full" />
    <span>By <a href="https://akashhamirwasia.com" target="_blank">Akash Hamirwasia</a></span>
  </div>

  <div class="mt-16 text-blue-gray-400">
    <p>
      Vyaakaran's grammar syntax is based on the notations taught in colleges and found in various literatures.
      It is very easy to start writing grammars following this syntax. Below document goes over the complete syntax
      and notations used in Vyaakaran.
    </p>
    <h2>Reserved symbols</h2>
    <p>
      Before we go into the syntax of major tokens, it is important to understand the reserved symbols in the language
      and the special meaning they hold. This is because these symbols cannot be used in the non-terminals and terminals defined later on.
    </p>
    <ul>
      <li>
        <strong>Epsilon, Lambda</strong> &mdash; defined by <Code>ε</Code>, <Code>λ</Code> or <Code>#</Code>.
        Used to denote the null symbol.
      </li>
      <li>
        <strong>Follow symbol</strong> &mdash; defined by <Code><span class="whitespace-nowrap">-></span></Code>.
        Used to denote the expansion of a non-terminal.
      </li>
      <li>
        <strong>Or symbol</strong> &mdash; defined by <Code>|</Code>.
        Used to merge productions that expand same non-terminal. These productions can be merged to single production separated by Or symbol.
      </li>
      <li>
        <strong>Dot symbol</strong> &mdash; defined by <Code>.</Code>.
        Used to denote the end of a production and beginning of next production.
      </li>
      <li>
        <strong>Other reserved symbols</strong> &mdash; <Code>$</Code>.
        These symbols are reserved for internal use and currently serve no meaning when used in conjunction with other symbols
      </li>
    </ul>

    <h2>Non-terminals</h2>
    <p>
      Non-terminals are defined by tokens that start with an <strong>uppercase english character</strong> and optionally followed by any other non-reserved symbols.
      Following are examples of valid non-terminals.
    </p>
    <pre>
      <code class="language-vyaakaran-grammar">
        S
        Abc
        Add_Term
        Multiply123
        Special_Symbol'
      </code>
    </pre>

    <h2>Terminals</h2>
    <p>
      Terminals are defined by tokens that start with any non uppercase english character and optionally followed by any other non-reserved symbols.
      Following are examples of valid terminals.
    </p>
    <pre>
      <code class="language-vyaakaran-grammar">
        a
        123
        +
        _63
        small_Capital
      </code>
    </pre>

    <h2>Single line comments</h2>
    <p>
      Single line comments start with <Code>//</Code> followed by the comment. Multi-line comments are currently not supported.
      Example of comments is shown below.
    </p>
    <pre>
      <code class="language-vyaakaran-grammar">
        // This is a comment...
      </code>
    </pre>

    <h2>Examples of valid Vyaakaran grammars</h2>
    <p>
      Following are few examples of grammars written according to Vyaakaran syntax.
      <br />
      <br />
      <strong>Note:</strong> It is important that each production ends with Dot symbol <Code>.</Code> before starting a new production.
    </p>
    <pre>
      <code class="language-vyaakaran-grammar">
        // This grammar accepts strings that ends with 1.
        S -> 0 S | 1 S | 1.
      </code>
    </pre>
    <pre>
      <code class="language-vyaakaran-grammar">
        // This grammar matches a math expression with +, * and () operators.
        S -> Expr.
        Expr -> Expr + MulTerm | MulTerm.
        MulTerm -> MulTerm * Term | Term.
        Term -> 0 | 1 | ( Expr ).
      </code>
    </pre>
    <pre>
      <code class="language-vyaakaran-grammar">
        // This grammar matches strings with characters in either
        {'// {a, b}, {b, c} or {a, c} sets.'}
        S -> # | a B | a C | b A | b C | c A | c B.
        A -> b A | c A | #.
        C -> a C | b C | #.
        B -> a B | c B | #.
      </code>
    </pre>
  </div>
</section>