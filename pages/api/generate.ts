import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "HEAD", "POST"], // Allows these methods
});

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the cors middleware
  await runMiddleware(req, res, cors);
  const { command } = req.query;

  // Make API call to HuggingFace AI model for streaming response
  const apiResponse = await fetch(
    "https://api-inference.huggingface.co/models/OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
      body: JSON.stringify({ inputs: command }),
    }
  );

  const streamingResponse = await apiResponse.text();

  console.log("hellow", streamingResponse);

  res.status(200).json({ streamingResponse });
}
