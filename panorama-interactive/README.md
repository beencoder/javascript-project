# 🧪 CSS 3D Lab
> 자바스크립트 없이 CSS만으로 구현한 3D 인터랙티브 UI입니다.

**Live Demo:** [https://beencoder.github.io/javascript-project/panorama-interactive](https://beencoder.github.io/javascript-project/panorama-interactive)

---

## 💡 프로젝트 소개
웹 기술만으로 입체적인 공간감을 구현하기 위해 제작된 실험실 프로젝트입니다. 원통형으로 배치된 8개의 패널이 끊임없이 회전하며, 마우스 호버 시 각 콘텐츠가 반응하는 역동적인 레이아웃을 갖추고 있습니다. 라이브러리 없이 **순수 CSS3**의 3D 변형(Transform) 속성만을 활용했습니다.

## 🛠 주요 구현 포인트
디자인적 완성도를 높이기 위해 적용한 핵심 CSS 기법들입니다.

* **3D 렌더링 공간 구축 (`Perspective`)**
    * `perspective: 1300px`를 적용하여 깊이감 있는 가상 공간을 생성하고, 부모 요소에 `transform-style: preserve-3d`를 부여해 자식 요소들이 입체감을 유지하도록 설계했습니다.
* **정교한 8면체 원통 배치 (`TranslateZ`)**
    * 각 패널을 45도씩 회전(`rotateY`)시키고, 계산된 수치만큼 뒤로 밀어(`translateZ(-764px)`) 완벽한 8각형의 원통 구조를 완성했습니다.
* **하드웨어 가속 애니메이션 (`GPU Acceleration`)**
    * `@keyframes`와 `transform` 속성을 결합하여 끊김 없는 360도 회전 애니메이션을 구현했습니다. GPU 가속을 유도하여 저사양 환경에서도 부드러운 움직임을 보여줍니다.
* **인터랙션 디테일**
    * `backface-visibility: hidden`을 통해 패널의 뒷면이 비쳐 지저분해지는 현상을 방지하고, 호버 시 `transition`을 이용한 스케일 업 및 텍스트 강조 효과를 추가했습니다.

## 🚀 주요 기능
* **실시간 비디오 배경:** 배경과 개별 패널에 비디오 요소를 배치하여 미래지향적이고 생동감 넘치는 분위기를 조성했습니다.
* **다양한 콘텐츠 레이아웃:** 텍스트 기사, 멤버 프로필, 서비스 소개, 날씨 정보 등 각 면마다 다른 테마의 UI가 배치되어 있습니다.
* **풀 인터랙티브:** 마우스 커서의 움직임에 따라 콘텐츠가 반응하며 사용자에게 깊은 몰입감을 선사합니다.

## 🏃 실행 방법
1. 이 저장소를 클론하거나 소스코드를 다운로드합니다.
2. `index.html` 파일을 브라우저에서 엽니다.
3. 마우스 휠을 움직이거나 패널에 커서를 올려 3D 공간을 탐험해 보세요!

## 📌 활용한 핵심 CSS 속성
- `transform-style: preserve-3d`
- `perspective`
- `backface-visibility`
- `animation / @keyframes`
