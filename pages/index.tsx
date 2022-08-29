import { GraphQLClient } from "graphql-request";
import type { GetServerSideProps, NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { withSession } from "../lib/server/auth/withSession";
import { useGetAllUsersQuery, User } from "../lib/client/generated/index";
import { FC } from "react";

type HomeProps = {
  initialUsers: User[];
};

export const getServerSideProps: GetServerSideProps<HomeProps> = withSession(
  async (_context) => {
    return { props: { initialUsers: [] } };
  }
);

const graphqlClient = new GraphQLClient("/api/graphql");

const Home: NextPage<HomeProps> = ({ initialUsers }) => {
  const { status } = useSession();
  const allUsersResult = useGetAllUsersQuery(graphqlClient);

  return (
    <div>
      <Head>
        <title>next-prisma-graphql-example</title>
      </Head>

      <header>
        {status === "loading" ? (
          <p>Loading...</p>
        ) : status === "authenticated" ? (
          <button onClick={() => signOut()}>Sign out</button>
        ) : (
          <button onClick={() => signIn()}>Sign in</button>
        )}
      </header>

      <h1>next-prisma-graphql-example</h1>

      <section>
        <h2>Users List (SSR)</h2>
        <p>
          Data is fetched in `getServerSideProps` from DB with Prisma Client.
        </p>
        <UsersList users={initialUsers} />
      </section>

      <section>
        <h2>Users List (CSR)</h2>
        <p>
          Data is fetched by client via GraphQL API (Apollo Server is running on
          API Routes of Next.js).
        </p>
        {allUsersResult.isLoading ? (
          <div>Loading...</div>
        ) : allUsersResult.isError ? (
          <div>Error</div>
        ) : (
          allUsersResult.data && (
            <UsersList users={allUsersResult.data.allUsers} />
          )
        )}
      </section>
    </div>
  );
};

const UsersList: FC<{ users: User[] }> = ({ users }) => (
  <ul>
    {users.map((user) => (
      <li key={user.id}>
        <span>{user.name}</span>
        {user.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.imageUrl} width={30} height={30} alt="" />
        )}
      </li>
    ))}
  </ul>
);

export default Home;
