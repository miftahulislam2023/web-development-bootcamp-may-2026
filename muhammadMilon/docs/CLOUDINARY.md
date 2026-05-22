# Cloudinary setup (Nexora Studio)

## 1. Environment variables

In `.env`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dlwxbagrn
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=nexora_unsigned
```

Optional (signed API — deletes from Cloudinary + server-side fallback):

```env
CLOUDINARY_URL=cloudinary://893254211535456:YOUR_REAL_API_SECRET@dlwxbagrn
```

Replace `YOUR_REAL_API_SECRET` with **API Secret** from [Cloudinary Console → Settings → API Keys](https://console.cloudinary.com/settings/api-keys).  
If the secret is still `YOUR_API_SECRET`, uploads still work via the unsigned preset; only remote delete is skipped.

Restart the dev server after changing `.env`.

## 2. Create unsigned upload preset

1. Open [Cloudinary Console → Settings → Upload](https://console.cloudinary.com/settings/upload)
2. **Upload presets → Add upload preset**
3. **Preset name:** `nexora_unsigned`
4. **Signing mode:** **Unsigned**
5. (Recommended) Under **Folder**, enable allowing `folder` in uploads, or set a default folder like `nexora`
6. Save

## 3. Verify

1. Open a project in the builder → **Media** → upload an image
2. The URL should be `https://res.cloudinary.com/dlwxbagrn/...`
3. Images appear in the Cloudinary **Media Library** for that cloud

## Troubleshooting

| Error | Fix |
|--------|-----|
| `Upload preset not found` | Create preset `nexora_unsigned` exactly as named in `.env` |
| `Invalid upload preset` | Preset must be **Unsigned** |
| `Folder parameter not allowed` | In preset settings, allow folder / asset folder, or remove folder from upload code |
| Still using base64 URLs | Restart dev server; confirm `NEXT_PUBLIC_*` vars are set |
