export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** Represents a Pokémon's attack types */
export type IAttack = {
  /** The name of this Pokémon attack */
  name?: Maybe<Scalars["String"]>;
  /** The type of this Pokémon attack */
  type?: Maybe<Scalars["String"]>;
  /** The damage of this Pokémon attack */
  damage?: Maybe<Scalars["Int"]>;
};

/** Represents a Pokémon */
export type IPokemon = {
  /** The ID of an object */
  id: Scalars["ID"];
  /** The identifier of this Pokémon */
  number?: Maybe<Scalars["String"]>;
  /** The name of this Pokémon */
  name?: Maybe<Scalars["String"]>;
  /** The minimum and maximum weight of this Pokémon */
  weight?: Maybe<IPokemonDimension>;
  /** The minimum and maximum weight of this Pokémon */
  height?: Maybe<IPokemonDimension>;
  /** The classification of this Pokémon */
  classification?: Maybe<Scalars["String"]>;
  /** The type(s) of this Pokémon */
  types?: Maybe<Array<Maybe<Scalars["String"]>>>;
  /** The type(s) of Pokémons that this Pokémon is resistant to */
  resistant?: Maybe<Array<Maybe<Scalars["String"]>>>;
  /** The attacks of this Pokémon */
  attacks?: Maybe<IPokemonAttack>;
  /** The type(s) of Pokémons that this Pokémon weak to */
  weaknesses?: Maybe<Array<Maybe<Scalars["String"]>>>;
  fleeRate?: Maybe<Scalars["Float"]>;
  /** The maximum CP of this Pokémon */
  maxCP?: Maybe<Scalars["Int"]>;
  /** The evolutions of this Pokémon */
  evolutions?: Maybe<Array<Maybe<IPokemon>>>;
  /** The evolution requirements of this Pokémon */
  evolutionRequirements?: Maybe<IPokemonEvolutionRequirement>;
  /** The maximum HP of this Pokémon */
  maxHP?: Maybe<Scalars["Int"]>;
  image?: Maybe<Scalars["String"]>;
};

/** Represents a Pokémon's attack types */
export type IPokemonAttack = {
  /** The fast attacks of this Pokémon */
  fast?: Maybe<Array<Maybe<IAttack>>>;
  /** The special attacks of this Pokémon */
  special?: Maybe<Array<Maybe<IAttack>>>;
};

/** Represents a Pokémon's dimensions */
export type IPokemonDimension = {
  /** The minimum value of this dimension */
  minimum?: Maybe<Scalars["String"]>;
  /** The maximum value of this dimension */
  maximum?: Maybe<Scalars["String"]>;
};

/** Represents a Pokémon's requirement to evolve */
export type IPokemonEvolutionRequirement = {
  /** The amount of candy to evolve */
  amount?: Maybe<Scalars["Int"]>;
  /** The name of the candy to evolve */
  name?: Maybe<Scalars["String"]>;
};

/** Query any Pokémon by number or name */
export type IQuery = {
  query?: Maybe<IQuery>;
  pokemons?: Maybe<Array<Maybe<IPokemon>>>;
  pokemon?: Maybe<IPokemon>;
};

/** Query any Pokémon by number or name */
export type IQueryPokemonsArgs = {
  first: Scalars["Int"];
};

/** Query any Pokémon by number or name */
export type IQueryPokemonArgs = {
  id?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
};
export type IGetPikachuQueryVariables = {};

export type IGetPikachuQuery = { __typename?: "Query" } & {
  pokemon: Maybe<
    { __typename?: "Pokemon" } & Pick<IPokemon, "id" | "number" | "name">
  >;
};

import gql from "graphql-tag";
import * as React from "react";
import * as ReactApollo from "react-apollo";
import * as ReactApolloHooks from "react-apollo-hooks";
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export const GetPikachuDocument = gql`
  query getPikachu {
    pokemon(name: "Pikachu") {
      id
      number
      name
    }
  }
`;

export const GetPikachuComponent = (
  props: Omit<
    Omit<
      ReactApollo.QueryProps<IGetPikachuQuery, IGetPikachuQueryVariables>,
      "query"
    >,
    "variables"
  > & { variables?: IGetPikachuQueryVariables }
) => (
  <ReactApollo.Query<IGetPikachuQuery, IGetPikachuQueryVariables>
    query={GetPikachuDocument}
    {...props}
  />
);

export type IGetPikachuProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<IGetPikachuQuery, IGetPikachuQueryVariables>
> &
  TChildProps;
export function withGetPikachu<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IGetPikachuQuery,
    IGetPikachuQueryVariables,
    IGetPikachuProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    IGetPikachuQuery,
    IGetPikachuQueryVariables,
    IGetPikachuProps<TChildProps>
  >(GetPikachuDocument, {
    alias: "withGetPikachu",
    ...operationOptions
  });
}

export function useGetPikachuQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<IGetPikachuQueryVariables>
) {
  return ReactApolloHooks.useQuery<IGetPikachuQuery, IGetPikachuQueryVariables>(
    GetPikachuDocument,
    baseOptions
  );
}
