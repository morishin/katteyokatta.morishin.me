import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
import { ClientError } from 'graphql-request/dist/types';
import useSWR, { SWRConfiguration as SWRConfigInterface, Key as SWRKeyInterface } from 'swr';
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite';
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
  ISO8601DateTime: string;
};

export type Item = {
  __typename?: 'Item';
  asin: Scalars['String'];
  createdAt: Scalars['ISO8601DateTime'];
  id: Scalars['Int'];
  image?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type PageArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type Post = {
  __typename?: 'Post';
  comment: Scalars['String'];
  createdAt: Scalars['ISO8601DateTime'];
  id: Scalars['Int'];
  item: Item;
  user: User;
};

export type PostConnection = {
  __typename?: 'PostConnection';
  edges: Array<PostEdge>;
  pageInfo: PageInfo;
};

export type PostEdge = {
  __typename?: 'PostEdge';
  cursor: Scalars['String'];
  node: Post;
};

export type Query = {
  __typename?: 'Query';
  posts: PostConnection;
};


export type QueryPostsArgs = {
  page: PageArgs;
  userId?: InputMaybe<Scalars['Int']>;
};

export type User = {
  __typename?: 'User';
  associateTag?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  image?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type DefaultPostFragment = { __typename?: 'Post', id: number, comment: string, createdAt: string, user: { __typename?: 'User', id: number, name: string, image?: string | null, associateTag?: string | null }, item: { __typename?: 'Item', id: number, asin: string, name: string, image?: string | null } };

export type GetAllPostsQueryVariables = Exact<{
  page: PageArgs;
}>;


export type GetAllPostsQuery = { __typename?: 'Query', posts: { __typename?: 'PostConnection', pageInfo: { __typename?: 'PageInfo', hasPreviousPage: boolean, startCursor?: string | null }, edges: Array<{ __typename?: 'PostEdge', node: { __typename?: 'Post', id: number, comment: string, createdAt: string, user: { __typename?: 'User', id: number, name: string, image?: string | null, associateTag?: string | null }, item: { __typename?: 'Item', id: number, asin: string, name: string, image?: string | null } } }> } };

export const DefaultPostFragmentDoc = gql`
    fragment DefaultPost on Post {
  id
  comment
  createdAt
  user {
    id
    name
    image
    associateTag
  }
  item {
    id
    asin
    name
    image
  }
}
    `;
export const GetAllPostsDocument = gql`
    query getAllPosts($page: PageArgs!) {
  posts(page: $page) {
    pageInfo {
      hasPreviousPage
      startCursor
    }
    edges {
      node {
        ...DefaultPost
      }
    }
  }
}
    ${DefaultPostFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getAllPosts(variables: GetAllPostsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetAllPostsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllPostsQuery>(GetAllPostsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAllPosts', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export type SWRInfiniteKeyLoader<Data = unknown, Variables = unknown> = (
  index: number,
  previousPageData: Data | null
) => [keyof Variables, Variables[keyof Variables] | null] | null;
export function getSdkWithHooks(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  const sdk = getSdk(client, withWrapper);
  const utilsForInfinite = {
    generateGetKey: <Data = unknown, Variables = unknown>(
      id: string,
      getKey: SWRInfiniteKeyLoader<Data, Variables>
    ) => (pageIndex: number, previousData: Data | null) => {
      const key = getKey(pageIndex, previousData)
      return key ? [id, ...key] : null
    },
    generateFetcher: <Query = unknown, Variables = unknown>(query: (variables: Variables) => Promise<Query>, variables?: Variables) => (
        id: string,
        fieldName: keyof Variables,
        fieldValue: Variables[typeof fieldName]
      ) => query({ ...variables, [fieldName]: fieldValue } as Variables)
  }
  const genKey = <V extends Record<string, unknown> = Record<string, unknown>>(name: string, object: V = {} as V): SWRKeyInterface => [name, ...Object.keys(object).sort().map(key => object[key])];
  return {
    ...sdk,
    useGetAllPosts(variables: GetAllPostsQueryVariables, config?: SWRConfigInterface<GetAllPostsQuery, ClientError>) {
      return useSWR<GetAllPostsQuery, ClientError>(genKey<GetAllPostsQueryVariables>('GetAllPosts', variables), () => sdk.getAllPosts(variables), config);
    },
    useGetAllPostsInfinite(getKey: SWRInfiniteKeyLoader<GetAllPostsQuery, GetAllPostsQueryVariables>, variables: GetAllPostsQueryVariables, config?: SWRInfiniteConfiguration<GetAllPostsQuery, ClientError>) {
      return useSWRInfinite<GetAllPostsQuery, ClientError>(
        utilsForInfinite.generateGetKey<GetAllPostsQuery, GetAllPostsQueryVariables>(genKey<GetAllPostsQueryVariables>('GetAllPosts', variables), getKey),
        utilsForInfinite.generateFetcher<GetAllPostsQuery, GetAllPostsQueryVariables>(sdk.getAllPosts, variables),
        config);
    }
  };
}
export type SdkWithHooks = ReturnType<typeof getSdkWithHooks>;