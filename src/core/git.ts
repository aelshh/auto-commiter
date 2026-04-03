import simpleGit, { SimpleGit } from "simple-git";

export async function prepareBranch(git: SimpleGit, branchName: string) {
  const branches = await git.branch();

  if (!branches.all.includes(branchName)) {
    await git.checkoutLocalBranch(branchName);
  } else {
    await git.checkout(branchName);
  }
}

export async function commitAll(git: SimpleGit, message: string) {
  await git.add("./*");
  await git.commit(message);
}
