# Nexana Database

スタートアップ向けの包括的な情報キュレーションサイトです。コンテスト、展示会、公募、ニュース、ナレッジベースを一箇所で提供し、エリアや主催者タイプでフィルタリングできる機能を備えています。

## 機能

### メイン機能
- **コンテスト情報**: スタートアップコンテスト、ハッカソン、ピッチコンテストなどの情報
- **展示会・イベント**: スタートアップ関連の展示会、カンファレンス、イベント情報
- **公募・助成金**: 補助金、助成金、パートナーシップ募集などの公募情報
- **ニュース**: スタートアップの調達情報、M&A情報、IPO情報
- **ナレッジベース**: AI、ディープテックなどの最新技術情報とトレンド

### フィルタリング機能
- **エリア**: 国・都道府県での絞り込み
- **主催者タイプ**: 行政、VC、CVC、銀行、不動産、その他企業、研究機関など
- **カテゴリ**: 各コンテンツタイプに応じたカテゴリ分類
- **タグ**: 詳細なタグによる検索

### 管理者機能
- **認証**: Clerkによる管理者認証
- **投稿・編集・削除**: 各コンテンツの管理機能
- **画像アップロード**: AWS S3を使用した画像管理

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

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET_NAME=nexana-database-images

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
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
│   ├── grants/            # 公募ページ
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
