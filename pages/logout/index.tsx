import { GetServerSideProps } from "next";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { makeGetServerSidePropsWithSession } from "~/lib/server/auth/withSession";

export const getServerSideProps: GetServerSideProps =
  makeGetServerSidePropsWithSession<{}>(async (_context, session) => {
    if (!session) return { redirect: { destination: "/", permanent: false } };
    return { props: {} };
  });

const Logout = () => {
  useEffect(() => {
    signOut();
  }, []);
  return <p>Signing out...</p>;
};
export default Logout;
