# 環境変数設定ガイド

このドキュメントでは、Nexana Databaseの各環境での環境変数設定方法を説明します。

## 環境別ファイル構成

- `.env.local.example` → `.env.local` (開発環境)
- `.env.staging.example` → `.env.staging` (ステージング環境)
- `.env.production.example` → `.env.production` (本番環境)

## 1. 開発環境の設定

### 手順

1. `.env.local.example`を`.env.local`にコピー
```bash
cp .env.local.example .env.local
```

2. 以下の値を実際の値に置き換え：

#### データベース設定
```env
DATABASE_URL="postgresql://username:password@localhost:5432/nexanadatabase_dev"
```
- ローカルPostgreSQLまたはNeonの開発用データベースURL

#### Clerk認証設定
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_development_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_development_clerk_secret_key_here
```
- [Clerk Dashboard](https://dashboard.clerk.com/)で開発用アプリケーションを作成
- 公開キーとシークレットキーを取得

#### AWS S3設定
```env
AWS_ACCESS_KEY_ID=your_development_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_development_aws_secret_access_key
AWS_S3_BUCKET_NAME=nexana-database-images-dev
```
- AWS IAMでS3アクセス権限を持つユーザーを作成
- 開発用S3バケットを作成

## 2. ステージング環境の設定

### 手順

1. `.env.staging.example`を`.env.staging`にコピー
```bash
cp .env.staging.example .env.staging
```

2. ステージング環境用の値を設定：

#### データベース設定
```env
DATABASE_URL="postgresql://username:password@ep-xxxxx-xxxxx.us-east-1.aws.neon.tech/nexanadatabase_staging?sslmode=require"
```
- Neonでステージング用データベースを作成

#### アプリケーションURL
```env
NEXT_PUBLIC_APP_URL=https://nexana-database-staging.vercel.app
```
- Vercelのステージング環境URL

## 3. 本番環境の設定

### 手順

1. `.env.production.example`を`.env.production`にコピー
```bash
cp .env.production.example .env.production
```

2. 本番環境用の値を設定：

#### データベース設定
```env
DATABASE_URL="postgresql://username:password@ep-xxxxx-xxxxx.us-east-1.aws.neon.tech/nexanadatabase_production?sslmode=require"
```
- Neonで本番用データベースを作成

#### Clerk認証設定
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_production_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_live_your_production_clerk_secret_key_here
```
- Clerkで本番用アプリケーションを作成（Liveキーを使用）

#### アプリケーションURL
```env
NEXT_PUBLIC_APP_URL=https://nexanadatabase.com
```
- 本番ドメイン

#### Google Analytics
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
- Google Analytics 4の測定ID

## 4. Vercelでの環境変数設定

### ステージング環境
1. Vercelダッシュボードでプロジェクトを選択
2. Settings → Environment Variables
3. ステージング環境用の変数を追加

### 本番環境
1. 同様に本番環境用の変数を追加

## 5. セキュリティのベストプラクティス

### 開発環境
- テスト用のキーを使用
- 本番データにアクセスしない
- デバッグ情報を有効にする

### ステージング環境
- 本番に近い設定を使用
- テスト用データを使用
- 本番キーは使用しない

### 本番環境
- 本番用キーのみを使用
- セキュリティ設定を最大限に
- ログレベルを適切に設定

## 6. 環境変数の確認

### 開発環境での確認
```bash
npm run dev
```
- ブラウザで http://localhost:3000 にアクセス
- コンソールでエラーがないか確認

### 本番環境での確認
```bash
npm run build
npm run start
```

## 7. トラブルシューティング

### よくある問題

1. **データベース接続エラー**
   - DATABASE_URLが正しいか確認
   - データベースが起動しているか確認

2. **Clerk認証エラー**
   - 公開キーとシークレットキーが正しいか確認
   - 環境（test/live）が一致しているか確認

3. **S3アップロードエラー**
   - AWS認証情報が正しいか確認
   - S3バケットが存在するか確認
   - バケットの権限設定を確認

4. **環境変数が読み込まれない**
   - ファイル名が正しいか確認（.env.local）
   - サーバーを再起動
   - キャッシュをクリア

## 8. 環境変数の管理

### チーム開発での注意点
- `.env.local`は`.gitignore`に含まれているため、Gitにコミットされません
- チームメンバーには`.env.local.example`を共有
- 本番環境の機密情報は安全に管理

### 環境変数の更新
- 本番環境の環境変数を変更する場合は、Vercelダッシュボードから行う
- 変更後はアプリケーションを再デプロイ

## 9. 監視とログ

### ログレベル
- 開発環境: `debug`
- ステージング環境: `info`
- 本番環境: `error`

### エラー監視
- 本番環境では`NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true`を設定
- Sentryなどのエラー監視サービスとの連携を推奨
