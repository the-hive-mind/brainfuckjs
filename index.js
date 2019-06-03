const prompt = require('prompt-sync')();

const executeInstruction = (instructionSet, memory, pointer, output) => {
    for (let i = 0; i < instructionSet.length; i++) {
        const instruction = instructionSet[i];

        switch (instruction) {
            case '>':
                ++pointer;
                break;
            case '<':
                --pointer;
                break;
            case '+':
                // Uint8-ified addition
                memory[pointer] = ((memory[pointer] || 0) + 1) % 256;
                break;
            case '-':
                // Uint8-ified substraction
                memory[pointer] = ((memory[pointer] || 0) - 1) & 255;
                break;
            case '.':
                output.push(String.fromCharCode(memory[pointer]));
                break;
            case ',':
                memory[pointer] = String(prompt('Enter one character: ')).charCodeAt(0);
                break;
            case '[':
                // Find nested loop
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

                // Execute nested loop
                const nestedInstructions = instructionSet.slice(i + 1, nestedEnd);
                i = nestedEnd;
                while (memory[pointer] !== 0) {
                    ({pointer} = executeInstruction(nestedInstructions, memory, pointer, output));
                }
                break;
            default:
                throw new Error('Unexpected Instruction!');
        }
    }

    return {
        pointer,
    };
};

const interpret = (instructions, memory = [], pointer = 0, output = []) => {
    // Split instructions
    const instructionSet = instructions.
        replace(/[^\.\[\]\,\<\>\+\-]/g, '').
        split('');

    // execute all instructions
    ({ pointer } = executeInstruction(instructionSet, memory, pointer, output));

    // return memory, pointer
    return {
        memory,
        pointer,
        output,
        print: () => { console.info(output.join('')); },
    };
};

module.exports = {
    interpret,
};