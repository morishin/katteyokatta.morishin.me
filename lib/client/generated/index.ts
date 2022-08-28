import { GraphQLClient } from 'graphql-request';
import { RequestInit } from 'graphql-request/dist/types.dom';
import { useQuery, UseQueryOptions } from 'react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(client: GraphQLClient, query: string, variables?: TVariables, headers?: RequestInit['headers']) {
  return async (): Promise<TData> => client.request<TData, TVariables>(query, variables, headers);
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  allUsers: Array<User>;
  user: User;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', allUsers: Array<{ __typename?: 'User', id: string, name?: string | null, imageUrl?: string | null }> };


export const GetAllUsersDocument = `
    query getAllUsers {
  allUsers {
    id
    name
    imageUrl
  }
}
    `;
export const useGetAllUsersQuery = <
      TData = GetAllUsersQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetAllUsersQueryVariables,
      options?: UseQueryOptions<GetAllUsersQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetAllUsersQuery, TError, TData>(
      variables === undefined ? ['getAllUsers'] : ['getAllUsers', variables],
      fetcher<GetAllUsersQuery, GetAllUsersQueryVariables>(client, GetAllUsersDocument, variables, headers),
      options
    );

useGetAllUsersQuery.getKey = (variables?: GetAllUsersQueryVariables) => variables === undefined ? ['getAllUsers'] : ['getAllUsers', variables];
;
