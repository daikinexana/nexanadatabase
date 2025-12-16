# Nexana Database

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/daikinexana/nexanadatabase)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)

スタートアップ向けの包括的な情報キュレーションサイトです。コンテスト、展示会、公募、ニュース、ナレッジベースを一箇所で提供し、エリアや主催者タイプでフィルタリングできる機能を備えています。

## 機能

### メイン機能
- **コンテスト情報**: スタートアップコンテスト、ハッカソン、ピッチコンテストなどの情報
- **展示会・イベント**: スタートアップ関連の展示会、カンファレンス、イベント情報
- **公募**: パートナーシップ募集などの公募情報
- **ニュース**: スタートアップの調達情報、M&A情報、IPO情報
- **ナレッジベース**: AI、ディープテックなどの最新技術情報とトレンド

### フィルタリング機能
- **エリア**: 国・都道府県での絞り込み
- **主催者タイプ**: 行政、VC、CVC、銀行、不動産、その他企業、研究機関など
- **カテゴリ**: 各コンテンツタイプに応じたカテゴリ分類
- **タグ**: 詳細なタグによる検索

### 管理者機能
- **投稿・編集・削除**: 各コンテンツの管理機能
- **画像アップロード**: AWS S3を使用した画像管理
- **セキュリティ**: AdminページのURLを環境変数でカスタマイズ可能（デフォルト: `/admin`）
- **アクセス制御**: **本番環境ではadminページへのアクセスが自動的にブロックされます（404を返す）**
  - ローカル開発環境（`NODE_ENV=development`）では常にアクセス可能（認証不要）
  - 本番環境でもアクセスしたい場合は `ALLOW_ADMIN_IN_PRODUCTION=true` を設定（非推奨）
- **認証**: **Clerk認証を完全に削除** - ローカル開発環境でも認証不要でシンプルに運用

### SEO・検索エンジン対応
- **Google Search Console対応**: Googlebotの検出とClerk認証の自動スキップ
- **robots.txt**: 検索エンジン向けのクロール設定
- **sitemap.xml**: 動的サイトマップ生成
- **構造化データ**: JSON-LD形式の構造化データ対応

## 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript
- **スタイリング**: Tailwind CSS
- **認証**: Clerk
- **データベース**: PostgreSQL (Neon)
- **ORM**: Prisma
- **画像ストレージ**: AWS S3
- **デプロイ**: Vercel

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example`を参考に`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/nexanadatabase"

# Clerk Authentication (削除済み)
# Clerk認証は完全に削除されました。ローカル開発環境でも認証不要です。
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
# CLERK_SECRET_KEY=your_clerk_secret_key

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET_NAME=nexana-database-images

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Search Console (オプション)
GOOGLE_VERIFICATION_CODE=your_google_verification_code

# Adminページのパス（セキュリティのため、デフォルトの/adminから変更することを推奨）
# 例: NEXT_PUBLIC_ADMIN_PATH=/secure-admin-panel-2024
# NEXT_PUBLIC_ADMIN_PATH=/admin
```

### 3. データベースのセットアップ

```bash
# Prismaクライアントの生成
npx prisma generate

# データベースマイグレーション
npx prisma migrate dev

# データベースのシード（オプション）
npx prisma db seed
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリケーションにアクセスできます。

## プロジェクト構造

```
├── app/                    # Next.js App Router
│   ├── admin/             # 管理者ページ
│   ├── api/               # API ルート
│   ├── contests/          # コンテストページ
│   ├── events/            # 展示会ページ
│   ├── open-calls/        # 公募ページ
│   ├── news/              # ニュースページ
│   ├── knowledge/         # ナレッジベースページ
│   └── globals.css        # グローバルスタイル
├── components/            # 再利用可能なコンポーネント
│   └── ui/               # UIコンポーネント
├── lib/                  # ユーティリティ関数
│   ├── auth.ts           # 認証関連
│   ├── prisma.ts         # Prismaクライアント
│   ├── s3.ts             # AWS S3関連
│   └── constants.ts      # 定数定義
├── prisma/               # データベーススキーマ
│   └── schema.prisma     # Prismaスキーマ
└── public/               # 静的ファイル
```

