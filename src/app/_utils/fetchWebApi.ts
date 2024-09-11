import { useSpotify } from "../_context/SpotifyContext";

export const useFetchWebApi = () => {
  const { accessToken } = useSpotify();
  const fetchWebApi = async <T>(
    endpoint: string,
    method: string,
    body?: { [key: string]: string }
  ): Promise<T> => {
    if (!accessToken) {
      throw new Error("Access token is required");
    }
    return fetchSpotifyApi<T>(accessToken, endpoint, method, body);
  };

  const searchPlaylist = async (
    keyword: string
  ): Promise<SpotifyApi.PlaylistSearchResponse> => {
    if (!keyword) {
      throw new Error("Keyword is required");
    }
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists/
    const result = await fetchWebApi<SpotifyApi.PlaylistSearchResponse>(
      `v1/search?q=${keyword}&type=playlist&limit=20`,
      "GET"
    );
    return result;
  };

  const getMe = async (): Promise<SpotifyApi.CurrentUsersProfileResponse> => {
    return fetchWebApi<SpotifyApi.CurrentUsersProfileResponse>("v1/me", "GET");
  };

  return {
    fetchWebApi,
    searchPlaylist,
    getMe,
  };
};

export const fetchSpotifyApi = async <T>(
  accessToken: string,
  endpoint: string,
  method: string,
  body?: { [key: string]: string }
) => {
  const fullEndpoint = endpoint.includes("https://api.spotify.com")
    ? endpoint
    : `https://api.spotify.com/${endpoint}`;

  const res = await fetch(fullEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method,
    body: JSON.stringify(body),
  });
  return (await res.json()) as T;
};
