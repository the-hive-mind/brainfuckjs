const executeInstruction = (instructionSet, input, memory, pointer, output) => {
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
                const value = input.pop();
                memory[pointer] = value ? String(value).charCodeAt(0) : 0;
                break;
            case '[':
                let nestedEnd, openLoops = 1;

                // Find nested loop
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

const interpret = (instructions, input = [], memory = [], pointer = 0, output = []) => {
    // Split instructions
    const instructionSet = instructions.
        replace(/[^\.\[\],<>+-]/g, '').
        split('');

    // reverse input
    input.reverse();

    // execute all instructions
    ({ pointer } = executeInstruction(instructionSet, input, memory, pointer, output));

    // return memory, pointer
    return {
        memory,
        pointer,
        output,
        print: () => { process.stdout.write(output.join('')); },
    };
};

module.exports = {
    interpret,
};
