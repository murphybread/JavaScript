

# Overview
문제: JavaScript에서 변수를 선언할 때, 변수를 블록 위에 선언할지, 함수 초기 상부 쪽에 한 번에 선언 할 지에 대한 문제가 있습니다.

- **블록 위에 변수 선언**: 해당 블록 내에서 사용되는 변수를 명확히 할 수 있어 모듈화나 해당 블록 관리가 용이합니다.
- **초기 상부에 변수 선언**: 함수나 클래스에서 사용하는 모든 변수를 일괄적으로 관리할 수 있어 운영 측면에서 유리합니다.

각각의 방식에는 장단점이 있으며, 변수의 수가 많아지면 관리가 어려워질 수 있습니다.

이 문제를 해결하기 위해 두 가지 장점을 모두 활용하는 방안을 제안합니다. **변수명세서**라는 공통 함수를 추가하여, 모든 클래스나 파일의 변수를 단일 파일로 명세하는 방법입니다. 이를 통해 블록 위에 변수를 선언할 때의 단점을 극복할 수 있습니다.

기본적으로 Node.js의 기본 모듈을 활용하고, 외부 패키지의 의존성을 최소화하여 구현했습니다.



# Install
Node.js가 설치되어 있으면 사용 가능합니다. 다음 명령을 통해 Node.js를 설치할 수 있습니다:
```sh
# MacOS
brew install node

# Ubuntu
sudo apt install nodejs npm

# Windows
# Node.js 공식 웹사이트에서 설치 프로그램을 다운로드하여 설치
```


# Usage
1. 소스 코드를 다운로드하거나 클론합니다.
```sh
git clone https://github.com/yourusername/variable-specification.git
cd variable-specification

```

2. 스크립트를 실행하여 변수 명세서를 생성합니다.
```sh
node generate_variable_spec.js
```

3. 스크립트를 실행한 경로에서 `variable_specifications.txt`라는 이름의 파일 확인.