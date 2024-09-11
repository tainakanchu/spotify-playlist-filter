"use client";
import type { PlaylistWithMeta } from "./SearchPlaylist";

export const PlayListCard: React.FC<PlaylistWithMeta> = ({
  name,
  instrumentalness,
  danceability,
  external_urls,
  images,
}) => {
  // 小数点第2位までの%表示
  const instrumentalnessText = (instrumentalness * 100).toFixed(2);
  const danceabilityText = (danceability * 100).toFixed(2);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 w-full hover:opacity-90 transition-opacity duration-300 ease-in-out">
      <div className="flex flex-row gap-4 items-start">
        <div className="relative w-32 h-32">
          <img
            src={images[0].url}
            alt={name}
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-4 grow">
          <h2 className="text-xl font-bold">{name}</h2>
          <div className="flex gap-4">
            <div>
              <p className="p-2 bg-green-500 text-white rounded-lg text-sm">
                <a
                  href={external_urls.spotify}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Spotify
                </a>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <p>instrumentalness: {`${instrumentalnessText}%`}</p>
              </div>
              <div>
                <p>danceability: {`${danceabilityText}%`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
