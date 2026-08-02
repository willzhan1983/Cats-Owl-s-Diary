# Asset Management

## Character Assets

Mimi 和 Owlly 的正式角色素材禁止自动替换。任何形象变化都必须先确认，并保留可回退的旧版本。

禁止：

- 旧 SVG fallback 进入正式角色流程。
- 棋盘格透明错误进入正式资源。
- 测试图进入正式目录。
- 用未确认的生成图覆盖已批准角色。

## Version Directories

- 正式资源：`v6/`
- 测试资源：`v6-test/`

## Change Record

每次图片修改必须说明：

- 来源
- 用途
- 文件路径

正式游戏资源还必须满足：透明 PNG/RGBA、英文小写文件名、统一画布尺寸、角色脚底基准线一致，并在缺失时保留安全 fallback。接入前应检查实际 alpha 通道、比例和运行时加载结果。
