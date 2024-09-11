"use client";
import { Gage } from "./Gage";
import type { PlaylistWithMeta } from "./SearchPlaylist";

const ARTIST_COUNT = 15;

export const PlayListCard: React.FC<PlaylistWithMeta> = ({
  name,
  instrumentalness,
  danceability,
  external_urls,
  images,
  artists,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 w-full hover:opacity-90 transition-opacity duration-300 ease-in-out">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="w-32 h-32 flex-shrink-0">
          <a href={external_urls.spotify} target="_blank" rel="noreferrer">
            <img
              src={images[0].url}
              alt={name}
              className="object-cover w-full h-full rounded-lg"
            />
          </a>
        </div>
        <div className="flex flex-col gap-2 grow">
          <h2 className="text-xl font-bold">{name}</h2>

          <p className="text-[0.7rem] text-gray-300">
            {`${artists.slice(0, ARTIST_COUNT).join(", ")}`}
            {artists.length > ARTIST_COUNT ? ", and more..." : ""}
          </p>
          <ul>
            <li>
              <Gage label="instrumentalness" value={instrumentalness} />
            </li>
            <li>
              <Gage label="danceability" value={danceability} />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
