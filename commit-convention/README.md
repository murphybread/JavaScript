# Overview
문제: 커밋 컨벤션 좋긴하지만 사람이 하다보면 생길 수 밖에 없는 휴먼 에러를 클라이언트 사이드에서 git 기능으로 막기

깃에서 커밋 컨벤션은 협업하는 과정에서 내가 무엇을 했는지 공유하는 중요한 이정표입니다. 그래서 잘 만들어진 커밋메시지 만으로 오류를 줄이고 유지 관리를 수월하게 할 수 있습니다. 하지만 너무 형식적인 컨벤션의 경우 단점으로 작용하여 오히려 생산성을 떨어트릴 수 있습니다. 또 매번 해당 컨벤션에 맞춰 사람이 작성하다 보면 결국 오류가 생기기 쉽습니다. 그래서 정말 쓸모 있는 컨벤션과 프로그램상에서 강제하는 방법을 사용하면 문제를 해결할 수 있을 것이라 생각했습니다.


# Install
정상적으로 설치된 경우 `.git/hook/murphy-commit-msg`라는 파일이 있습니다. 해당 파일의 이름을
`murphy-commit-msg` -> `commit-msg`로 수정해줍니다.
이후 node_modules밑의 .git폴더를 컨벤셔을 적용하기위한 폴더에 복사 붙여넣기 방식을 통해 해당 프로젝트에 추가합니다.
해당 폴더 아래의 해당 이름을 가진 경우 git이 commit 마다 자동으로 스크립트를 실행하여 convention을 검사하게 됩니다.

```sh
#!/bin/sh

# 타입: feat, fix, docs, style, refactor, test, chore
# 스코프: 변경된 파일이나 모듈 (선택 사항)
# 주제: 간략한 설명 (첫 글자 대문자, 명령형, 마침표 없음)
# 바디: 상세한 설명 (선택 사항)
# 푸터: 이슈 ID 참조 또는 추가 정보 (선택 사항)

# 커밋 메시지 파일 경로
commit_msg_file=$1

# 정규식 패턴: <type>(<scope>): <subject>
pattern="^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,80}$"

# 커밋 메시지 내용 읽기
commit_msg=$(cat "$commit_msg_file")

# 패턴 검증
if ! echo "$commit_msg" | grep -Eq "$pattern"; then
  echo "❌ Invalid commit message format."
  echo ""
  echo "Your commit message should follow this format:"
  echo "<type>(<scope>): <subject>"
  echo ""
  echo "Type must be one of:"
  echo "  feat, fix, docs, style, refactor, test, chore"
  echo ""
  echo "Scope is optional but should be related to the affected part of the codebase."
  echo ""
  echo "Subject should be a brief description of the change (1-80 characters)."
  echo "Example:"
  echo "  feat(auth): add login functionality"
  echo ""
  exit 1
fi

```



# Usage
사용방법은 이후부터  commit message를 작성하면 됩니다.
하지만 다음의 조건에 부합하지 않으면 에러 메시지를 반환합니다.
<type>(<scope>): <subject>
type의 경우 다음의 7가지 중 한가지가 아니면 에러: feat, fix, docs, style, refactor, test, chore
scope는 선택으로 파일이름이나 모듈이름
콜론 다음 한칸 띄어쓰기
이후 1~80글자가 아니면 에러