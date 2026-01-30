import { google } from "googleapis";

export const getGmailClient = (accessToken) => {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token: accessToken,
  });

  return google.gmail({ version: "v1", auth });
};

export const fetchFlightEmails = async (accessToken) => {
  const gmail = getGmailClient(accessToken);

  const res = await gmail.users.messages.list({
    userId: "me",
    q: "flight OR ticket OR boarding",
    maxResults: 10,
  });

  if (!res.data.messages) return [];

  const messages = await Promise.all(
    res.data.messages.map(async (msg) => {
      const data = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
      });

      return {
        id: msg.id,
        snippet: data.data.snippet,
      };
    })
  );

  return messages;
};
