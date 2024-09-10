import { Suspense } from "react";
import { AuthorizeSpotify } from "./_components/Authorize";
import { SpotifyProvider } from "./_context/SpotifyContext";

export default function Home() {
  return (
    <SpotifyProvider>
      <Suspense>
        <AuthorizeSpotify />
      </Suspense>
    </SpotifyProvider>
  );
}
