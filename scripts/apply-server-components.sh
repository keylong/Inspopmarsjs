#!/bin/bash

# 备份原文件并应用新的服务器组件版本
for file in src/app/\[locale\]/download/*/page.tsx; do
  if [ -f "${file%.tsx}.new.tsx" ]; then
    echo "Backing up and replacing: $file"
    mv "$file" "${file}.bak"
    mv "${file%.tsx}.new.tsx" "$file"
  fi
done

# 移除所有 force-dynamic
echo "Removing all force-dynamic exports..."
find src/app/\[locale\] -name "*.tsx" -type f | xargs grep -l "export const dynamic = 'force-dynamic'" | while read file; do
  echo "Removing force-dynamic from: $file"
  sed -i '' "/export const dynamic = 'force-dynamic'/d" "$file"
done

echo "✅ Conversion complete!"