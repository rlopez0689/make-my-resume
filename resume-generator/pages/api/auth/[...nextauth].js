import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

const refreshAccessToken = async (tokenObject) => {
  const tokenResponse = await fetch(
    `${process.env.BACKEND_API_URL}/token/refresh/`,
    {
      method: "POST",
      body: JSON.stringify({
        refresh: tokenObject,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (tokenResponse.ok) {
    const jsonResponse = await tokenResponse.json();
    return [jsonResponse.access, jsonResponse.refresh];
  }

  throw new Error("Authentication Error");
};

const isJWTExpired = (token) => {
  const currentTime = Math.round(Date.now() / 1000);
  const decoded = jwt.decode(token);
  if (decoded["exp"]) {
    const adjustedExpiry = decoded["exp"];
    if (adjustedExpiry < currentTime) return true;
    return false;
  }
  return true;
};

const providers = [
  CredentialsProvider({
    name: "Credentials",
    authorize: async (credentials) => {
      try {
        const userRes = await fetch(`${process.env.BACKEND_API_URL}/token/`, {
          method: "POST",
          body: JSON.stringify({
            password: credentials.password,
            username: credentials.email,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (userRes.status === 401) throw Error("Invalid Credentials");

        const user = await userRes.json();

        if (user.access) {
          const decoded = jwt.decode(user.access);
          user.username = decoded.username;
          return user;
        }

        return null;
      } catch (e) {
        throw new Error(e);
      }
    },
  }),
];

const callbacks = {
  jwt: async ({ token, user }) => {
    if (user) {
      // This will only be executed at login. Each next invocation will skip this part.
      token.accessToken = user.access;
      token.refreshToken = user.refresh;
      token.username = user.username;
    }

    if (isJWTExpired(token.accessToken)) {
      const [newAccessToken, newRefreshToken] = await refreshAccessToken(
        token.refreshToken
      );
      token = {
        ...token,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    }

    return token;
  },
  session: async ({ session, token }) => {
    session.accessToken = token.accessToken;
    session.username = token.username;
    return session;
  },
};

export const authOptions = {
  providers,
  callbacks,
  pages: {
    signIn: "/auth/login",
  },
};

const Auth = (req, res) => NextAuth(req, res, authOptions);
export default Auth;
