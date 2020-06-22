import { Feed } from "feed";
import path from "path";
import fs from "fs";
import { defaultOptions, supportedFormats } from "./default-options";
import { cleanDate } from "./utils";

const formatFeedMap = {
  json: "json1",
  rss: "rss2",
  atom: "atom1",
};

const publicPath = `./public`;

function runQuery(handler, query) {
  return handler(query).then((r) => {
    if (r.errors) {
      throw new Error(r.errors.join(`, `));
    }

    return r.data;
  });
}

exports.onPostBuild = async ({ graphql }, pluginOptions) => {
  const { formats, setup, ...options } = {
    ...defaultOptions,
    ...pluginOptions,
  };

  const siteQuery = await runQuery(graphql, options.query);

  for (let feedData of options.feeds) {
    const feedQuery = await runQuery(graphql, feedData.query);
    const queryData = { query: { ...siteQuery, ...feedQuery } };
    const feedItems = feedData.serialize(queryData);

    const feed = new Feed({
      ...setup({ ...options, ...queryData }),
      ...feedData.options,
      updated: cleanDate(pluginOptions.updated || defaultOptions.updated),
    });

    feedItems.forEach((item) =>
      feed.addItem({
        ...item,
        date: cleanDate(item.date),
        published: cleanDate(item.published),
      })
    );

    const formats = Object.keys(options.feedLinks).filter((x) =>
      supportedFormats.includes(x)
    );

    await Promise.all(
      formats.map(async (format) => {
        const formatFn = formatFeedMap[format];
        const fileName = new URL(options.feedLinks[format]).pathname;

        const outputPath = path.join(publicPath, fileName);

        return new Promise((resolve, reject) => {
          fs.writeFile(
            outputPath,
            feed[formatFn].call(),
            {
              encoding: options.encoding,
            },
            (err) => {
              if (err) {
                reject(err);
              }
              console.info(`Wrote ${format} feed to ${outputPath}`);

              resolve();
            }
          );
        });
      })
    );
  }
};
