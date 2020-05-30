import React from "react";
import { withPrefix as fallbackWithPrefix, withAssetPrefix } from "gatsby";
import { defaultOptions, supportedFormats } from "./default-options";

const withPrefix = withAssetPrefix || fallbackWithPrefix;

function byMatch({ match }) {
  if (typeof match === `string`) return new RegExp(match).exec(pathname);
  return true;
}

function Link({ output, title, link, type }) {
  const href = link || withPrefix(output.replace(/^\/?/, `/`));

  return <link rel="alternate" type={type} title={title} href={href} />;
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

exports.onRenderBody = ({ setHeadComponents, pathname }, pluginOptions) => {
  const { feeds, output } = {
    ...defaultOptions,
    ...pluginOptions,
  };

  const links = feeds
    .filter(byMatch)
    .map((feed, i) =>
      Object.keys(formatLinkData)
        .filter((x) => supportedFormats.includes(x))
        .filter((x) => !!output[x])
        .map((x) => [x, formatLinkData[x]])
        .map(([name, linkData], i) => {
          return (
            <Link
              {...linkData}
              output={output[name]}
              key={`feed-${name}-${i}`}
            />
          );
        })
    )
    .flat();
  setHeadComponents(links);
};
