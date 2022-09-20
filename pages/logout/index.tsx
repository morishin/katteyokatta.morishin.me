import { GetServerSideProps } from "next";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { makeGetServerSideProps } from "~/lib/server/ssr/makeGetServerSideProps";

export const getServerSideProps: GetServerSideProps =
  makeGetServerSideProps<{}>(async (_context, { session }) => {
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
