import querystring from "node:querystring";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

export function GET() {
  const state = generateRandomString(16);

  const scope =
    "user-read-private user-read-email user-top-read playlist-read-private";
  const queryParams = querystring.stringify({
    response_type: "code",
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    state: state,
  });

  const url = `https://accounts.spotify.com/authorize?${queryParams}`;
  return new Response(JSON.stringify({ url }), {
    status: 200,
  });
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length: number) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
