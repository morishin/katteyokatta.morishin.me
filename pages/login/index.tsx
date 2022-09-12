import { GetServerSideProps } from "next";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { makeGetServerSidePropsWithSession } from "~/lib/server/auth/withSession";

export const getServerSideProps: GetServerSideProps =
  makeGetServerSidePropsWithSession<{}>(async (_context, session) => {
    if (session) return { redirect: { destination: "/", permanent: false } };
    return { props: {} };
  });

const Login = () => {
  useEffect(() => {
    signIn();
  }, []);
  return <p>Signing in...</p>;
};
export default Login;
