"use client";
import { SpotifyProvider } from "../_context/SpotifyContext";
import { useCallback, useState } from "react";
import { useFetchWebApi } from "../_utils/fetchWebApi";

type PlaylistWithMeta = SpotifyApi.PlaylistObjectFull & {
  instrumentalness: number;
  danceability: number;
};

export default function SearchSpotify() {
  const [keyword, setKeyword] = useState("");

  const { fetchWebApi, searchPlaylist } = useFetchWebApi();

  const [playlists, setPlaylists] = useState<PlaylistWithMeta[]>([]);

  const [errorMessage, setErrorMessage] = useState("");

  const search = useCallback(
    (keyword: string) => {
      setErrorMessage("");

      searchPlaylist(keyword)
        .then((data) => {
          const items = data.playlists.items as SpotifyApi.PlaylistObjectFull[];

          const features = items.map(async (playlist) => {
            // トラック情報の取得
            const audioIdList = await fetchWebApi<
              SpotifyApi.PagingObject<SpotifyApi.PlaylistTrackObject>
            >(playlist.tracks.href, "GET").then((data) => {
              return data.items
                .map((el) => {
                  return el.track?.id;
                })
                .filter((id): id is string => id !== null);
            });

            const feature =
              await fetchWebApi<SpotifyApi.MultipleAudioFeaturesResponse>(
                `v1/audio-features?ids=${audioIdList.join(",")}`,
                "GET",
              ).then((data) => {
                return data.audio_features;
              });

            const instrumentalness =
              feature
                .map((feature) => {
                  return feature?.instrumentalness ?? 0.5;
                })
                .reduce((acc, cur) => acc + cur, 0) / feature.length;

            const danceability =
              feature
                .map((feature) => {
                  return feature?.danceability ?? 0.5;
                })
                .reduce((acc, cur) => acc + cur, 0) / feature.length;

            return {
              instrumentalness,
              danceability,
            };
          });

          Promise.all(features).then((meta) => {
            setPlaylists(
              items.map((playlist, index) => {
                return {
                  ...playlist,
                  instrumentalness: meta[index].instrumentalness,
                  danceability: meta[index].danceability,
                };
              }),
            );
          });
        })
        .catch((e) => {
          console.error(e);
          setErrorMessage(e.message);
        });
    },
    [fetchWebApi, searchPlaylist],
  );

  return (
    <SpotifyProvider>
      <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)] ">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <h1 className="text-4xl font-bold">
            Spotify Playlist Search with features
          </h1>
          <div className="flex gap-4">
            <input
              type="text"
              className="p-4 border border-gray-300 rounded-lg w-96 dark:bg-gray-800 dark:text-white"
              placeholder="Input keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              className={`p-4 bg-green-500 text-white rounded-lg transition-opacity duration-300 ease-in-out ${
                !keyword ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => {
                search(keyword);
              }}
              disabled={!keyword}
              type="button"
            >
              Search
            </button>
          </div>
          <div>
            {errorMessage && (
              <div>
                <p className="text-red-400">エラーが発生しました</p>
                <p className="text-red-400 text-xs">{errorMessage}</p>
              </div>
            )}
          </div>

          {playlists.map(
            ({
              name,
              instrumentalness,
              danceability,
              external_urls,
              snapshot_id,
            }) => {
              // 小数点第2位までの%表示
              const instrumentalnessText = (instrumentalness * 100).toFixed(2);
              const danceabilityText = (danceability * 100).toFixed(2);

              return (
                <div
                  key={snapshot_id}
                  className="flex flex-col gap-4 items-center sm:items-start"
                >
                  <div className="flex flex-col gap-2 items-center sm:items-start">
                    <h2 className="text-xl font-bold">{name}</h2>
                  </div>

                  <div>
                    <p>インスト度: {`${instrumentalnessText}%`}</p>
                  </div>
                  <div>
                    <p>踊りやすさ: {`${danceabilityText}%`}</p>
                  </div>

                  <a
                    href={external_urls.spotify}
                    target="_blank"
                    className="p-4 bg-green-500 text-white rounded-lg"
                    rel="noreferrer"
                  >
                    Open in Spotify
                  </a>
                </div>
              );
            },
          )}
        </main>
      </div>
    </SpotifyProvider>
  );
}
