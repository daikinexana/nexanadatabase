# Google検索エンジン公開ガイド

このプロジェクトをGoogle検索エンジンで公開するための手順です。

## ✅ 既に設定済みの項目

1. **robots.txt** - `/robots.txt`で設定済み
   - パブリックページはインデックス可能
   - `/admin`配下はインデックス不可

2. **sitemap.xml** - `/sitemap.xml`で自動生成
   - 主要ページが自動的に含まれます
   - 1時間ごとに更新

3. **メタデータ** - 各ページに適切なメタデータが設定済み
   - title, description, keywords
   - Open Graph
   - Twitter Card

4. **構造化データ** - JSON-LD形式で設定済み
   - WebSiteスキーマ
   - ItemListスキーマ

5. **Googlebot検出** - middleware.tsで設定済み
   - Googlebotのリクエストを適切に処理
   - SEO用ヘッダーを自動追加

## 📋 Google Search Consoleへの登録手順

### 1. Google Search Consoleにアクセス
https://search.google.com/search-console にアクセスし、Googleアカウントでログインします。

### 2. プロパティを追加
- 「プロパティを追加」をクリック
- 「URLプレフィックス」を選択
- サイトのURLを入力: `https://db.nexanahq.com`

### 3. 所有権の確認
以下のいずれかの方法で所有権を確認します：

#### 方法A: HTMLファイルをアップロード（推奨）
1. Google Search Consoleで「HTMLファイル」を選択
2. 提供されたHTMLファイルをダウンロード
3. そのファイルを `/public/google-site-verification.html` に配置
4. デプロイ後、Google Search Consoleで「確認」をクリック

#### 方法B: HTMLタグを使用（現在の設定）
1. Google Search Consoleで「HTMLタグ」を選択
2. 提供されたメタタグから検証コードを取得
   - 例: `<meta name="google-site-verification" content="abc123..." />`
3. 環境変数に設定:
   ```bash
   GOOGLE_VERIFICATION_CODE=abc123...
   ```
4. デプロイ後、Google Search Consoleで「確認」をクリック

#### 方法C: DNSレコードを使用
1. Google Search Consoleで「DNSレコード」を選択
2. 提供されたTXTレコードをDNSに追加
3. DNS設定が反映されたら、Google Search Consoleで「確認」をクリック

### 4. サイトマップの送信
1. Google Search Consoleの左メニューから「サイトマップ」を選択
2. 「新しいサイトマップを追加」をクリック
3. サイトマップのURLを入力: `https://db.nexanahq.com/sitemap.xml`
4. 「送信」をクリック

### 5. インデックス登録のリクエスト（オプション）
主要なページを手動でインデックス登録リクエストできます：
1. Google Search Consoleの左メニューから「URL検査」を選択
2. インデックス登録したいURLを入力
3. 「インデックス登録をリクエスト」をクリック

## 🔧 環境変数の設定

### Vercelにデプロイしている場合

Vercelのダッシュボードで環境変数を設定します：

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com/dashboard にアクセス
   - プロジェクトを選択

2. **環境変数の設定**
   - プロジェクトの「Settings」タブを開く
   - 左メニューから「Environment Variables」を選択
   - 以下の環境変数を追加：

   | 名前 | 値 | 環境 |
   |------|-----|------|
   | `GOOGLE_VERIFICATION_CODE` | Google Search Consoleで取得した検証コード | Production, Preview, Development |
   | `NEXT_PUBLIC_BASE_URL` | `https://db.nexanahq.com` | Production |
   | `NODE_ENV` | `production` | Production（通常は自動設定） |
   | `NEXT_PUBLIC_ENVIRONMENT` | `production` | Production |

3. **環境変数の追加手順**
   - 「Add New」ボタンをクリック
   - 「Name」に環境変数名を入力（例: `GOOGLE_VERIFICATION_CODE`）
   - 「Value」に値を入力（例: Google検証コード）
   - 適用する環境を選択（Production, Preview, Development）
   - 「Save」をクリック

4. **再デプロイ**
   - 環境変数を追加・変更した後は、再デプロイが必要です
   - 「Deployments」タブから最新のデプロイメントを選択
   - 「Redeploy」をクリック
   - または、GitHubにプッシュすると自動的に再デプロイされます

### その他のデプロイ環境の場合

環境変数を設定する方法は、使用しているホスティングサービスによって異なります：

```bash
# Google Search Console検証コード
GOOGLE_VERIFICATION_CODE=your_verification_code_here

# 本番環境のURL
NEXT_PUBLIC_BASE_URL=https://db.nexanahq.com

# 本番環境の設定
NODE_ENV=production
NEXT_PUBLIC_ENVIRONMENT=production
```

## 📊 インデックス状況の確認

Google Search Consoleで以下を確認できます：
- **カバレッジ**: インデックス登録されたページ数
- **パフォーマンス**: 検索結果での表示回数・クリック数
- **サイトマップ**: 送信したサイトマップの状態
- **モバイルユーザビリティ**: モバイル表示の問題

## ⚠️ 注意事項

1. **インデックス登録には時間がかかります**
   - 通常、数日から数週間かかります
   - サイトマップ送信後、Googleがクロールするまで待つ必要があります

2. **robots.txtの確認**
   - `/robots.txt`にアクセスして、正しく設定されているか確認してください
   - パブリックページが`allow`されていることを確認

3. **サイトマップの確認**
   - `/sitemap.xml`にアクセスして、正しく生成されているか確認してください
   - すべての主要ページが含まれていることを確認

4. **メタデータの確認**
   - 各ページの`<title>`と`<meta name="description">`が適切に設定されているか確認
   - 構造化データが正しく出力されているか確認（ブラウザの開発者ツールで確認可能）

5. **パフォーマンスの最適化**
   - ページの読み込み速度を最適化
   - モバイルフレンドリーなデザインを維持
   - Core Web Vitalsのスコアを改善

## 🚀 デプロイ後の確認事項

1. ✅ `https://db.nexanahq.com/robots.txt` が正しく表示される
2. ✅ `https://db.nexanahq.com/sitemap.xml` が正しく表示される
3. ✅ 各ページのメタデータが正しく設定されている
4. ✅ Google Search Consoleで所有権が確認できる
5. ✅ サイトマップが正常に処理される

## 📚 参考リンク

- [Google Search Console ヘルプ](https://support.google.com/webmasters)
- [Google検索セントラル](https://developers.google.com/search)
- [構造化データ テストツール](https://search.google.com/test/rich-results)

