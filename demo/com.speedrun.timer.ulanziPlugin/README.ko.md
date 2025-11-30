# UlanziDeck용 스피드런 타이머 플러그인

HTTP API를 통해 스피드런 이벤트 타이머를 제어하는 UlanziDeck 플러그인입니다.

## 기능

이 플러그인은 스피드런 타이머를 제어하기 위한 4개의 버튼 액션을 제공합니다:

1. **시작** - 양쪽 타이머 시작 (1P와 2P)
2. **1P 중단** - 플레이어 1 타이머 일시정지
3. **2P 중단** - 플레이어 2 타이머 일시정지
4. **초기화** - 양쪽 타이머 리셋

## 요구사항

- UlanziDeck 소프트웨어 버전 6.1 이상
- `http://localhost:5010`에서 실행 중인 타이머 서버
- 타이머 서버는 `/api/timer` 엔드포인트를 구현해야 함

## API 사양

플러그인은 다음 API를 사용하여 타이머 서버와 통신합니다:

**엔드포인트:** `POST http://localhost:5010/api/timer`

**요청 본문:**
```json
{
  "Id": 1,      // 타이머 ID (1 또는 2)
  "Type": 3     // 명령 타입 (0-3)
}
```

**명령 타입:**
- `0` - Resume: 타이머 재개
- `1` - Pause: 타이머 일시정지
- `2` - Reset: 타이머 초기화
- `3` - StartBoth: 양쪽 타이머 시작

## 설치 방법

1. `com.speedrun.timer.ulanziPlugin` 폴더를 UlanziDeck 플러그인 디렉토리에 복사
2. UlanziDeck 재시작
3. 액션 목록에 "Speedrun Timer" 카테고리가 표시됨

## 버튼 액션

### 시작 버튼 (▶ 시작)
- 전송: `{ "Id": 1, "Type": 3 }`
- 동작: 1P와 2P 타이머를 동시에 시작

### 1P 중단 버튼 (⏸ 1P 중단)
- 전송: `{ "Id": 1, "Type": 1 }`
- 동작: 플레이어 1 타이머 일시정지

### 2P 중단 버튼 (⏸ 2P 중단)
- 전송: `{ "Id": 2, "Type": 1 }`
- 동작: 플레이어 2 타이머 일시정지

### 초기화 버튼 (↺ 초기화)
- 전송: `{ "Id": 1, "Type": 2 }` 후 `{ "Id": 2, "Type": 2 }`
- 동작: 양쪽 타이머를 00:00:00으로 리셋

## 아이콘 요구사항

`assets/icons/` 디렉토리에 다음 아이콘 파일이 필요합니다:

- `start.png` - 시작 버튼 아이콘 (72x72px, 투명 PNG)
- `pause1p.png` - 1P 중단 버튼 아이콘 (72x72px, 투명 PNG)
- `pause2p.png` - 2P 중단 버튼 아이콘 (72x72px, 투명 PNG)
- `reset.png` - 초기화 버튼 아이콘 (72x72px, 투명 PNG)
- `plugin.png` - 메인 플러그인 아이콘 (72x72px, 투명 PNG)
- `category.png` - 카테고리 아이콘 (72x72px, 투명 PNG)

### 권장 아이콘 디자인

- **시작**: 녹색 재생/삼각형 기호 ▶
- **1P 중단**: 노란색/주황색 일시정지 기호 + "1P" 텍스트 ⏸
- **2P 중단**: 노란색/주황색 일시정지 기호 + "2P" 텍스트 ⏸
- **초기화**: 파란색 순환 화살표 기호 ↺
- **플러그인/카테고리**: 스톱워치 또는 타이머 아이콘 🕐

## 테스트

플러그인 API 기능을 테스트하려면 브라우저에서 `test.html`을 여세요:

```bash
# 브라우저에서 파일 열기
open test.html
# 또는
firefox test.html
# 또는 파일을 더블클릭
```

테스트 인터페이스는:
- localhost:5010에서 실제 타이머 서버가 실행 중인지 **자동 감지**
- 서버를 사용할 수 없는 경우 **모의 모드로 자동 전환**
- 모든 API 호출 및 응답을 실시간으로 표시
- 시각적 표시기로 연결 상태 표시

**테스트 모드:**
- 🟢 **연결 모드**: localhost:5010으로 실제 API 호출
- 🟠 **모의 모드**: 서버 없이 로컬 시뮬레이션 (UI 테스트용)

## 문제 해결

### UlanziDeck에 플러그인이 나타나지 않음
- 플러그인 폴더가 올바른 위치에 있는지 확인
- 모든 필수 파일이 존재하는지 확인
- UlanziDeck 재시작

### 버튼에 오류 표시 (빨간색 경고)
- 타이머 서버가 `http://localhost:5010`에서 실행 중인지 확인
- 서버 콘솔에서 오류 확인
- API 엔드포인트가 `/api/timer`인지 확인

### 버튼 반응 없음
- UlanziDeck 개발자 모드에서 브라우저 콘솔 열기
- JavaScript 오류 확인
- localhost:5010으로의 네트워크 연결 확인

## 개발

### 파일 구조
```
com.speedrun.timer.ulanziPlugin/
├── manifest.json                 # 플러그인 설정
├── en.json                       # 영어 지역화
├── ko.json                       # 한국어 지역화
├── README.md                     # 영문 문서
├── README.ko.md                  # 이 파일 (한국어 문서)
├── test.html                     # 브라우저 기반 테스트 인터페이스
├── assets/
│   └── icons/                    # 아이콘 이미지
├── libs/
│   └── js/                       # 공통 라이브러리
└── plugin/
    ├── app.html                  # 메인 HTML 진입점
    ├── app.js                    # 메인 플러그인 로직
    └── actions/
        ├── timerClient.js        # API 클라이언트
        └── timerAction.js        # 액션 핸들러
```

### API URL 수정

API 서버 URL을 변경하려면 `plugin/app.js`를 편집하세요:

```javascript
const timerAPI = new TimerAPIClient('http://your-server:port');
```

## 라이선스

이 플러그인은 AGPL 3.0 라이선스를 따릅니다.

## 작성자

Speedrun Timer Plugin
버전 1.0.0

## 지원

문제 및 질문은 UlanziDeck Plugin SDK 메인 문서를 참조하세요.
