# デプロイチェックリスト

## ✅ ビルド確認済み
- `npm run build` が正常に完了
- エラーなし
- 35ページが正常に生成

## 📝 次のステップ

### 1. 変更をコミット
```bash
git add .
git commit -m "SEO改善: メタデータ拡充、構造化データ追加、hreflang対応

- ルートレイアウトと各ページのキーワードを大幅に拡充
- ターゲット1-4向けのキーワードを網羅的に追加
- FAQPage、BreadcrumbList、CollectionPage、NewsArticleスキーマを追加
- hreflangタグを追加（日本語・英語対応）
- Open GraphとTwitterカードを最適化
- サイトマップのコメントを拡充"
```

### 2. GitHubにプッシュ
```bash
git push origin main
```

### 3. デプロイの確認
- VercelまたはGitHub Actionsで自動デプロイが開始されます
- デプロイが完了するまで数分待ちます

### 4. デプロイ後の確認

#### ✅ メタデータの確認
1. ブラウザの開発者ツールで各ページの`<head>`を確認
2. メタタグが正しく表示されているか確認
3. 構造化データ（JSON-LD）が正しく出力されているか確認

#### ✅ 構造化データの検証
- [Google リッチリザルトテスト](https://search.google.com/test/rich-results)で各ページをテスト
- エラーがないことを確認

#### ✅ サイトマップの確認
- `https://db.nexanahq.com/sitemap.xml` にアクセス
- 正しく生成されているか確認

### 5. Google Search Consoleでの作業

#### ✅ サイトマップの送信（未実施の場合）
1. Google Search Consoleにアクセス
2. 「サイトマップ」セクションに移動
3. `https://db.nexanahq.com/sitemap.xml` を追加
4. 「送信」をクリック

#### ✅ 主要ページのインデックス登録リクエスト
以下の主要ページでインデックス登録をリクエスト：
- `https://db.nexanahq.com/`
- `https://db.nexanahq.com/contests`
- `https://db.nexanahq.com/open-calls`
- `https://db.nexanahq.com/workspace`
- `https://db.nexanahq.com/news`

**手順：**
1. Google Search Consoleの「URL検査」ツールを使用
2. 各URLを入力
3. 「インデックス登録をリクエスト」をクリック

## 📊 変更されたファイル

### メタデータ・SEO関連
- `app/layout.tsx` - ルートレイアウトのメタデータ拡充、構造化データ追加
- `app/contests/page.tsx` - コンテストページのメタデータ最適化、構造化データ追加
- `app/open-calls/page.tsx` - 公募ページのメタデータ最適化、構造化データ追加
- `app/workspace/page.tsx` - ワークスペースページのメタデータ最適化、構造化データ追加
- `app/news/page.tsx` - ニュースページのメタデータ最適化、構造化データ追加
- `app/sitemap.ts` - サイトマップのコメント拡充

### その他
- `SEO_NEXT_ACTIONS.md` - 次のアクションガイド（新規）
- `components/ui/workspace-list-client.tsx` - ワークスペースリストコンポーネント（新規）

## ⚠️ 注意事項

1. **デプロイ前に確認**
   - ローカルで `npm run dev` を実行して動作確認
   - 各ページが正常に表示されることを確認

2. **デプロイ後の確認**
   - 本番環境で各ページが正常に表示されることを確認
   - メタデータが正しく出力されていることを確認
   - 構造化データのエラーがないことを確認

3. **インデックス登録**
   - インデックス登録には数日かかる場合があります
   - 定期的にGoogle Search Consoleで状況を確認してください