## GitHub連携

### リポジトリ
- **GitHub**: [https://github.com/daikinexana/nexanadatabase](https://github.com/daikinexana/nexanadatabase)
- **ブランチ**: `main` (本番), `develop` (開発)

### CI/CD
- **GitHub Actions**: 自動テスト、ビルド、デプロイ
- **ワークフロー**: `.github/workflows/ci.yml`
- **テスト**: ESLint、TypeScript型チェック、ビルドテスト

### セキュリティ
GitHubリポジトリのSecretsに以下の環境変数を設定してください：

```
DATABASE_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
WEBHOOK_SECRET
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_S3_BUCKET
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

## Google検索エンジン対応

### 重要な設定

このプロジェクトは、Google検索エンジンがサイトをクロールできるように特別な設定が施されています：

1. **Googlebot検出**: middleware.tsでGooglebotを検出し、Clerk認証を完全にスキップ
2. **パブリックページ**: 常にアクセス可能（認証不要）
3. **Adminページ保護**: Googlebotには403を返し、通常ユーザーは認証が必要

詳細は [GOOGLE_SEARCH_CONSOLE_SETUP.md](./GOOGLE_SEARCH_CONSOLE_SETUP.md) を参照してください。

### Adminページのセキュリティ

#### 1. URLのカスタマイズ

デフォルトの `/admin` パスを変更することで、adminページのURLを隠すことができます：

```env
# 環境変数でカスタムパスを設定
NEXT_PUBLIC_ADMIN_PATH=/secure-admin-panel-2024
```

この設定により、middleware.ts、robots.txt、next.config.tsが自動的に更新されます。

#### 2. 本番環境でのアクセス制御（推奨）

**本番環境では、adminページへのアクセスが自動的にブロックされます（404を返す）**。これにより、セキュリティが大幅に向上します。

**Clerk認証とmiddlewareを完全に削除**：

- **ローカル開発環境**: `NODE_ENV=development` では常にアクセス可能、**認証不要**
- **本番環境**: 
  - Adminページへのアクセスは自動的に404を返してブロック
  - **Clerk認証は完全に削除**（パフォーマンス向上、バンドルサイズ削減）
  - middlewareはGooglebot対応のみ（最小限の処理）
- **本番環境でもアクセスしたい場合**: `ALLOW_ADMIN_IN_PRODUCTION=true` を設定（セキュリティ上の理由から非推奨）

**推奨される運用方法**:
- 本番環境ではadminページへのアクセスをブロック
- ローカル開発環境でコンテンツを編集・管理（認証不要でシンプル）
- 変更をコミットしてデプロイ
- **Clerk認証のオーバーヘッドが完全にないため、パフォーマンスが大幅に向上**

## デプロイ

### Vercelでのデプロイ

1. GitHubリポジトリにプッシュ
2. Vercelでプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

### 環境変数の設定（本番）

本番環境では以下の環境変数を設定してください：

- `DATABASE_URL`: Neonデータベースの接続URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerkの公開キー
- `CLERK_SECRET_KEY`: Clerkのシークレットキー
- `AWS_ACCESS_KEY_ID`: AWSアクセスキー
- `AWS_SECRET_ACCESS_KEY`: AWSシークレットキー
- `AWS_REGION`: AWSリージョン
- `AWS_S3_BUCKET_NAME`: S3バケット名
- `NEXT_PUBLIC_APP_URL`: 本番URL

## ライセンス

このプロジェクトはNexana HQによって運営されています。

## お問い合わせ

- 運営会社: [Nexana HQ](https://hp.nexanahq.com/)
- お問い合わせ: [お問い合わせフォーム](/contact)
