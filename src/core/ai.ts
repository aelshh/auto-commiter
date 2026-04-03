import axios from "axios";
import { configDotenv } from "dotenv";
import { DiffResult } from "simple-git";

configDotenv();

export async function generateCommitMessage(repoName: string, diff: string) {
  try {
    console.log(diff);

    const res = axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "qwen/qwen3.6-plus:free",
        messages: [
          {
            role: "system",
            content: "Write short conventional commit message",
          },
          {
            role: "user",
            content: `Repo: ${repoName}\n\nDiff:\n${diff}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_ROUTER_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const result = (await res).data.choices[0].message.content.trim();
    return result;
  } catch (e) {
    console.log(e);

    return `chore(${repoName}): auto commit`;
  }
}
