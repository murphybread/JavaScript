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
        } else if (filepath.endsWith('.js')) {
            filelist.push(filepath);
        }
    });
    return filelist;
}

// 파일에서 변수 명세서를 추출합니다.
function extractVariables(filepath) {
    const code = fs.readFileSync(filepath, 'utf-8');
    const lines = code.split('\n');

    let variables = [];
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        // 변수 선언 추출
        if (trimmedLine.startsWith('let ') || trimmedLine.startsWith('const ') || trimmedLine.startsWith('var ')) {
            const variableName = trimmedLine.split(/[ =;]/)[1];
            variables.push({
                type: 'variable',
                name: variableName,
                line: index + 1
            });
        }

        // 함수 선언 추출
        if (trimmedLine.startsWith('function ')) {
            const functionName = trimmedLine.split(/[ (]/)[1];
            variables.push({
                type: 'function',
                name: functionName,
                line: index + 1
            });
        }

        // 클래스 선언 추출
        if (trimmedLine.startsWith('class ')) {
            const className = trimmedLine.split(' ')[1];
            variables.push({
                type: 'class',
                name: className,
                line: index + 1
            });
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
            specifications += `  - ${variable.type} ${variable.name} (line ${variable.line})\n`;
        });
        specifications += '\n';
    });

    fs.writeFileSync(outputFile, specifications, 'utf-8');
    console.log(`Variable specifications have been written to ${outputFile}`);
}

generateVariableSpecification();
