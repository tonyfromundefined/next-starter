import styled from '~/styled'
import Pikachu from '../components/Pikachu'
import { useStore } from '../store'

export default function PageIndex() {
  const store = useStore()

  return (
    <Container>
      <Title>Next.js Starter</Title>
      <Line>
        <Code>Next.js</Code>
        <Code>TypeScript</Code>
        <Code>Babel</Code>
        <Code>Express.js</Code>
        <Code>Apollo Client</Code>
        <Code>React Apollo</Code>
        <Code>React Apollo Hooks</Code>
        <Code>GraphQL Codegen</Code>
        <Code>MobX</Code>
        <Code>mobx-state-tree</Code>
        <Code>styled-components</Code>
        <Code>next-optimized-images</Code>
        <Code>Serverless Framework</Code>
        <Code>AWS Lambda</Code>
        <Code>Dotenv</Code>
      </Line>
      <Line>version: {store.environments.get('NEXT_APP_VERSION')}</Line>
      <Line>by <Author>@tonyfromundefined</Author></Line>
      <Pikachu />
    </Container>
  )
}

const Container = styled.div`
  padding: 1rem;
`

const Title = styled.h1`
  font-size: 2rem;
  margin: 0 0 1rem;
`

const Line = styled.div`
  margin: .5rem 0 0;
  font-size: .875rem;
`

const Code = styled.div`
  font-family: monospace;
  display: inline-block;
  background-color: ${(props) => props.theme.blue[0]};
  color: ${(props) => props.theme.blue[8]};
  font-size: .75rem;
  border-radius: .125rem;
  padding: .0625rem .125rem;
  margin-right: .25rem;
  font-weight: 700;
`

const Author = styled.div`
  font-family: monospace;
  display: inline-block;
  background-color: ${(props) => props.theme.green[0]};
  color: ${(props) => props.theme.green[8]};
  font-size: .75rem;
  border-radius: .125rem;
  padding: .0625rem .125rem;
  margin-right: .25rem;
  font-weight: 700;
`
