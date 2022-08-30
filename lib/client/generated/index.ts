import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
import { ClientError } from 'graphql-request/dist/types';
import useSWR, { SWRConfiguration as SWRConfigInterface, Key as SWRKeyInterface } from 'swr';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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


export const GetAllUsersDocument = gql`
    query getAllUsers {
  allUsers {
    id
    name
    imageUrl
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getAllUsers(variables?: GetAllUsersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetAllUsersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllUsersQuery>(GetAllUsersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAllUsers', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export function getSdkWithHooks(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  const sdk = getSdk(client, withWrapper);
  return {
    ...sdk,
    useGetAllUsers(key: SWRKeyInterface, variables?: GetAllUsersQueryVariables, config?: SWRConfigInterface<GetAllUsersQuery, ClientError>) {
      return useSWR<GetAllUsersQuery, ClientError>(key, () => sdk.getAllUsers(variables), config);
    }
  };
}
export type SdkWithHooks = ReturnType<typeof getSdkWithHooks>;