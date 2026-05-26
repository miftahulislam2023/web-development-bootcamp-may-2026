## Folder bash script to generate all of it at once

```
cd live-chat-frontend

$dirs = @(
  "src/app/(main)",
  "src/app/(auth)/login",
  "src/app/(auth)/signup",
  "src/app/(auth)/verify-email",
  "src/app/(auth)/forgot-password",
  "src/app/(dashboard)",
  "src/app/(admin)",
  "src/components/ui",
  "src/components/chat",
  "src/components/layout",
  "src/lib",
  "src/store/slices",
  "src/types",
  "src/hooks"
)

foreach ($dir in $dirs) {
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

$files = @(
  "src/lib/axios.ts",
  "src/lib/socket.ts",
  "src/store/index.ts",
  "src/store/slices/authSlice.ts",
  "src/store/slices/conversationsSlice.ts",
  "src/store/slices/messagesSlice.ts",
  "src/types/index.ts",
  "src/app/(main)/page.tsx",
  "src/app/(auth)/login/page.tsx",
  "src/app/(auth)/signup/page.tsx",
  "src/app/(auth)/verify-email/page.tsx",
  "src/app/(auth)/forgot-password/page.tsx",
  "src/app/(dashboard)/page.tsx",
  "src/app/(dashboard)/layout.tsx",
  "src/app/(admin)/page.tsx",
  "src/app/(admin)/layout.tsx",
  "proxy.ts"
)

foreach ($file in $files) {
  New-Item -ItemType File -Force -Path $file | Out-Null
}

Write-Host "Done! Structure created." -ForegroundColor Green

```