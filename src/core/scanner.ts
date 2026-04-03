  import simpleGit from "simple-git";

  export async function hasChanges(repoPath: string) {
    const git = simpleGit(repoPath);
    const status = await git.status();
    return !status.isClean();
  }
