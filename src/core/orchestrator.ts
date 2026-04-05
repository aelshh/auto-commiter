import simpleGit from "simple-git";
import { repos } from "../config/repo";
import path from "path";
import { hasChanges } from "./scanner";
import { commitAll, prepareBranch } from "./git";
import { generateCommitMessage } from "./ai";
import { connect } from "http2";

export async function run() {
  for (const repo of repos) {
    console.log(`Working on repo: ${repo.path}`);

    const git = simpleGit(repo.path);
    const repoName = path.basename(repo.path);

    const changes = await hasChanges(repo.path);
    if (!changes) {
      console.log(`no changes detect in the repo: ${repo.path} `);
      continue;
    }

    const date = new Date().toISOString().split("T")[0];
    const branchName = `ai/${date}`;

    await prepareBranch(git, branchName);

    const diff = await git.diff();
    if (!diff.trim()) {
      console.log(
        `No actual diff after staging in repo: ${repo.path}, skipping...`,
      );
      continue;
    }
    await git.add("./");

    let message = await generateCommitMessage(repoName, diff);
    if (message.error) {
      message = await generateCommitMessage(repoName, diff);
      if (message.error) {
        throw new Error("No messages generated");
      }
    }

    console.log(`message for ${repo.path}: ${message}`);

    await commitAll(git, message);
    console.log(`Commited for ${repo.path}`);
  }
}
