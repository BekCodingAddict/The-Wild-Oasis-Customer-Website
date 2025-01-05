# Next.js 캐싱 오류
>[!NOTE]
>Next.js에서 캐싱 오류는 배포 후 앱에 변경 사항이 반영되지 않거나, 이전 버전의 콘텐츠가 표시될 때 발생할 수 있습니다. 다음은 Next.js 프로젝트에서 캐싱 문제를 식별하고 해결하는 방법입니다.

## Next.js 캐싱 오류
### 오류 설명:
"배포 후 변경 사항이 반영되지 않음" 또는 "새로운 배포 이후에도 이전 버전의 앱이 제공됨."

### 가능한 원인:
- 정적 파일 캐싱: Next.js는 정적 자산(예: 이미지, JavaScript 파일)과 페이지에 대해 공격적인 캐싱 전략을 사용합니다. 파일이 브라우저나 CDN에 캐시되면 최근 변경 사항이 반영되지 않을 수 있습니다.
- 서비스 워커 문제: 서비스 워커를 사용하고 있다면, 서비스 워커가 자산을 캐시하고 이전 콘텐츠를 제공할 수 있습니다.
- CDN 캐싱: 앱 앞에 CDN이 있을 경우 이전 버전의 앱을 캐시하여 오래된 콘텐츠가 제공될 수 있습니다.

### 해결 방법:
- 브라우저 캐시 지우기:
   - 개발 중에는 브라우저 캐시가 문제를 일으킬 수 있습니다. 브라우저에서 캐시를 지운 후 문제가 해결되는지 확인하세요.
   - Incognito/Private Browsing 모드를 사용하여 캐시된 데이터를 사용하지 않고 문제가 지속되는지 확인할 수 있습니다.

- 서비스 워커 비활성화 (해당되는 경우): 서비스 워커를 사용하고 있다면, 서비스 워커가 앱의 자산을 공격적으로 캐시할 수 있습니다. 클라이언트 측 JavaScript에서 서비스 워커를 수동으로 등록 해제하거나 업데이트해야 할 수 있습니다.
   - next-pwa 또는 다른 서비스 워커 설정이 있는지 확인하세요.
   - next-pwa를 사용하는 경우 캐싱을 일시적으로 비활성화하거나 올바른 캐시 만료 정책을 설정하세요. 예시:
```javascript
// next.config.js
module.exports = {
  pwa: {
    dest: 'public',
    // 자산 캐싱의 최대 만료 시간을 설정
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/your-api-url/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxAgeSeconds: 60 * 60 * 24, // 24시간 동안 캐시
          },
        },
      },
    ],
  },
};
```
- 정적 파일을 위한 적절한 Cache-Control 헤더 설정: next.config.js에서 캐시 제어 헤더를 추가하여 브라우저가 자산을 얼마나 오래 캐시할지 설정할 수 있습니다. 예시:
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|gif|woff|woff2|eot|ttf|otf|json|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```
- 이렇게 하면 이미지나 폰트와 같은 자산이 오랜 시간 동안 캐시되지만 앱이 업데이트될 때 오래된 콘텐츠로 문제가 발생하지 않습니다.

- CDN 캐시 무효화: CDN(예: Vercel, Cloudflare, Netlify)을 사용 중인 경우, 캐시를 무효화하거나 동적 콘텐츠에 대한 캐시 만료 헤더를 설정하여 오래된 버전을 제공하지 않도록 할 수 있습니다.
- 예를 들어, Vercel에서는:
   - Vercel은 새 배포 시 캐시 무효화를 자동으로 처리하지만, API 라우트나 특정 페이지에 대해 캐시 헤더를 구성해야 할 수도 있습니다.

### ISR(증분 정적 재생성) 활성화: 
- Static Generation(SSG)을 사용하면서 콘텐츠가 주기적으로 업데이트되도록 하고 싶다면 ISR을 사용하세요. ISR을 사용하면 전체 사이트를 재빌드하지 않고도 정적 페이지를 특정 시간 간격으로 다시 렌더링할 수 있습니다.
```javascript
export async function getStaticProps() {
  return {
    props: {
      // 여기에 props 작성
    },
    revalidate: 60, // 60초마다 재검증
  };
}
```
### 핵심 사항:
- 정적 콘텐츠: 적절한 캐시 제어 헤더를 사용하고 CDN을 설정하여 캐시를 효과적으로 관리하세요.
- 동적 콘텐츠: ISR을 사용하여 페이지가 특정 간격으로 업데이트되도록 보장하세요.
- 서비스 워커: 개발 중 또는 서비스 워커가 오래된 콘텐츠를 캐시하는 경우, 이를 관리하거나 비활성화하세요.
- 브라우저 캐시: 최신 변경 사항을 보기 위해 캐시를 지우거나 우회하세요.

### 발생 날짜:
- Nov 12, 2024
  
