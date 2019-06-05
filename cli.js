#!/usr/bin/env node

const fs = require('fs');
const { compile, interpret } = require('./index');

const [,, ...args] = process.argv;

const [command, program, input] = args;

(async () => {
    if (!['compile', 'interpret'].includes(command)) {
        throw new Error(`Unknown command: "${command}"!`);
    }

    if (!fs.existsSync(program)) {
        throw new Error('Path does not exist!');
    }

    const content = fs.readFileSync(program).toString('utf8');

    if (command === 'interpret') {
        // input is the user input stream in this context
        let inputList = [];
        if (input !== undefined) {
            inputList = input.split('');
        }
    
        const result = interpret(content, inputList);
        result.print();
    } else if (command === 'compile') {
        // input is the output path of the compiled file in this context
        const { code } = compile(content);
        fs.writeFileSync(input, code);
        process.stdout.write('Compiled brainfuck program!');
    } 
})().catch(error => { 
    process.stderr.write(error.stack);
});
