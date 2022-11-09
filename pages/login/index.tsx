import { GetServerSideProps } from "next";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { makeGetServerSideProps } from "~/lib/server/ssr/makeGetServerSideProps";

export const getServerSideProps: GetServerSideProps =
  makeGetServerSideProps<{}>(async (_context, { session }) => {
    if (session) return { redirect: { destination: "/", permanent: false } };
    return { props: {} };
  });

const Login = () => {
  useEffect(() => {
    signIn("twitter");
  }, []);
  return <p>Signing in...</p>;
};
export default Login;
