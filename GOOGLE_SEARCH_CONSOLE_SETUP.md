# Google Search Console 登録手順書

## 問題の原因と解決策

### 発見された問題
1. **サブドメイン間の競合**: `db.nexanahq.com`、`nexanahq.com`、`hp.nexanahq.com`の複数プロパティが競合
2. **リダイレクトエラー**: Clerk認証ミドルウェアがGooglebotのクロールを妨げていた
3. **robots.txtの設定不備**: サブドメイン専用の設定が不十分
4. **サイトマップの設定問題**: 環境変数による動的URL設定が不安定

### 実施した修正
1. **サブドメイン専用設定の最適化**
   - robots.tsからhost設定を削除
   - サイトマップをサブドメイン専用に固定
   - メタデータのcanonical URLを明示的に設定

2. **Googlebot対応の強化（重要）**
   - **middleware.tsを完全に書き換え**: Googlebotの場合はClerkのミドルウェアを完全にスキップ
   - Googlebot検出時にClerkProviderを使わずに直接レンダリング（layout.tsx）
   - パブリックルートは常にアクセス可能
   - adminページは403を返して保護（リダイレクトしない）

3. **Adminページのセキュリティ強化とパフォーマンス最適化**
   - 環境変数 `NEXT_PUBLIC_ADMIN_PATH` でadminページのパスをカスタマイズ可能
   - デフォルトの `/admin` から変更することで、URLを隠すことが可能
   - robots.txtとnext.config.tsも自動的に更新される
   - **本番環境ではadminページへのアクセスを完全にブロック（404を返す）**
   - **本番環境ではClerk認証とmiddlewareのオーバーヘッドを完全に削除**
     - middlewareはGooglebot対応のみ（最小限の処理）
     - ClerkProviderは本番環境では使用されない（パフォーマンス向上）
   - ローカル開発環境でのみClerk認証を使用

4. **HTTPS設定の強化**
   - Strict-Transport-Securityヘッダーを追加
   - Content-Security-Policyを設定

5. **検証ファイルの追加**
   - Google Search Console用の検証HTMLファイルを作成

## Google Search Console 登録手順

### 1. プロパティの追加
1. Google Search Consoleにアクセス
2. 「プロパティを追加」をクリック
3. 「URLプレフィックス」を選択
4. `https://db.nexanahq.com` を入力

### 2. 所有権の確認
以下のいずれかの方法で所有権を確認：

#### 方法A: HTMLファイルによる確認
1. Google Search Consoleで提供される検証コードを取得
2. `public/google-site-verification.html` ファイルの内容を更新
3. ファイルをアップロードして確認

#### 方法B: HTMLタグによる確認
1. Google Search Consoleで提供されるmetaタグを取得
2. `app/layout.tsx` の `GOOGLE_VERIFICATION_CODE` を更新
3. 環境変数 `GOOGLE_VERIFICATION_CODE` を設定

### 3. サイトマップの送信
1. Google Search Consoleの「サイトマップ」セクションに移動
2. `https://db.nexanahq.com/sitemap.xml` を追加
3. 「送信」をクリック

### 4. robots.txtの確認
1. 「robots.txtテスター」を使用
2. `https://db.nexanahq.com/robots.txt` をテスト
3. エラーがないことを確認

### 5. URL検査の実行
1. 「URL検査」ツールを使用
2. `https://db.nexanahq.com/` を検査
3. 「ライブテスト」を実行してリダイレクトエラーが解消されていることを確認

## 環境変数の設定

`.env.local` ファイルに以下を追加：

```env
# Google Search Console検証コード
GOOGLE_VERIFICATION_CODE=your-google-verification-code-here

# ベースURL（サブドメイン専用）
NEXT_PUBLIC_BASE_URL=https://db.nexanahq.com

# Adminページのパス（セキュリティのため、デフォルトの/adminから変更することを推奨）
# 例: NEXT_PUBLIC_ADMIN_PATH=/secure-admin-panel-2024
# 注意: この値を変更した場合、middleware.ts、robots.ts、next.config.tsも自動的に更新されます
# NEXT_PUBLIC_ADMIN_PATH=/admin

# Adminページのアクセス制御（重要）
# 本番環境ではadminページへのアクセスが自動的にブロックされます（404を返す）
# ローカル開発環境（NODE_ENV=development）では常にアクセス可能
# 本番環境でもadminページにアクセスしたい場合は、以下の環境変数を設定:
# ALLOW_ADMIN_IN_PRODUCTION=true
# 注意: セキュリティ上の理由から、本番環境でのadminページアクセスは非推奨です
```

## デプロイ後の確認事項

1. **サイトのアクセシビリティ確認**
   - `https://db.nexanahq.com/` が正常にアクセスできること
   - `https://db.nexanahq.com/robots.txt` が表示されること
   - `https://db.nexanahq.com/sitemap.xml` が表示されること

2. **Googlebotテスト**
   - `https://db.nexanahq.com/api/test-crawl` にアクセス
   - Googlebotとして認識されることを確認

3. **リダイレクトエラーの解消**
   - Google Search ConsoleのURL検査でエラーが表示されないこと

## トラブルシューティング

### リダイレクトエラーが続く場合
1. **middleware.tsの確認**: Googlebot検出時にClerkを完全にスキップしているか確認
2. **layout.tsxの確認**: Googlebotの場合はClerkProviderを使わずにレンダリングしているか確認
3. **Clerk認証の設定を確認**: パブリックルートが正しく設定されているか確認
4. **デプロイ環境での環境変数を確認**: 特に `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` が設定されているか確認

### Googlebotが認識されない場合
1. **User-Agentの確認**: middleware.tsの `isGooglebot` 関数で正しく検出されているか確認
2. **Google Search Consoleのライブテスト**: URL検査ツールで「ライブテスト」を実行して確認
3. **ログの確認**: サーバーログでGooglebotのリクエストが正しく処理されているか確認

### サイトマップが認識されない場合
1. サイトマップのURLが正しいことを確認
2. サイトマップのXML形式が正しいことを確認
3. キャッシュをクリアして再送信

### 所有権確認が失敗する場合
1. 検証ファイルが正しい場所に配置されていることを確認
2. 環境変数が正しく設定されていることを確認
3. デプロイが完了していることを確認

## 注意事項

- サブドメイン間の競合を避けるため、各サブドメインは独立したプロパティとして管理
- 変更後は必ずデプロイを実行
- Google Search Consoleの反映には24-48時間かかる場合がある
- 定期的にURL検査を実行して問題がないことを確認
