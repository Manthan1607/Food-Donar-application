import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
}

const SITE = "https://fooddonar.lovable.app";

export const SEO = ({ title, description, path, image = "/og-image.jpg" }: SEOProps) => {
  const url = `${SITE}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE}${image}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};
