# 상태/프롭스가 서버 측 컴포넌트로 다시 전달되지 않음

>[!NOTE]
>### 설명:
>- 클라이언트 측 컴포넌트에서 서버 측 컴포넌트로 상태(state)나 프롭스(props)를 다시 전달할 수 없음.

### 원인:
Next.js에서 데이터는 서버 컴포넌트에서 클라이언트 컴포넌트로 프롭스를 통해 자연스럽게 흐릅니다. 그러나 클라이언트 컴포넌트에서 서버 컴포넌트로 데이터를 전달하는 것은 서버와 클라이언트 환경이 분리되어 있기 때문에 간단하지 않습니다. 이를 해결하기 위해 Next.js는 13.4 버전(현재 알파 버전)에서 **서버 액션(Server Actions)**을 도입했습니다. 서버 액션은 클라이언트 컴포넌트에서 호출할 수 있는 서버 측 함수를 정의하여 클라이언트에서 서버로 데이터를 전달할 수 있게 합니다.

### 오류 기록 작성 방법:
서버 컴포넌트는 SSR(서버 측 렌더링) 또는 SSG(정적 사이트 생성) 중에 데이터를 가져오도록 설계되었으며, 상태는 초기 렌더링 중에 결정됩니다. 클라이언트 컴포넌트는 브라우저에서 실행되며 실행 컨텍스트가 분리되어 있기 때문에 상태를 서버 컴포넌트로 직접 전달할 수 없습니다.

### 해결 방법:
1. API 라우트 사용: 클라이언트에서 서버로 데이터를 보내는 API 라우트를 생성합니다.
예시:
```javascript
// /pages/api/update-data.js
export default async function handler(req, res) {
  const { data } = req.body;
  // 데이터 처리 후 데이터베이스에 저장
  res.status(200).json({ success: true });
}
```
클라이언트 측 컴포넌트에서 fetch 또는 axios를 사용하여 이 API 라우트를 호출합니다.

2. 서버 액션 사용(실험적 기능): Next.js의 실험적 기능인 서버 액션을 사용하여 서버와 클라이언트 간의 통신을 활성화합니다.
3. 상태 끌어올리기: 부모 클라이언트 컴포넌트에서 공유 상태를 관리하고 필요한 경우 이를 자식 컴포넌트로 전달합니다.
4. 하이드레이션(Hydration): 서버 측 데이터를 JSON.stringify로 직렬화하고 이를 클라이언트로 프롭스로 전달합니다.

### 핵심 사항:
- 서버 컴포넌트는 상태가 없으며, 클라이언트 컴포넌트로부터 동적인 상태 업데이트를 받을 수 없습니다.
- 서버와 클라이언트 컴포넌트 간의 데이터 흐름을 아키텍처 설계 단계에서 항상 계획해야 합니다.

### 예시 코드:
서버 컴포넌트:
```javascript
export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}

export default function ServerComponent({ data }) {
  return <ClientComponent data={data} />;
}
```
클라이언트 컴포넌트:
```javascript
function ClientComponent({ data }) {
  const [clientData, setClientData] = useState(data);

  const updateData = async () => {
    const response = await fetch('/api/update-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: clientData }),
    });
    const result = await response.json();
    console.log(result);
  };

  return (
    <button onClick={updateData}>
      서버 업데이트
    </button>
  );
}
```
오류 발생 날짜:  Nov 12, 2024
