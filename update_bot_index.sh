#!/bin/bash

# 切换到项目目录
cd "$(dirname "$0")"

# 导出数据库数据
sqlite3 .data/db.sqlite3 "SELECT * FROM cache" > cache_data.txt

# 运行生成脚本
node generate_bot_index_from_txt.js

# 输出执行时间
echo "Updated bot index at $(date)"
