import { AuthorizeSpotify } from "./_components/Authorize";
import { SpotifyProvider } from "./_context/SpotifyContext";

export default function Home() {
  return (
    <SpotifyProvider>
      <AuthorizeSpotify />
    </SpotifyProvider>
  );
}
