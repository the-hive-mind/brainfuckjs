# A Simple JavaScript Brainfuck Toolset
You can use `brainfuckjs` either as command line tool or as library for your node projects.

## library
Using `brainfuckjs` as a library, you can either use the `interpret` or the `compiler` function exported by the module. To use `brainfuckjs` as library, install it using `npm i -S jsbrainfuck`.

### interpret example
```js
    const { interpret } = require('jsbrainfuck');
    const { memory, pointer, output, print } = interpret(
        // program
        `+++++ +++++ 
        [ > +++++ ++ > +++++ +++++ > ++++ > +++ > + <<<<< - ]
        > ++ . > + . +++++ ++ .. +++ . > ++++ . > ++ . <<< 
        +++++ +++++ +++++ . > . +++ . ----- - .----- --- . >>>> +++ 
        [ - > +++++ +++++ + < ] > . > ++ [ - > +++++ < ] > .`,
        // optional input array
        ['x'],
    );

    // Print the result to the stdout
    print();
```

### compile example
```js
    const { compile } = require('jsbrainfuck');
    const { code } = compile(
        // program
        `+++++ +++++ 
        [ > +++++ ++ > +++++ +++++ > ++++ > +++ > + <<<<< - ]
        > ++ . > + . +++++ ++ .. +++ . > ++++ . > ++ . <<< 
        +++++ +++++ +++++ . > . +++ . ----- - .----- --- . >>>> +++ 
        [ - > +++++ +++++ + < ] > . > ++ [ - > +++++ < ] > .`,
    );

    // Print the result to the stdout
    process.stdout.write(code);
```

## cli
To use `brainfuckjs` as cli, it is recommended to install it globally `npm i -g jsbrainfuck`. That way, you'll be able to use the `bfjs` command. To install `brainfuckjs` globally, use `npm i -g jsbrainfuck`.

### compiling
With `bfjs` you can compile an existing brainfuck file. Therefore, the syntax of the cli works this way:
`bjfs compile <path-to-bf-file> <output-file>`

The output will be a NodeJS CLI itself and is runnable by `node <output-file> <optional-input>` or `./<outputfile> <optional-input>` - dependent on your operating system.

### interpreting
With `bfjs` you can interpret an existing brainfuck file. Therefore, the syntax of the cli works this way:
`bfjs interpet <path-to-bf-file> <optional-input-characters>`

This will directly execute the brainfuck program and print the result to the screen.
