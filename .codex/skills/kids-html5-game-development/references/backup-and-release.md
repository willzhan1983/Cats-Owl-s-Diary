# Backup and Release

## Post-merge Checks

合并后检查：

1. PR 是否 merged。
2. `main` 是否更新。
3. GitHub Actions 是否执行并通过。
4. Google Drive backup 是否成功。

## Failure Handling

任一备份无法验证时，记录：

`backup not verified`

## Security and Evidence

禁止：

- 输出 secret。
- 输出 token。
- 假装备份成功。
- 将本地文件存在误报为远端备份成功。

发布前应核对合并状态、主分支提交、自动化检查、备份证据和基本冒烟测试。任何一项缺少证据，都只能报告为待验证。
