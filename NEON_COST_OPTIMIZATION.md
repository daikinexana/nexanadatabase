# Neonデータベース コスト削減ガイド

このドキュメントでは、Neonデータベースのコストを削減するための最適化方法を説明します。

## 現在のコスト状況

画像の請求サマリーから：
- **Compute**: 108.54 compute hours - $11.51
- **Storage**: 0.03 GB-month - $0.01
- **Total**: $11.52

主なコストはCompute（計算時間）から発生しています。108.54時間ということは、ほぼ常時起動している状態です。

## コスト削減の対策

### 1. NeonのPooler URLを使用する（最重要）

Neonのpooler URLを使用することで、接続を効率的に管理し、Scale to zeroが正常に機能するようになります。

#### 現在のURL形式の確認

Neon Consoleで確認できる接続URLには2種類あります：

1. **Direct connection URL**（直接接続）
   ```
   postgresql://user:pass@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

2. **Pooler connection URL**（推奨・コスト削減に有効）
   ```
   postgresql://user:pass@ep-xxx-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require
   ```

#### 設定方法

1. [Neon Console](https://console.neon.tech/)にログイン
2. 左サイドバーからプロジェクトを選択
3. 左サイドバーの**「Branches」**をクリック
4. 使用したいブランチ（通常は`main`）を選択
5. ブランチの詳細ページで**「Connection Details」**セクションを探す
   - もし見つからない場合は、ページ上部のタブやセクションを確認してください
   - 「Connection string」や「Connect」などのボタンからもアクセスできる場合があります
6. **「Pooler」**または**「Connection pooling」**のタブを選択
7. **Connection string**をコピー（URLに`-pooler`が含まれていることを確認）
8. `.env.local`またはVercelの環境変数に設定

**注意**: Neon ConsoleのUIは更新される可能性があります。見つからない場合は：
- ページ上部の「Connect」ボタンをクリック
- または「Settings」→「Connection pooling」を確認

#### 簡単な方法：既存のURLを変換する

現在のDATABASE_URLが既にある場合、手動でPooler URLに変換できます：

1. **現在のDATABASE_URLを確認**
   - `.env.local`またはVercelの環境変数を確認
   - URLに`-pooler`が含まれているかチェック

2. **Pooler URLに変換（必要な場合）**
   - ホスト名の部分（`ep-xxx-xxx`）の後に`-pooler`を追加
   - 既に`-pooler`が含まれている場合は変更不要です

**変換例**:
- 変更前（Direct connection）: 
  ```
  postgresql://user:pass@ep-lucky-boat-a1trzglb.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
  ```
- 変更後（Pooler connection）: 
  ```
  postgresql://user:pass@ep-lucky-boat-a1trzglb-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
  ```

**確認方法**:
現在のURLに`-pooler`が含まれていれば、既にPooler URLを使用しています。含まれていない場合は、上記の方法で変換してください。

この方法で、Neon ConsoleにアクセスしなくてもPooler URLを作成・確認できます。

```env
# Pooler URLを使用（推奨）
DATABASE_URL="postgresql://user:pass@ep-xxx-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require"
```

**重要**: Pooler URLを使用することで：
- 接続が効率的に管理される
- Scale to zeroが正常に機能する（5分後に自動的にスケールダウン）
- 不要な接続が維持されない

### 2. Scale to Zeroの設定を確認

NeonのLaunchプランでは、**5分間アイドル状態が続くと自動的にスケールダウン（Scale to zero）**します。

#### 確認事項

1. Neon Consoleで**Settings** → **Compute**を確認
2. **Suspend compute after inactivity**が有効になっているか確認
3. デフォルトは5分ですが、必要に応じて調整可能

#### 最適化のポイント

- **不要な接続を維持しない**: アプリケーションが接続を適切に閉じているか確認
- **定期的なポーリングを避ける**: ヘルスチェックなどで定期的に接続しないようにする
- **接続プールを使用**: Prismaは自動的に接続プールを管理しますが、pooler URLを使用することでさらに最適化されます

### 3. Prisma接続プールの最適化

`lib/prisma.ts`で接続プールの設定を最適化しています。

#### 現在の設定

```typescript
// lib/prisma.ts
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
```

Prismaは自動的に接続プールを管理しますが、Neonのpooler URLを使用することで最適化されます。

### 4. クエリの最適化

#### キャッシュの活用

APIルートでキャッシュヘッダーを設定することで、データベースへのアクセスを削減できます。

```typescript
// 例: app/api/contests/route.ts
const response = NextResponse.json(contests);
response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
return response;
```

#### 不要なクエリの削減

- ページネーションを適切に使用
- `select`を使用して必要なフィールドのみ取得
- インデックスを活用したクエリ

### 5. 環境別の最適化

#### 開発環境

- ローカルPostgreSQLを使用（可能な場合）
- またはNeonの開発用データベースを使用

#### 本番環境

- Pooler URLを必ず使用
- キャッシュを最大限に活用
- 不要な接続を避ける

## 実装済みの最適化

### ✅ Prisma接続プールの最適化

`lib/prisma.ts`で接続プールの設定を最適化しました。

### ✅ キャッシュヘッダーの設定

主要なAPIルートでキャッシュヘッダーを設定しています：
- `app/api/contests/route.ts`
- `app/api/news/route.ts`
- `app/api/open-calls/route.ts`
- `app/api/workspace/route.ts`

## 次のステップ

### 1. Pooler URLの確認（最優先）

**既にPooler URLを使用している場合**（URLに`-pooler`が含まれている）:
- ✅ 設定は正しいです
- 次のステップに進んでください

**まだPooler URLを使用していない場合**:
1. 上記の方法でPooler URLに変換
2. `.env.local`とVercelの環境変数を更新
3. アプリケーションを再デプロイ

### 1-1. Vercelの環境変数を確認

Pooler URLが正しく設定されているか確認：

1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. プロジェクトを選択
3. **Settings** → **Environment Variables**を開く
4. `DATABASE_URL`を確認
5. URLに`-pooler`が含まれていることを確認

**重要**: 複数の環境（Production、Preview、Development）すべてでPooler URLが設定されていることを確認してください。

### 2. 接続状況の監視

Neon Consoleの**Metrics**タブで以下を確認：
- **Active connections**: 接続数が適切か
- **Compute hours**: 使用時間の推移
- **Scale to zero**: 正常にスケールダウンしているか

### 3. コストの推移を確認

- 毎日のCompute hoursを確認
- Scale to zeroが機能している場合、大幅な削減が期待できます

## 期待される効果

Pooler URLを使用し、Scale to zeroが正常に機能する場合：

- **Compute hours**: 108.54時間 → **大幅削減**（実際の使用時間のみ）
- **月額コスト**: $11.52 → **$2-5程度**（使用状況による）

## トラブルシューティング

### Scale to zeroが機能しない場合（Pooler URLを使用しているのにコストが高い場合）

既にPooler URLを使用しているのに、Compute時間が高い場合の対処法：

1. **Vercelの環境変数を再確認**
   - Vercel Dashboardで`DATABASE_URL`を確認
   - すべての環境（Production、Preview、Development）でPooler URLが設定されているか確認
   - 古いDirect connection URLが残っていないか確認

2. **Neon Consoleで接続状況を確認**
   - Neon Console → **Metrics**タブを開く
   - **Active connections**を確認
   - アイドル状態でも接続が維持され続けていないか確認
   - **Compute hours**のグラフで、スケールダウンが発生しているか確認

3. **Vercelのログを確認**
   - Vercel Dashboard → **Deployments** → 最新のデプロイメント → **Functions**タブ
   - データベース接続エラーやタイムアウトがないか確認
   - 長時間実行される関数がないか確認

4. **接続が適切に閉じられているか確認**
   - Prismaは自動的に接続を管理しますが、長時間実行される処理がないか確認
   - サーバーレス関数が接続を保持し続けていないか確認

5. **定期的なポーリングがないか確認**
   - ヘルスチェックやcronジョブで定期的に接続していないか確認
   - VercelのCron Jobs設定を確認（設定されている場合）

6. **NeonのSuspend設定を確認**
   - Neon Console → **Settings** → **Compute**
   - **Suspend compute after inactivity**が有効になっているか確認
   - デフォルトは5分ですが、必要に応じて調整可能

7. **一時的な対策：Suspend時間を短くする**
   - Neon Console → **Settings** → **Compute**
   - **Suspend compute after inactivity**を3分に短縮（デフォルトは5分）
   - これにより、より早くスケールダウンします

### 接続エラーが発生する場合

1. **Pooler URLの接続制限を確認**
   - Neonのプランによって接続数制限が異なります
   - Launchプラン: 最大100接続

2. **Prismaの接続プール設定を確認**
   - デフォルト設定で問題ない場合がほとんどです

## 参考リンク

- [Neon Documentation - Connection Pooling](https://neon.tech/docs/connect/connection-pooling)
- [Neon Documentation - Scale to Zero](https://neon.tech/docs/introduction/serverless-postgres)
- [Prisma Documentation - Connection Management](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
