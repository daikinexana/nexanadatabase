#!/bin/bash

echo "🔧 Clerk設定の診断スクリプト"
echo "================================"

# 環境変数の確認
echo "📋 環境変数の確認:"
if [ -f ".env.local" ]; then
    echo "✅ .env.local ファイルが存在します"
    
    # Clerk関連の環境変数をチェック
    if grep -q "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" .env.local; then
        echo "✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY が設定されています"
    else
        echo "❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY が設定されていません"
    fi
    
    if grep -q "CLERK_SECRET_KEY" .env.local; then
        echo "✅ CLERK_SECRET_KEY が設定されています"
    else
        echo "❌ CLERK_SECRET_KEY が設定されていません"
    fi
else
    echo "❌ .env.local ファイルが存在しません"
    echo "💡 以下のコマンドで作成してください:"
    echo "   cp env.local.example .env.local"
fi

echo ""
echo "🌐 ネットワーク接続の確認:"
if curl -s --connect-timeout 5 https://clerk.com > /dev/null; then
    echo "✅ clerk.com に接続可能"
else
    echo "❌ clerk.com に接続できません"
fi

if curl -s --connect-timeout 5 https://clerk.dev > /dev/null; then
    echo "✅ clerk.dev に接続可能"
else
    echo "❌ clerk.dev に接続できません"
fi

echo ""
echo "📦 パッケージの確認:"
if npm list @clerk/nextjs > /dev/null 2>&1; then
    echo "✅ @clerk/nextjs がインストールされています"
    npm list @clerk/nextjs | grep @clerk/nextjs
else
    echo "❌ @clerk/nextjs がインストールされていません"
fi

echo ""
echo "🚀 次のステップ:"
echo "1. 開発サーバーを再起動してください: npm run dev"
echo "2. ブラウザのキャッシュをクリアしてください"
echo "3. 開発者ツールのコンソールでエラーを確認してください"
echo "4. まだ問題がある場合は、Clerkダッシュボードでドメイン設定を確認してください"
