# Next.js Starter🚀 using GraphQL, MobX
Next.js based Production Ready Starter. GraphQL and MobX based. [Erion Classroom](https://classroom.erion.io) using it on the client. Saving your login status was configured using cookies. (`Secure`,` HttpOnly`)

## Pre-Installed
The following libraries / Framework are preinstalled.

#### React.js and Bundling
- Next.js
- TypeScript
- Babel
- Express.js

#### GraphQL
- Apollo Client
- React Apollo
- React Apollo Hooks
- GraphQL Codegen

#### State Management
- MobX
- styled-components

#### Asset Management
- next-optimized-images

#### Deployment
- Serverless Framework
- AWS Lambda
- Dotenv

## Getting Started
```bash
$ git clone https://github.com/tonyfromundefined/next-starter
$ cd next-starter
$ rm -rf .git  # Remove git
$ yarn
$ yarn dev
```

## Folder Structure
- `/api`: You can create a sub-API based on Express.js. dynamic ajax Set-Cookie is mainly used.
  - Let the URL be a `* .json` to distinguish it from the REST API that returns JSON.
- `/apollo`: Apollo Client related settings. There is code that includes `accessToken` in the Authorization Header in the GraphQL request. Implementation that refreshing the accessToken is required
- `/generated`: The code generated automatically by GraphQL Codegen is saved.
- `/pages`: File-based page routing. All the aliases are handled through `export {default}`, but all implementations are done inside `/services`.

```typescript
export { default } from '~/services/home/pages/index'
```
- `/serverless`: In a serverless deployment, it holds an entry JS file for each function. Separate into service units.
- `/services`: The production application is divided into several services and stored in a folder. (예: `/home`, `/auth`, ...)
  - Inside a Service: `/components`, `/queries`, `/pages`, `/helpers`, `/types`, ...
- `/store`: One Store that is globally used. Because most of the cache processing is handled by the Apollo Client, the Store is only used for global status management, such as maintaining a login.
- `/styled`: inject themes into `styled-components`
- `/types`: Declare `.d.ts`. The type used for each service should be stored in `/ types' in each service.

## use Store
Use the React Hooks API

#### `./services/home/pages/index.tsx`
```tsx
export default function PageIndex() {
  const store = useStore()

  /* ... */
}
```

## use Apollo Client
utilizes code generated automatically by GraphQL Codegen.

#### `./services/home/components/Pikachu.tsx`

- create a `.graphql` file
```graphql
query getPikachu {
  pokemon(name: "Pikachu") {
    id
    number
    name
  }
}
```

- read all `.graphql` files and generate React Hook
```bash
$ yarn generate
```

- Import the created hook, and utilize
```tsx
export default function Pikachu() {
  const { data, loading, error } = useGetPikachuQuery()

  /* ... */
}
```

## use `styled-components` Theme
```tsx
const Title = styled.h3`
  font-size: 1.5rem;
  background-color: ${(props) => props.theme.yellow[4]};
  margin: .5rem 0 1rem;
  border-radius: .25rem;
  padding: .25rem;
`
```


# Next.js Starter🚀 using GraphQL, MobX (Korean 🇰🇷)
Next.js 기반의 Production Ready Starter입니다. GraphQL, MobX 기반으로 구성되었습니다. [Erion Classroom](https://classroom.erion.io) 클라이언트에서 사용하고 있습니다. 로그인 상태 저장은 Cookie를 사용하여 구성되었습니다. (`Secure`, `HttpOnly`)

## Pre-Installed
아래의 라이브러리/Framework이 사전 설치되어 있습니다.
#### React.js and Bundling
- Next.js
- TypeScript
- Babel
- Express.js

#### GraphQL
- Apollo Client
- React Apollo
- React Apollo Hooks
- GraphQL Codegen

#### State Management
- MobX
- styled-components

#### Asset Management
- next-optimized-images

#### Deployment
- Serverless Framework
- AWS Lambda
- Dotenv

## Getting Started
```bash
$ git clone https://github.com/tonyfromundefined/next-starter
$ cd next-starter
$ rm -rf .git  # Remove git
$ yarn
$ yarn dev
```

## Folder Structure
- `/api`: Express.js 기반의 하위 API를 만들 수 있습니다. Set-Cookie를 Ajax를 통해 Dynamic하는데 주로 사용합니다.
  - URL을`*.json`으로 끝내어 JSON을 반환하는 REST API 임을 구분하도록 합니다.
- `/apollo`: Apollo Client 관련 설정입니다. `accessToken`을 GraphQL 요청 내 Authorization Header에 포함하는 코드가 존재합니다. 토큰을 새로고침하는 로직에 대한 구현이 필요합니다.
- `/generated`: GraphQL Codegen을 통해 자동 생성되는 코드가 저장됩니다.
- `/pages`: 파일 기반으로 Page Routing을 합니다. `export { default }`를 통해 alias 처리만 할 뿐 모든 구현은 `/services` 내부에서 진행합니다.
```typescript
export { default } from '~/services/home/pages/index'
```
- `/serverless`: 서버리스 배포 시 각 함수 당 엔트리 JS 파일을 담습니다. 서비스 단위로 분리하는 것이 좋습니다.
- `/services`: Production 어플리케이션을 여러 서비스로 나누어 폴더에 저장합니다. (예: `/home`, `/auth`, ...)
  - 서비스 내부: `/components`, `/queries`, `/pages`, `/helpers`, `/types`, ...
- `/store`: Global로 하나의 Store만 사용합니다. 대부분의 캐시처리는 Apollo Client가 해주기때문에, Store는 로그인 유지 등 전역 상태 관리에만 사용합니다.
- `/styled`: `styled-components`에 Theme를 주입해줍니다.
- `/types`: `.d.ts`를 보관합니다. 각 서비스 별로 사용되는 타입은 각 서비스 내 `/types에 저장하도록 합니다`

## Store 활용하기
React Hooks API를 사용합니다

#### `./services/home/pages/index.tsx`
```tsx
export default function PageIndex() {
  const store = useStore()

  /* ... */
}
```

## Apollo Client 활용하기
GraphQL Codegen을 통해 자동 생성된 코드를 활용합니다.

#### `./services/home/components/Pikachu.tsx`

- `.graphql` 파일을 생성합니다.
```graphql
query getPikachu {
  pokemon(name: "Pikachu") {
    id
    number
    name
  }
}
```

- 모든 `.graphql` 파일을 긁어 React Hook을 생성합니다
```bash
$ yarn generate
```

- 생성된 Hook을 import하여 활용합니다
```tsx
export default function Pikachu() {
  const { data, loading, error } = useGetPikachuQuery()

  /* ... */
}
```

## `styled-components` Theme 활용하기
```tsx
const Title = styled.h3`
  font-size: 1.5rem;
  background-color: ${(props) => props.theme.yellow[4]};
  margin: .5rem 0 1rem;
  border-radius: .25rem;
  padding: .25rem;
`
```
