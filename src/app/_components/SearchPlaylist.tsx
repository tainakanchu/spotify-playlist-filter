"use client";
import { SpotifyProvider } from "../_context/SpotifyContext";
import { useCallback, useState } from "react";
import { useFetchWebApi } from "../_utils/fetchWebApi";
import { Progress } from "./Progress";
import { PlayListCard } from "./PlayListCard";

export type PlaylistWithMeta = SpotifyApi.PlaylistObjectFull & {
  instrumentalness: number;
  danceability: number;
  artists: string[];
};

function normalizeArray(arr: string[]): string[] {
  // 頻度をカウントするためのマップを作成
  const frequencyMap = arr.reduce(
    (acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    },
    {} as { [key: string]: number },
  );

  // 頻度の高い順にソート
  const sortedArray = Object.keys(frequencyMap).sort(
    (a, b) => frequencyMap[b] - frequencyMap[a],
  );

  return sortedArray;
}

export default function SearchSpotify() {
  const [keyword, setKeyword] = useState("");

  const { fetchWebApi, searchPlaylist } = useFetchWebApi();

  const [playlists, setPlaylists] = useState<PlaylistWithMeta[]>([]);

  const [errorMessage, setErrorMessage] = useState("");

  const [searching, setSearching] = useState(false);

  const search = useCallback(
    (keyword: string) => {
      setSearching(true);
      setErrorMessage("");
      setPlaylists([]);

      searchPlaylist(keyword)
        .then(async (data) => {
          const items = data.playlists.items as SpotifyApi.PlaylistObjectFull[];

          const features = items.map(async (playlist) => {
            // トラック情報の取得
            const audioList = await fetchWebApi<
              SpotifyApi.PagingObject<SpotifyApi.PlaylistTrackObject>
            >(playlist.tracks.href, "GET").then((data) => {
              return data.items.map((el) => {
                return el.track;
              });
            });

            const artistList = normalizeArray(
              audioList
                .map((el) => {
                  return el?.artists[0].name;
                })
                .filter((name): name is string => name !== null),
            );

            const audioIdList = audioList
              .map((el) => el?.id)
              .filter((id): id is string => id !== null);

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
              artistList,
            };
          });

          await Promise.all(features)
            .then((meta) => {
              setPlaylists(
                items.map((playlist, index) => {
                  return {
                    ...playlist,
                    instrumentalness: meta[index].instrumentalness,
                    danceability: meta[index].danceability,
                    artists: meta[index].artistList,
                  };
                }),
              );
            })
            .finally(() => {
              setSearching(false);
            });
        })
        .catch((e) => {
          console.error(e);
          setErrorMessage(e.message);
          setSearching(false);
        });
    },
    [fetchWebApi, searchPlaylist],
  );

  return (
    <SpotifyProvider>
      <div className="justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)] ">
        <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
          <h1 className="text-4xl font-bold">
            Spotify Playlist Search with features
          </h1>
          <div className="flex gap-4 w-full">
            <div className="flex-grow">
              <input
                type="text"
                className="p-4 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white w-full"
                placeholder="Input keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <button
              className={`p-4 bg-green-500 text-white rounded-lg transition-opacity duration-300 ease-in-out ${
                !keyword ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => {
                search(keyword);
              }}
              disabled={!keyword || searching}
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

          {searching && <Progress />}

          {playlists.map((playlistWithMeta) => {
            return (
              <PlayListCard
                key={playlistWithMeta.snapshot_id}
                {...playlistWithMeta}
              />
            );
          })}
        </main>
      </div>
    </SpotifyProvider>
  );
}
