import React from "react";
import { withPrefix as fallbackWithPrefix, withAssetPrefix } from "gatsby";
import { defaultOptions, supportedFormats } from "./default-options";

const withPrefix = withAssetPrefix || fallbackWithPrefix;

function byMatch({ match }) {
  if (typeof match === `string`) return new RegExp(match).exec(pathname);
  return true;
}

function Link({ output, title, link, type, baseUrl }) {
  const href = link || withPrefix(output);

  return (
    <link
      rel="alternate"
      type={type}
      title={title}
      href={`${baseUrl}${new URL(href).pathname}`}
    />
  );
}

const formatLinkData = {
  rss: {
    type: "application/rss+xml",
  },
  atom: {
    type: "application/atom+xml",
  },
  json: {
    type: "application/json",
  },
};

exports.onRenderBody = async ({ setHeadComponents }, pluginOptions) => {
  const { feeds, feedLinks, baseUrl } = {
    ...defaultOptions,
    ...pluginOptions,
  };

  const links = feeds
    .filter(byMatch)
    .map(() =>
      Object.keys(formatLinkData)
        .filter((x) => supportedFormats.includes(x))
        .filter((x) => !!feedLinks[x])
        .map((x) => [x, formatLinkData[x]])
        .map(([name, linkData], i) => {
          return (
            <Link
              {...linkData}
              output={feedLinks[name]}
              key={`feed-${name}-${i}`}
              baseUrl={baseUrl}
            />
          );
        })
    )
    .flat();
  setHeadComponents(links);
};
