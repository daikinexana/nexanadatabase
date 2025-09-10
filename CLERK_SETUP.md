# Clerk設定ガイド

## 自動ユーザー同期の設定

Clerkで新規ログインしたユーザーを自動的にデータベースの`users`テーブルに反映するための設定手順です。

### 1. Clerkダッシュボードでの設定

1. [Clerkダッシュボード](https://dashboard.clerk.com)にログイン
2. プロジェクトを選択
3. 左サイドバーの「Webhooks」をクリック
4. 「Add Endpoint」をクリック
5. 以下の設定を入力：
   - **Endpoint URL**: `https://yourdomain.com/api/webhooks/clerk`
   - **Events**: 以下のイベントを選択
     - `user.created`
     - `user.updated`
     - `user.deleted`
6. 「Create」をクリック
7. **Signing Secret**をコピー

### 2. 環境変数の設定

`.env.local`ファイルに以下の環境変数を追加：

```bash
CLERK_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here
```

**重要**: `whsec_your_webhook_secret_here`はプレースホルダーです。Clerkダッシュボードから取得した実際の値に置き換えてください。

### 3. 動作確認

設定完了後、以下の動作が自動的に行われます：

#### 新規ユーザー登録時
- Clerkでユーザーが作成される
- Webhookが発火してデータベースにユーザーが自動作成される
- デフォルトで`ADMIN`権限が付与される

#### 既存ユーザーログイン時
- データベースにユーザーが存在しない場合、自動的に作成される
- 既に存在する場合は、そのままログインが完了する

#### ユーザー情報更新時
- Clerkでユーザー情報が更新される
- Webhookが発火してデータベースの情報も自動更新される

### 4. フォールバック機能

Webhookが設定されていない場合や、何らかの理由でwebhookが失敗した場合でも、以下のフォールバック機能が動作します：

- ユーザーが初回ログイン時に`getCurrentUser()`が呼ばれる
- データベースにユーザーが存在しない場合、自動的に作成される
- これにより、webhookがなくてもユーザーは正常にログインできる

### 5. トラブルシューティング

#### ユーザーが作成されない場合
1. `.env.local`の`CLERK_WEBHOOK_SECRET`が正しく設定されているか確認
2. Clerkダッシュボードでwebhookの設定が正しいか確認
3. 開発サーバーのコンソールログでエラーメッセージを確認

#### ログの確認
開発サーバーのコンソールで以下のログが表示されます：
- `User created via webhook: email@example.com`
- `User created automatically: email@example.com`
- `User updated via webhook: email@example.com`

### 6. 本番環境での注意点

本番環境では、以下の点に注意してください：

1. **HTTPS必須**: WebhookエンドポイントはHTTPSでアクセス可能である必要があります
2. **ドメイン設定**: `https://yourdomain.com/api/webhooks/clerk`の`yourdomain.com`を実際のドメインに置き換えてください
3. **環境変数**: 本番環境の`.env.production`にも`CLERK_WEBHOOK_SECRET`を設定してください
