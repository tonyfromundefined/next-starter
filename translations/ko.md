# 🔥 GraphQL, MobX를 사용하는 Next.js 스타터 🔥
`GraphQL`과 `MobX`를 기반으로 하는 *Production-ready* `Next.js` 보일러플레이트입니다. [Erion Classroom](https://classroom.erion.io)이 현재 Production에서 이 보일러플레이트를 사용하고 있습니다. Authentication 상태는 `Secure`, `HttpOnly` 옵션을 통해 쿠키에 저장 할 수 있습니다.

## 사전 설치 됨
아래의 라이브러리 및 프레임웍이 현재 사전 설치되어 있습니다.

### React.js 관련 및 기타 구동에 필요한 핵심 프레임워크
- [Next.js](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Babel](https://babeljs.io)
- [Express.js](https://expressjs.com)

### GraphQL
- [Apollo Client](https://github.com/apollographql/apollo-client)
- [React Apollo](https://github.com/apollographql/react-apollo)
- [React Apollo Hooks](https://github.com/trojanowski/react-apollo-hooks)
- [GraphQL Code Generator](https://graphql-code-generator.com)

### 상태 관리
- [MobX 5](https://github.com/mobxjs/mobx)

### 스타일링
- [styled-components](https://www.styled-components.com)

### 애셋 관리
- [next-optimized-images](https://github.com/cyrilwanner/next-optimized-images)

### 배포
- [Serverless Framework](https://serverless.com)
- [AWS Lambda](https://aws.amazon.com/lambda)
- [Dotenv](https://github.com/motdotla/dotenv)

# 1. 시작하기
```bash
# 레포지토리를 Clone 합니다
$ git clone https://github.com/tonyfromundefined/next-starter
$ cd next-starter

# 기존에 이미 설정된 Git Project를 삭제합니다
$ rm -rf .git

# 당신만의 Git Project를 시작합니다
$ git init

# 필요한 라이브러리를 설치합니다
$ yarn

# 개발 서버를 시작합니다
$ yarn dev
```

# 2. 폴더 구조
### 1. `/api`
*Express.js*를 사용하여 sub-API를 만들 수 있습니다. API가 GraphQL로 따로 존재 할 것이기 때문에, 해당 API는 `ajax` 콜을 통해 동적으로 `Set-Cookie`를 할 때 사용하십시오. (Refresh Token 등)
> 추천👏: URL을 `*.json`으로 끝내면 JSON을 반환하는 REST API 임을 쉽게 구분 할 수 있습니다.

### 2. `/apollo`
*Apollo Client* 설정입니다. GraphQL 요청 시에 `accessToken`을 Authorization Header를 삽입합니다.
- 토큰 새로고침 관련하여 구현이 필요합니다.

### 3. `/generated`
*GraphQL Code Generator*에 의해 자동 생성된 코드가 저장됩니다.

### 4. `/pages`
파일 기반의 페이지 라우팅을 맡습니다. 여기에 생성되는 파일은 다른 컴포넌트에 Alias 하는 용도로만 사용되며, 모든 컴포넌트 구현은 `/services` 내부에서 합니다.
```typescript
export { default } from '~/services/home/pages/index'
```
> 저는 추후 확장성을 위해 코드를 모두 서비스 단위로 분리했습니다. 서비스 내에서 사용되는 요소들은 서비스 내에 삽입합니다. (`/queries`, `/helpers`, `/components`) 관련 토론은 [https://softwareengineering.stackexchange.com/questions/338597/folder-by-type-or-folder-by-feature](https://softwareengineering.stackexchange.com/questions/338597/folder-by-type-or-folder-by-feature)를 확인하세요.

### 5. `/serverless`
서버리스 배포에 필요한 도입 JavaScript 파일을 구현합니다. (CommonJS)
> 추천👏: 엔트리 파일을 서비스 유닛 별로 분리하세요.

### 6. `/services`
큰 어플리케이션을 여러개의 가상 서비스로 분리합니다. (`/home`, `/auth`, ...)
> 추천👏: 컴포넌트와 비즈니스 로직을 서비스 유닛 폴더 내에 분리해서 구현합니다.
- `~/services/{service}/components/**.tsx`
- `~/services/{service}/queries/**.graphql`
- `~/services/{service}/helpers/**.ts`
- `~/services/{service}/assets/**.png`
- `~/services/{service}/types/**.ts`
- ...

### 7. `/store`
전역에서 사용되는 하나의 저장소입니다. 대부분의 캐싱 작업은 *Apollo Client*가 해주기 때문에, 해당 저장소는 로그인 처리 등 특정 전역 상태 관리를 위해서만 사용하시면 됩니다.

### 8. `/styled`
테마와 글로벌 CSS 선언을 합니다.

### 9. `/types`
타입 선언을 담습니다. (`.d.ts`)
> 추천👏: 각 서비스 유닛에서 사용되는 타입은 각자의 서비스 유닛 폴더 내 `~/services/{service}/types`에 구현하도록 합니다.

# 3. 개발하기
```bash
# 개발 서버를 시작합니다
$ yarn dev
```

## 컴포넌트에서 MobX store를 사용하기
Hooks API 이용

##### `~/services/home/pages/index.tsx`
```tsx
import { useStore } from '~/store'

export default function PageIndex() {
  const store = useStore()

  /* ... */
}
```

## GraphQL Code Generator와 `react-apollo-hooks`를 활용해 컴포넌트에서 GraphQL 쿼리, 뮤테이션하기
- `.env.development`, `.env.production` 내의 GraphQL 엔드포인트(`NEXT_APP_GRAPHQL_ENDPOINT`)를 수정합니다.
  ##### `.env.development`
  ```
  NEXT_APP_STAGE = "development"
  NEXT_APP_GRAPHQL_ENDPOINT = "https://graphql-pokemon.now.sh/"
  NEXT_APP_VERSION = "0.0.1"
  ```

- 서비스 유닛 폴더 내에 `.graphql` 파일을 생성합니다. (`~/services/{service}/queries/**.graphql`)
  ##### `~/services/home/queries/getPikachu.graphql`
  ```graphql
  query getPikachu {
    pokemon(name: "Pikachu") {
      id
      number
      name
    }
  }
  ```

- 프로젝트 내에 모든 `.graphql` 파일을 읽고 HOCs, Hooks, 컴포넌트를 생성합니다.
  ```bash
  $ yarn generate
  ```

- 생성된 Hook을 Import하여 사용합니다.
  ##### `~/services/home/components/Pikachu.tsx`
  ```tsx
  import { useGetPikachuQuery } from '~/generated/graphql'

  export default function Pikachu() {
    const { data, loading, error } = useGetPikachuQuery()

    /* ... */
  }
  ```

## 테마 Injection을 통해 Styled Components 활용하기
- 상수를 삽입하여 프로젝트 전역에서 사용합니다.
  ##### `./styled/themes/base.ts`
  ```ts
  import openColor from 'open-color'

  const theme = {
    ...openColor,
  }
  ```

- `styled` 선언 안에서 `props.theme`를 사용해 변수에 접근 할 수 있습니다.
  ```tsx
  const Title = styled.h3`
    font-size: 1.5rem;
    background-color: ${(props) => props.theme.yellow[4]};
    margin: .5rem 0 1rem;
    border-radius: .25rem;
    padding: .25rem;
  `
  ```

## MobX store hydration을 활용해 환경 변수 주입하기
하나의 빌드로 여러 Stage에 배포하기 위해, 이 보일러플레이트는 `dotenv-webpack`(환경변수를 번들에 포함해버림)을 사용하지 않습니다. 이 보일러플레이트는 환경변수를 번들에 포함하는 대신, 서버의 환경변수를 MobX state에 주입합니다. 따라서, 서버와 클라이언트 모두에서 서버의 환경변수에 접근 할 수 있게 됩니다.
- 환경변수를 클라이언트와 서버 모두에서 사용하기 위해서, `NEXT_APP`이라는 문자열을 변수 이름에 포함합니다.
  ##### `.env.**`
  ```
  NEXT_APP_VERSION = "1.0.0"
  ```
- 보안 관련한 이유로 환경변수를 서버에서만 사용하기 위해서는 `NEXT_APP`이라는 문자열을 변수 이름에 포함하지 않습니다.
  ##### `.env.**`
  ```
  SECRET_KEY = "dc35abc5-80e1-5725-8a7b-7a6ce1a21c24"
  ```

# 4. 빌드
```bash
# 서버와 클라이언트 번들을 빌드합니다
$ yarn build
```

# 5-a. 서버에 배포하기 (EC2, Elastic Beanstalk, Docker, ...)
```bash
# 번들된 애셋을 가지고 80포트에 서버를 켭니다
$ yarn start
```
> `pm2`와 같은 process manager 사용을 권장합니다.

# 5-b. 서버리스로 배포하기 (AWS Lambda + API Gateway + S3)
## 사전 준비사항
- 🔑 *Serverless framework* 사용을 위한 **IAM Account** (`aws configure`를 통해 CLI에 사전 설정이 필요합니다)
  ```bash
  $ aws configure
  ```

## 설정
`serverless.yml`를 수정합니다.

```yaml
service: next-starter  # 1. 서비스 이름 바꾸기

plugins:
  - serverless-s3-sync
  - serverless-apigw-binary
  - serverless-dotenv-plugin

package:
  individually: true
  excludeDevDependencies: false

provider:
  name: aws
  runtime: nodejs10.x
  stage: ${opt:stage, 'dev'}
  region: us-east-1  # 2. AWS region 이름 바꾸기

custom:
  #######################################
  # Unique ID included in resource names.
  # Replace it with a random value for every first distribution.
  # https://www.random.org/strings/?num=1&len=6&digits=on&loweralpha=on&unique=on&format=html&rnd=new
  stackId: '0uelbz'  # 3. 랜덤 스택 ID 바꾸기
  #######################################

  buckets:
    ASSETS_BUCKET_NAME: ${self:service}-${self:custom.stackId}-${self:provider.stage}-assets
  s3Sync:
    - bucketName: ${self:custom.buckets.ASSETS_BUCKET_NAME}
      localDir: dist
  apigwBinary:
    types:
      - '*/*'

functions:
  main:
    name: ${self:service}-${self:custom.stackId}-${self:provider.stage}-main
    handler: dist/serverless/bundles/main.handler
    memorySize: 2048
    timeout: 10
    environment:
      NODE_ENV: production
    package:
      include:
        - dist/serverless/bundles/main.js
      exclude:
        - '**'
    events:
      - http:
          path: /
          method: any
      - http:
          path: /{proxy+}
          method: any
      - http:
          path: /_next/{proxy+}
          method: any
          integration: http-proxy
          request:
            uri: https://${self:custom.buckets.ASSETS_BUCKET_NAME}.s3.${self:provider.region}.amazonaws.com/{proxy}
            parameters:
              paths:
                proxy: true

  # 4. 하나 이상의 Entry가 있을 경우, 해당 엔트리 관련 설정 추가하기
  # hello:
  #   name: ${self:service}-${self:custom.stackId}-${self:provider.stage}-hello
  #   handler: dist/serverless/bundles/hello.handler
  #   memorySize: 2048
  #   timeout: 10
  #   environment:
  #     NODE_ENV: production
  #   package:
  #     include:
  #       - dist/serverless/bundles/hello.js
  #     exclude:
  #       - '**'
  #   events:
  #     - http:
  #         path: /
  #         method: any
  #     - http:
  #         path: /{proxy+}
  #         method: any
```

## Serverless Framework을 사용해 배포 스크립트 수행하기
```bash
# development stage에 배포하기
$ yarn deploy:dev

# staging stage에 배포하기
$ yarn deploy:stage

# production stage에 배포하기
$ yarn deploy:prod
```

# 6. 할 일
기능 추가를 원하시면, 새 이슈를 생성해주세요. 또한, Pull Request는 언제나 환영입니다.🙏
