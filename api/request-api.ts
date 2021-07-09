import { verify } from 'hcaptcha';
import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

interface Payload {
  request: string;
  hcaptcha: string;
};

interface FormRecord {
  method: 'POST',
  sheet: string,
  key: string,
  payload: Record<string, string>,
};

export default async function(request: VercelRequest, response: VercelResponse) {
  const data: Payload = JSON.parse(request.body);

  try {
    const { success } = await verify(process.env.HCAPTCHA_SECRET, data.hcaptcha);
    if (!success) return response.status(401).send("Unauthorized");

    const record: FormRecord = {
      method: 'POST',
      key: '',
      sheet: 'requests',
      payload: {
        request: data.request,
      },
    };

    const res = await fetch(process.env.GOOGLE_SHEETS_API, {
      method: 'POST',
      body: JSON.stringify(record),
    });

    if (res.status === 200) {
      return response.status(200).send("Successfull");
    } else {
      return response.status(500).send("An error occurred")
    }
  } catch(err) {
    return response.status(500).send("An error occurred");
  }
}