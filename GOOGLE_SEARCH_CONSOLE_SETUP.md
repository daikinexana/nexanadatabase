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

#### ⚠️ 所有権確認済みの場合
**所有権が既に確認済みの場合は、`GOOGLE_VERIFICATION_CODE`の設定は不要です。**
- 現状の設定（未設定時はメタタグを出さない）で問題ありません
- 将来的に再確認が必要になった場合のみ、上記の方法で検証コードを設定してください
- 所有権確認済みでも、メタタグ方式を使いたい場合は環境変数を設定できます（任意）

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

### 6. インデックス登録リクエスト後の手順
インデックス登録リクエストを送信した後、以下の手順で公開を促進します：

#### ✅ 即座に実施すべきこと
1. **サイトマップの送信確認**
   - 「サイトマップ」セクションで `https://db.nexanahq.com/sitemap.xml` が送信済みか確認
   - 未送信の場合は送信（これにより全ページのクロールが促進されます）

2. **主要ページのインデックス登録リクエスト**
   - トップページ以外にも、以下の主要ページでインデックス登録をリクエスト：
     - `https://db.nexanahq.com/contests`
     - `https://db.nexanahq.com/open-calls`
     - `https://db.nexanahq.com/location`
     - `https://db.nexanahq.com/news`

#### ⏰ インデックス登録までの待機期間
- **通常**: 数時間〜数日（24-48時間が一般的）
- **初回サイト**: 1週間〜2週間かかる場合もあります
- **更新頻度**: サイトマップに基づいてGoogleが自動的にクロールします

#### 📊 インデックス状況の確認方法
1. **URL検査ツール**
   - 各URLで「インデックス登録をリクエスト」を実行
   - 「ページをインデックスに登録可能です」と表示されていれば問題なし

2. **インデックス作成 > ページ**
   - Google Search Consoleの「インデックス作成 > ページ」セクションで確認
   - 「有効」ページ数が増えているか確認

3. **検索結果での確認**
   - Googleで `site:db.nexanahq.com` と検索
   - インデックスされたページが表示されます

#### 🚀 インデックス登録を促進する方法
1. **内部リンクの充実**
   - トップページから各セクションへのリンクが適切に配置されているか確認
   - サイトマップに含まれるすべてのページが内部リンクで接続されているか確認

2. **定期的なコンテンツ更新**
   - 新しいコンテスト、公募、ニュースを定期的に追加
   - 更新頻度が高いほど、Googleのクロール頻度も上がります

3. **ソーシャルシェア**
   - SNSでサイトをシェア（直接的なSEO効果はないが、トラフィック増加で間接的に効果あり）

4. **外部リンクの獲得**
   - 関連サイトからのリンク獲得（時間をかけて自然に増やす）

#### ⚠️ 注意事項
- **過度なリクエストは避ける**: 同じURLを短時間に何度もリクエストしない
- **品質の維持**: コンテンツの品質を維持し、スパムと判断されないようにする
- **robots.txtの確認**: インデックスしたいページがrobots.txtでブロックされていないか確認

## 環境変数の設定

`.env.local` ファイルに以下を追加：

```env
# Google Search Console検証コード（所有権確認済みの場合は不要）
# 所有権確認済みでもメタタグ方式を使いたい場合のみ設定してください
# GOOGLE_VERIFICATION_CODE=your-google-verification-code-here

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

## 本番環境の設定

### 所有権確認済みの場合
**所有権が既に確認済みの場合は、本番環境での追加設定は不要です。**
- `GOOGLE_VERIFICATION_CODE`は設定しなくて問題ありません
- 現状の設定（未設定時はメタタグを出さない）で正常に動作します

### メタタグ方式を使いたい場合（任意）
所有権確認済みでも、メタタグ方式を使いたい場合は以下を設定：

1. **Vercelの場合**
   - Vercelダッシュボード → Settings → Environment Variables
   - `GOOGLE_VERIFICATION_CODE` を追加（Production環境）
   - 再デプロイを実行

2. **その他のホスティングの場合**
   - 各ホスティングサービスの環境変数設定画面で `GOOGLE_VERIFICATION_CODE` を設定
   - 再デプロイを実行

## デプロイ後の確認事項

1. **サイトのアクセシビリティ確認**
   - `https://db.nexanahq.com/` が正常にアクセスできること
   - `https://db.nexanahq.com/robots.txt` が表示されること
   - `https://db.nexanahq.com/sitemap.xml` が表示されること

2. **Googlebotテスト**
   - ⚠️ **注意**: 通常のブラウザから `https://db.nexanahq.com/api/test-crawl` にアクセスすると、エラーメッセージが表示されます。これは正常な動作です。
   - このエンドポイントはGooglebot専用のテスト用です
   - Googlebotとして正しく認識されるかは、Google Search Consoleの「URL検査」ツールの「ライブテスト」機能で確認できます
   - または、User-Agentを変更してGooglebotとしてテストすることも可能です（開発者ツールなど）

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
