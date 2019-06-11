import { useGetPikachuQuery } from '~/generated/graphql'
import styled from '~/styled'

export default function Pikachu() {
  const { data, loading, error } = useGetPikachuQuery()

  return (
    <Container>
      <Caption>GraphQL Result</Caption>
      {loading &&
        <p>loading...</p>
      }
      {error &&
        <p>error</p>
      }
      {data && data.pokemon && (
        <>
          <Title>{data.pokemon.name}</Title>
          <Line>id: {data.pokemon.id}</Line>
          <Line>number: {data.pokemon.number}</Line>
        </>
      )}
    </Container>
  )
}

const Container = styled.div`
  border-top: 1px solid #000;
  margin-top: 2rem;
`

const Caption = styled.div`
  font-size: .875rem;
  margin: .5rem 0 1rem;
  font-weight: 700;
`

const Title = styled.h3`
  font-size: 1.5rem;
  background-color: ${(props) => props.theme.yellow[4]};
  margin: .5rem 0 1rem;
  border-radius: .25rem;
  padding: .25rem;
`

const Line = styled.p`
  margin: .5rem 0 0;
  font-size: .875rem;
`
