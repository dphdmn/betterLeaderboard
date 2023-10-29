from github import Github
import os
import sys

token_file_path = r'C:\Users\dphdmn\Documents\important\github_s'

try:
    with open(token_file_path, 'r') as token_file:
        github_token = token_file.read().strip()
except FileNotFoundError:
    print(f"Token file not found at {token_file_path}")
    sys.exit(1)

repo_owner = "dphdmn"
repo_name = "betterLeaderboard"
commit_message = "Update data using script"

github = Github(github_token)
repo = github.get_user(repo_owner).get_repo(repo_name)
branch_name = "main"
if len(sys.argv) < 2:
    print("Usage: commit.py <file_to_commit>")
    sys.exit(1)

file_to_commit = sys.argv[1]
file_path = "data/" + file_to_commit
try:
    file = repo.get_contents(file_path, ref=branch_name)
    file_sha = file.sha
except Exception as e:
    file_sha = None

with open(file_to_commit, 'rb') as file:
    new_file_content = file.read()

if file_sha:
    repo.update_file(
        path=file_path,
        message=commit_message,
        content=new_file_content,
        sha=file_sha,
        branch=branch_name
    )
    print(f"Changes to {file_to_commit} committed and pushed to the {branch_name} branch.")
else:
    print(f"The file {file_to_commit} does not exist in the repository.")
