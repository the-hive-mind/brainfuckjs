const prompt = require('prompt-sync')();

const increase = (memory, position) => {
    if (memory[position] === undefined) {
        memory[position] = 1;
        return;
    }

    memory[position]++;
}

const decrease = (memory, position) => {
    if (memory[position] === undefined) {
        memory[position] = -1;
        return;
    }

    memory[position]--;
}

const addLog = (printLog, memory, position) => {
    const character = String.fromCharCode(memory[position]);
    printLog.push(character);
    return printLog;
};

const print = (printLog) => {
    console.info(printLog.join(''));
}

const filterSource = (sourceCode) => {
    const instructions = sourceCode.replace(/[^\[\]\.\,\<\>\+\-]/g, '');
    return instructions;
}

const shiftLeft = (memory, pointer) => {
    const newPointer = pointer - 1;

    if(memory[newPointer] === undefined) {
        memory[newPointer] = 0;
    }

    return {
        memory,
        pointer: newPointer
    };
}

const shiftRight = (memory, pointer) => {
    const newPointer = pointer + 1;

    if(memory[newPointer] === undefined) {
        memory[newPointer] = 0;
    }

    return {
        memory,
        pointer: newPointer
    };
}

const memoryDump = (memory) => {
    const represenation = JSON.parse(JSON.stringify(new Int32Array(memory)));
    console.log(represenation);
};

const interpret = (sourceCode, memory = [], pointer = 0, shouldPrint = true) => {
    let instructions = filterSource(sourceCode); 
    let printLog = [];

    // Initial value for pointer position
    if (memory[pointer] === undefined) {
        memory[pointer] = 0;
    }

    while (instructions.length > 0) {
        // obtain next character
        const nextChar = instructions.charAt(0);
        instructions = instructions.slice(1);

        switch (nextChar) {
            case '+': 
                increase(memory, pointer);
                break;
            case '-': 
                decrease(memory, pointer);
                break;
            case '<':
                ({memory, pointer} = shiftLeft([...memory], pointer));
                break;
            case '>':
                ({memory, pointer} = shiftRight([...memory], pointer));
                break;
            case '.':
                (printLog = addLog([...printLog], memory, pointer));
                break;
            case '[':
                let openLoops = 1;
                let charIndex = 0;
                while (openLoops > 0) {
                    // Another opening
                    if (instructions.charAt(charIndex) === '[') {
                        openLoops++;
                    }
                    
                    // Another closing
                    if (instructions.charAt(charIndex) === ']') {
                        openLoops--;
                    }

                    if (openLoops !== 0) {
                        charIndex++;
                    }
                }

                const nestedLoopEnd = charIndex;            
                const loopInstructions = instructions.slice(0, nestedLoopEnd);
                instructions = instructions.slice(nestedLoopEnd + 1);

                // Execute Loop Instructions
                while(memory[pointer] !== 0) {
                    ({memory, pointer} = interpret(loopInstructions, [...memory], pointer, false));
                }

                break;
            case ',':
                memory[pointer] = String(prompt('Enter one character: ')).charCodeAt(0);
                break;
            default:
                // Skipping!
        }
    }

    // Print at the end if wanted...
    if (shouldPrint) {
        print(printLog);
    }

    return {
        memory,
        pointer,
    };
};

const inspect = (sourceCode) => {
    const { memory, pointer} = interpret(sourceCode, [], 0, false);
    memoryDump(memory);
    console.log('Pointer ends at position: ', pointer);
}

module.exports = {
    inspect,
    interpret,
};
