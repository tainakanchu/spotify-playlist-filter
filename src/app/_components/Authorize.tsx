"use client";

import { useSearchParams } from "next/navigation";
import { SpotifyProvider, useSpotify } from "../_context/SpotifyContext";
import SearchSpotify from "./SearchPlaylist";
import { useEffect } from "react";

export const AuthorizeSpotify: React.FC = () => {
  const { accessToken, setAccessToken } = useSpotify();

  const searchParams = useSearchParams();

  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      fetch(`/api/token?code=${code}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.token && !accessToken) {
            setAccessToken(data.token);
          }
        });
    }
  }, [code, setAccessToken, accessToken]);

  if (accessToken) {
    return <SearchSpotify />;
  }

  return (
    <SpotifyProvider>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100">
          Authorize Spotify
        </h1>

        <main>
          <p className="mt-3 text-center text-lg text-gray-600 dark:text-gray-400">
            To get started, authorize Spotify
          </p>
          <button
            onClick={() => {
              fetch("/api/login")
                .then((res) => {
                  return res.json();
                })
                .then((data) => {
                  if (data.url) {
                    window.location.href = data.url;
                  } else {
                    console.error("Something went wrong");
                  }
                });
            }}
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out"
          >
            Authorize Spotify
          </button>
        </main>
      </div>
    </SpotifyProvider>
  );
};
