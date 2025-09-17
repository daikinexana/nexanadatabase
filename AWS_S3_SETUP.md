# AWS S3 設定手順

## 1. AWS アカウントの準備

1. [AWS コンソール](https://aws.amazon.com/console/)にログイン
2. 新しいアカウントの場合は、クレジットカード情報の登録が必要

## 2. IAM ユーザーの作成

1. AWS コンソールで「IAM」サービスに移動
2. 「ユーザー」→「ユーザーを追加」をクリック
3. ユーザー名: `nexana-s3-uploader`
4. 「プログラムによるアクセス」にチェック
5. 「既存のポリシーを直接アタッチ」を選択
6. 以下のポリシーを検索して選択:
   - `AmazonS3FullAccess` (または `AmazonS3ReadWriteAccess`)
7. ユーザーを作成

## 3. アクセスキーの取得

1. 作成したユーザーをクリック
2. 「セキュリティ認証情報」タブをクリック
3. 「アクセスキーを作成」をクリック
4. 「アプリケーション外部」を選択
5. アクセスキーIDとシークレットアクセスキーをコピー（**重要**: この画面を閉じると再表示されません）

## 4. S3 バケットの作成

1. AWS コンソールで「S3」サービスに移動
2. 「バケットを作成」をクリック
3. バケット名: `nexana-database-images-dev` (または任意の名前)
4. リージョン: `アジアパシフィック (東京) ap-northeast-1`
5. パブリックアクセス設定:
   - 「パブリックアクセスをすべてブロック」のチェックを外す
   - 「新しいパブリック ACL とパブリックオブジェクトのアップロードをブロック」のチェックを外す
6. バケットを作成

## 5. バケットポリシーの設定

1. 作成したバケットをクリック
2. 「アクセス許可」タブをクリック
3. 「バケットポリシー」をクリック
4. 以下のポリシーを貼り付け（`YOUR_BUCKET_NAME`を実際のバケット名に置き換え）:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```

## 6. 環境変数の設定

`.env.local`ファイルを編集して、以下の値を設定:

```env
# AWS S3 設定
AWS_ACCESS_KEY_ID=あなたのアクセスキーID
AWS_SECRET_ACCESS_KEY=あなたのシークレットアクセスキー
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET_NAME=nexana-database-images-dev
```

## 7. 動作確認

1. 開発サーバーを再起動: `npm run dev`
2. `http://localhost:3000/admin/facilities`にアクセス
3. 新しい施設を追加して画像アップロードをテスト

## トラブルシューティング

### よくあるエラー

1. **InvalidAccessKeyId**: アクセスキーIDが間違っています
2. **SignatureDoesNotMatch**: シークレットアクセスキーが間違っています
3. **NoSuchBucket**: バケット名が間違っています
4. **AccessDenied**: IAMポリシーまたはバケットポリシーが正しく設定されていません

### セキュリティ注意事項

- アクセスキーは絶対に公開しないでください
- `.env.local`ファイルは`.gitignore`に含まれています
- 本番環境では、より制限的なIAMポリシーを使用することを推奨します
