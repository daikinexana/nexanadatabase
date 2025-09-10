# データベース設定ガイド

NeonデータベースとClerkの連携設定手順を説明します。

## 1. Neonデータベースの設定

### 手順
1. [Neon Console](https://console.neon.tech/)にログイン
2. 新しいプロジェクトを作成
3. データベース接続URLを取得

### 環境変数の設定
`.env.local`ファイルに以下を追加：

```env
# Neon Database
DATABASE_URL="postgresql://username:password@ep-xxxxx-xxxxx.us-east-1.aws.neon.tech/nexanadatabase?sslmode=require"

# Clerk Webhook Secret
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 2. Clerkの設定

### Webhookの設定
1. [Clerk Dashboard](https://dashboard.clerk.com/)にログイン
2. プロジェクトを選択
3. **Webhooks** → **Add Endpoint** をクリック
4. 以下の設定を追加：
   - **Endpoint URL**: `https://your-domain.com/api/webhooks/clerk`
   - **Events**: `user.created`, `user.updated`, `user.deleted`
5. **Signing Secret**をコピーして環境変数に設定

### 管理者ユーザーの設定
1. **Users** → **Manage users** に移動
2. 管理者にしたいユーザーを選択
3. **Metadata** タブで以下を追加：

```json
{
  "role": "ADMIN"
}
```

## 3. データベースの初期化

### マイグレーションの実行
```bash
# Prismaクライアントの生成
npx prisma generate

# データベースマイグレーション
npx prisma migrate dev --name init

# シードデータの投入
npx prisma db seed
```

### データベースの確認
```bash
# Prisma Studioでデータベースを確認
npx prisma studio
```

## 4. 開発サーバーの起動

```bash
npm run dev
```

## 5. 動作確認

### 1. ホームページ
- http://localhost:3002 にアクセス
- サイトが正常に表示されることを確認

### 2. コンテストページ
- http://localhost:3002/contests にアクセス
- シードデータのコンテストが表示されることを確認

### 3. 管理者ページ
- http://localhost:3002/admin にアクセス
- Clerkのサインインページが表示されることを確認
- 管理者権限のあるユーザーでログイン
- 管理者ダッシュボードが表示されることを確認

## 6. トラブルシューティング

### データベース接続エラー
```bash
Error: P1001: Can't reach database server
```
**解決方法**: DATABASE_URLが正しく設定されているか確認

### Clerk認証エラー
```bash
Error: Please add CLERK_WEBHOOK_SECRET to .env.local
```
**解決方法**: CLERK_WEBHOOK_SECRETが設定されているか確認

### 管理者権限エラー
**解決方法**: Clerkダッシュボードでユーザーのメタデータに`{"role": "ADMIN"}`が設定されているか確認

## 7. 本番環境での設定

### Vercelでの環境変数設定
1. Vercelダッシュボードでプロジェクトを選択
2. **Settings** → **Environment Variables** に移動
3. 以下の環境変数を追加：
   - `DATABASE_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `CLERK_WEBHOOK_SECRET`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_S3_BUCKET_NAME`

### 本番環境でのマイグレーション
```bash
# 本番環境でのマイグレーション
npx prisma migrate deploy
```

## 8. データの管理

### 新しいコンテストの追加
```bash
# API経由で追加
curl -X POST http://localhost:3002/api/contests \
  -H "Content-Type: application/json" \
  -d '{
    "title": "新しいコンテスト",
    "description": "説明",
    "organizer": "主催者",
    "organizerType": "GOVERNMENT",
    "category": "STARTUP_CONTEST",
    "tags": ["タグ1", "タグ2"]
  }'
```

### データの確認
```bash
# Prisma Studioでデータを確認・編集
npx prisma studio
```

これで、NeonデータベースとClerkの連携が完了し、実際のデータを使用したサイトが動作します！
