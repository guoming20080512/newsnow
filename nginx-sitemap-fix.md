# Nginx Configuration Fix for sitemap.xml

## Problem Analysis

Looking at your Nginx configuration, I can see the issue:

```nginx
# 配置静态文件路径
root /data/news/newsnow/dist/output/public;
index index.html;

# 缓存静态资源
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|xml)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# 处理前端路由，支持单页应用
location / {
    proxy_pass http://127.0.0.1:3000;
    # proxy settings...
}
```

The problem is that when Nginx receives a request for `/sitemap.xml`, it should serve it as a static file from the `root` directory, but there might be an issue with the location block priority or the file path.

## Solution

Add an explicit location block for `/sitemap.xml` at the beginning of your server block to ensure it's served as a static file:

```nginx
server {
    server_name news.abfjwndjwkdbwkjdnej.store;

    # 配置静态文件路径
    root /data/news/newsnow/dist/output/public;
    index index.html;

    # Explicitly serve sitemap.xml as static file
    location = /sitemap.xml {
        try_files $uri =404;
        add_header Content-Type "application/xml; charset=utf-8";
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|xml)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 处理前端路由，支持单页应用
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 600s;
    }

    # SSL configuration...
}
```

## Verification Steps

1. **Check if sitemap.xml exists**:
   ```bash
   ls -la /data/news/newsnow/dist/output/public/sitemap.xml
   ```

2. **Verify file permissions**:
   ```bash
   chmod 644 /data/news/newsnow/dist/output/public/sitemap.xml
   ```

3. **Restart Nginx**:
   ```bash
   sudo systemctl restart nginx
   ```

4. **Test the sitemap.xml**:
   ```bash
   curl -s https://news.abfjwndjwkdbwkjdnej.store/sitemap.xml | head -20
   ```

## Additional Fix

Let me also update the sitemap.ts script to ensure the file is generated with proper permissions:

```typescript
// 写入文件
publicPaths.forEach((outputPath) => {
  try {
    // 确保目录存在
    fs.mkdirSync(path.dirname(outputPath), { recursive: true, mode: 0o755 })
    // 写入文件
    fs.writeFileSync(outputPath, sitemapXml, "utf-8", { mode: 0o644 })
    console.log(`✅ Sitemap生成成功，共${urls.length}个URL，已保存到${outputPath}`)
  } catch (error) {
    console.error(`❌ 无法写入到${outputPath}:`, error instanceof Error ? error.message : String(error))
  }
})
```

This ensures the file is created with read permissions for everyone.
