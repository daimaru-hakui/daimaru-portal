import { NextApiRequest, NextApiResponse } from "next";

export  default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const params = {
    headers: {
      "X-MICROCMS-API-KEY": "5cb4353cc17045be9dc39f4dd1cac7ff7fc9",
      cache: "no-cache",
    },
  };
  const url = "https://makerweb.microcms.io/api/v1/maker-return";
  const res = await fetch(url, params);
  if (!res.ok) {
    return response.status(500)
  }
  const data = await res.json();
  return response.status(200).json({ content: data.makerReturnContent });
}
