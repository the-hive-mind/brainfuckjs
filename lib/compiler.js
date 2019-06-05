const os = require("os");

const compileInstructions = (instructionSet) => {
    const jsInstructions = [];

    for (let i = 0; i < instructionSet.length; i++) {
        const instruction = instructionSet[i];
        let duplications = 0;
        switch(instruction) {
            case '<':
                for (let j = i + 1; j < instructionSet.length && instructionSet[j] === '<'; j++) {
                    ++duplications;
                    i = j;
                }
                jsInstructions.push(`p-=${1+duplications};`);
                break;
            case '>':
                for (let j = i + 1; j < instructionSet.length && instructionSet[j] === '>'; j++) {
                    ++duplications;
                    i = j;
                }
                jsInstructions.push(`p+=${1+duplications};`);
                break;
            case '+':
                for (let j = i + 1; j < instructionSet.length && instructionSet[j] === '+'; j++) {
                    ++duplications;
                    i = j;
                }
                jsInstructions.push(`m[p]=(m[p]||0)+${1 + duplications}%256;`);
                break;
            case '-':
                for (let j = i + 1; j < instructionSet.length && instructionSet[j] === '-'; j++) {
                    ++duplications;
                    i = j;
                }
                jsInstructions.push(`m[p]=(m[p]||0)-${1 + duplications}&255;`);
                break;
            case '.':
                jsInstructions.push('o+=f(m[p]);');
                break;
            case ',':
                jsInstructions.push(
                    `m[p]=c.argv[2]?c.argv[2].charCodeAt(i):0;`,
                    'i++;',
                );
                break;
            case '[':
                let openLoops = 1;
                let nestedEnd;
                for (let j = i + 1; openLoops > 0 && j < instructionSet.length; j++) {
                    if (instructionSet[j] === '[') {
                        ++openLoops;
                        continue;
                    }

                    if (instructionSet[j] === ']') {
                        --openLoops;
                    }

                    nestedEnd = j;
                }
                const instructionSubSet = instructionSet.slice(i + 1, nestedEnd);
                const compiledSubInstructions = compileInstructions(instructionSubSet);
                jsInstructions.push(
                    `while(m[p]){`,
                    ...compiledSubInstructions,
                    `}`,
                );
                i = nestedEnd;
                break;
            default:
                throw new Error(`Unexpected Instruction: "${ instruction }"!`);
        }
    }
    
    return jsInstructions;
};

const compile = (instructions) => {
    // Split instructions
    const instructionSet = instructions.
        replace(/[^\.\[\],<>+-]/g, '').
        split('');

    const jsInstructions = [];

    // initial declarations
    jsInstructions.push(
        `#!/usr/bin/env node`,
        `const m=[];`,
        `let p=0,i=0,o="";`,
        `const f=String.fromCharCode;`,
        `const c=process;`
    );

    jsInstructions.push(...(compileInstructions(instructionSet)));

    jsInstructions.push('c.stdout.write(o);');

    return {
        code: jsInstructions.join(os.EOL),
    };
};

module.exports = {
    compile,
};