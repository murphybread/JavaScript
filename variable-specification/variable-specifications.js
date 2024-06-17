const fs = require('fs');
const path = require('path');

const srcDir = './src'; // 소스 코드 디렉토리
const outputFile = './variable_specifications.txt'; // 출력 파일

// 소스 코드 디렉토리의 모든 파일을 읽어들입니다.
function readFiles(dir, filelist = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);
        if (stat.isDirectory()) {
            filelist = readFiles(filepath, filelist);
        } else if (filepath.endsWith('.js') || filepath.endsWith('.ts')) {
            filelist.push(filepath);
        }
    });
    return filelist;
}

// 파일에서 변수 명세서를 추출합니다.
function extractVariables(filepath) {
    const code = fs.readFileSync(filepath, 'utf-8');
    const lines = code.split('\n');

    let currentClass = null;
    let currentFunction = null;
    let variables = [];

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        // 클래스 선언 추출
        if (trimmedLine.startsWith('class ')) {
            const className = trimmedLine.split(' ')[1];
            currentClass = {
                type: 'class',
                name: className,
                line: index + 1,
                functions: [],
                variables: []
            };
            variables.push(currentClass);
            currentFunction = null; // 클래스가 시작되면 현재 함수 초기화
        }
        // 함수 선언 추출
        else if (trimmedLine.startsWith('function ') || (currentClass && trimmedLine.startsWith(currentClass.name + '.prototype.'))) {
            const functionName = trimmedLine.split(/[ (]/)[1];
            currentFunction = {
                type: 'function',
                name: functionName,
                line: index + 1,
                variables: []
            };
            if (currentClass) {
                currentClass.functions.push(currentFunction);
            } else {
                variables.push(currentFunction);
            }
        }
        // 변수 선언 추출
        else if (trimmedLine.startsWith('let ') || trimmedLine.startsWith('const ') || trimmedLine.startsWith('var ')) {
            const parts = trimmedLine.split(/[ =;]/);
            const variableName = parts[1];
            const variableType = parts[0]; // 'let', 'const', 'var'
            const variable = {
                type: variableType,
                name: variableName,
                line: index + 1
            };
            if (currentFunction) {
                currentFunction.variables.push(variable);
            } else if (currentClass) {
                currentClass.variables.push(variable);
            } else {
                variables.push(variable);
            }
        }
    });

    return variables;
}

// 모든 파일의 변수 명세서를 단일 파일로 작성합니다.
function generateVariableSpecification() {
    const files = readFiles(srcDir);
    let specifications = '';

    files.forEach(filepath => {
        const variables = extractVariables(filepath);
        specifications += `File: ${filepath}\n`;
        variables.forEach(variable => {
            if (variable.type === 'class') {
                specifications += `  - class ${variable.name} (line ${variable.line})\n`;
                variable.variables.forEach(v => {
                    specifications += `    - ${v.type} ${v.name} (line ${v.line})\n`;
                });
                variable.functions.forEach(f => {
                    specifications += `    - function ${f.name} (line ${f.line})\n`;
                    f.variables.forEach(v => {
                        specifications += `      - ${v.type} ${v.name} (line ${v.line})\n`;
                    });
                });
            } else if (variable.type === 'function') {
                specifications += `  - function ${variable.name} (line ${variable.line})\n`;
                variable.variables.forEach(v => {
                    specifications += `    - ${v.type} ${v.name} (line ${v.line})\n`;
                });
            } else {
                specifications += `  - ${variable.type} ${variable.name} (line ${variable.line})\n`;
            }
        });
        specifications += '\n';
    });

    fs.writeFileSync(outputFile, specifications, 'utf-8');
    console.log(`Variable specifications have been written to ${outputFile}`);
}

generateVariableSpecification();
