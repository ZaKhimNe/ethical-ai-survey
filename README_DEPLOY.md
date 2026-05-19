# Deploy lên Vercel — hướng dẫn

## Bước 1 — Cài dependencies và chạy local

```bash
cd survey-app
npm install
cp .env.example .env
# Điền VITE_SUPABASE_URL và VITE_SUPABASE_KEY vào .env
npm run dev
# Mở http://localhost:5173?code=VN001 để test
```

## Bước 2 — Push lên GitHub

```bash
git init
git add .
git commit -m "init survey app"
git remote add origin https://github.com/YOUR_USERNAME/ethical-ai-survey.git
git push -u origin main
```

## Bước 3 — Deploy Vercel

1. Vào https://vercel.com → New Project
2. Import repo GitHub vừa tạo
3. Vào Settings → Environment Variables, thêm:
   - `VITE_SUPABASE_URL` = `https://xxyqlfeeopgmwqzqlisy.supabase.co`
   - `VITE_SUPABASE_KEY` = `sb_publishable_...` ← Publishable key
4. Click Deploy
5. Vercel tự build và cho domain: `https://ethical-ai-survey.vercel.app`

## Bước 4 — Gửi link cho bạn bè

```
https://ethical-ai-survey.vercel.app?code=VN001
https://ethical-ai-survey.vercel.app?code=VN002
...
```

Hoặc gửi link không có code — người dùng tự nhập vào ô.

## Xem responses

Vào Supabase Dashboard → Table Editor → responses → Download CSV

## Bảng responses cần tạo

```sql
CREATE TABLE responses (
  id          bigserial PRIMARY KEY,
  code        text NOT NULL,
  scenario_id integer NOT NULL,
  choice      text NOT NULL,
  region      text,
  created_at  timestamptz DEFAULT now()
);
```
