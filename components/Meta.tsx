import Head from "next/head";
import type { FC } from "react";

type MetaProps = {
  title?: string;
  ogUrl?: string | null;
  ogImage?: string;
  twitterCreator?: string;
};

export const Meta: FC<MetaProps> = ({
  title,
  ogImage,
  ogUrl,
  twitterCreator,
}) => {
  const pageTitle = title
    ? `${title} | 買ってよかったもの`
    : "買ってよかったもの";
  const pageDescription =
    "買ってよかったものをまとめることができるサービスです。";
  return (
    <Head>
      <title>{pageTitle}</title>
      <meta
        property="og:image"
        content={
          ogImage ??
          "https://pbs.twimg.com/profile_images/995318315181461504/-uqGWbuu_400x400.jpg"
        }
      />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:site_name" content="買ってよかったもの" />
      <meta property="og:description" content={pageDescription} />
      {ogUrl && <meta property="og:url" content="https://katta-yokatta.com" />}
      <meta property="og:type" content="website" />
      <meta name="keywords" content="買ってよかったもの amazon アマゾン" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@katteyokatta_jp" />
      {twitterCreator && (
        <meta name="twitter:creator" content={`@${twitterCreator}`} />
      )}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
};
