"use client";
import type React from "react";
import { createContext, useState, useContext, type ReactNode } from "react";

interface SpotifyContextProps {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshToken: string | null;
  setRefreshToken: (token: string | null) => void;
}

const SpotifyContext = createContext<SpotifyContextProps | undefined>(
  undefined,
);

type Props = {
  children: ReactNode;
};

export const SpotifyProvider: React.FC<Props> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  return (
    <SpotifyContext.Provider
      value={{
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = (): SpotifyContextProps => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error("useSpotify must be used within a SpotifyProvider");
  }
  return context;
};
