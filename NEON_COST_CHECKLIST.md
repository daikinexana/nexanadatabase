# Neonコスト削減 チェックリスト

このチェックリストに従って、順番に確認・対応してください。

## ✅ 完了済み

- [x] Pooler URLの確認（既に正しく設定されています）
- [x] コスト削減ガイドドキュメントの作成

## 📋 今すぐ確認すべきこと（優先順位順）

### 1. Vercelの環境変数を確認（最優先・5分）

**目的**: 本番環境でPooler URLが正しく設定されているか確認

**手順**:
1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. プロジェクトを選択
3. **Settings** → **Environment Variables**を開く
4. `DATABASE_URL`を確認
5. 以下の点をチェック：
   - [ ] URLに`-pooler`が含まれているか
   - [ ] Production環境で設定されているか
   - [ ] Preview環境で設定されているか（あれば）
   - [ ] Development環境で設定されているか（あれば）

**もしPooler URLでない場合**:
- 上記のURL（`postgresql://neondb_owner:...@ep-lucky-boat-a1trzglb-pooler...`）に更新
- すべての環境で更新
- 再デプロイ（自動的に行われる場合もあります）

**所要時間**: 約5分

---

### 2. Neon Consoleで接続状況を確認（10分）

**目的**: 実際の接続状況とスケールダウンの動作を確認

**手順**:
1. [Neon Console](https://console.neon.tech/)にログイン
2. プロジェクトを選択（既に選択されている場合はそのまま）
3. **Monitoring**を開く（2つの方法があります）:
   
   **方法A**: 左サイドバーから
   - 左サイドバーの「BRANCH」セクションを確認
   - 「production」ブランチが選択されていることを確認
   - 「production」の下にある「**Monitoring**」をクリック
   
   **方法B**: Dashboardから直接確認
   - Dashboardページの「Monitoring」セクションを確認
   - グラフが表示されている場合は、そこから確認可能
   - より詳細な情報を見る場合は「View all metrics」をクリック

4. 以下を確認：
   - [ ] **CU (Compute Units)**のグラフ: スケールダウンが発生しているか（グラフが0に下がる時間帯があるか）
   - [ ] **Active connections**: アイドル時は0に近いか（Monitoringページで確認可能）
   - [ ] **Compute hours**: Dashboardの「Compute」カードで確認（現在: 16.26 CU-hrs）

**確認ポイント**:
- CUグラフが0に下がる時間帯がある → Scale to zeroが機能している ✅
- CUグラフが常に一定 → Scale to zeroが機能していない可能性 ❌
- アイドル時でも接続が維持され続けている場合 → 問題あり ❌

**現在の状況（画像から）**:
- Compute: 16.26 CU-hrs（3月1日からの使用量）
- Monitoringグラフ: 低いCU使用量（約0.25）で、時々スパイクがある
- これは正常な動作の可能性が高いです

**所要時間**: 約10分

---

### 3. NeonのSuspend設定を確認・最適化（5分）

**目的**: Scale to zeroの設定を最適化

**手順**:
1. Neon Console → **Settings** → **Compute**
2. **Suspend compute after inactivity**を確認
3. 現在の設定を確認：
   - [x] 有効になっているか → ✅ **有効（5分に設定済み）**
   - [x] 何分に設定されているか → ✅ **5分（デフォルト、最適な設定）**

**現在の設定（確認済み）**:
- ✅ Scale to zero: **5分**（有効）
- ✅ Compute size: 1 ↔ 8 CU（適切）
- ✅ Pooler URL: 使用中（`-pooler`が含まれている）

**推奨設定**:
- ✅ 現在の設定（5分）が最適です
- 3分に短縮することも可能ですが、5分が推奨されています

**注意**: 短縮しすぎると、頻繁なアクセスがある場合にパフォーマンスに影響する可能性があります。現在の5分設定を維持することを推奨します。

**所要時間**: 約5分

---

### 4. Vercelのログを確認（10分）

**目的**: 長時間実行される処理や接続エラーがないか確認

**手順**:
1. Vercel Dashboard → プロジェクトを選択
2. **Deployments**タブを開く
3. 最新のデプロイメントを選択
4. **Functions**タブを開く
5. 以下を確認：
   - [ ] データベース接続エラーがないか
   - [ ] タイムアウトエラーがないか
   - [ ] 長時間実行される関数がないか（数秒以上）

**確認ポイント**:
- エラーが頻繁に発生している場合 → 接続の問題の可能性
- タイムアウトが多い場合 → クエリの最適化が必要な可能性

**所要時間**: 約10分

---

## 📊 確認後の対応

### すべて正常な場合

1. **数日間様子を見る**
   - 毎日Neon ConsoleのMetricsを確認
   - Compute hoursが減少しているか確認
   - 通常、Pooler URLを使用していれば、数日で効果が現れます

2. **コストの推移を確認**
   - Neon Console → **Billing**タブ
   - 日次のCompute hoursを確認
   - 減少傾向にあるか確認

### 問題が見つかった場合

#### 問題1: VercelでPooler URLが設定されていない
**対応**: 上記の手順1でPooler URLに更新し、再デプロイ

#### 問題2: Scale to zeroが機能していない
**対応**: 
- Suspend設定を確認（手順3）
- 接続が維持され続けている原因を調査
- Neonサポートに問い合わせ（必要に応じて）

#### 問題3: 接続エラーが多い
**対応**:
- クエリの最適化
- 接続プールの設定を確認
- エラーログの詳細を確認

---

## 🎯 期待される結果

正常に動作している場合：

- **Compute hours**: 108.54時間 → **大幅削減**（実際の使用時間のみ）
- **月額コスト**: $11.52 → **$2-5程度**（使用状況による）
- **スケールダウン**: 5分間アイドル後、自動的にスケールダウン
- **接続数**: アイドル時は0に近い

---

## 📝 記録用テンプレート

確認結果を記録してください：

```
確認日: YYYY-MM-DD

1. Vercel環境変数:
   - Production: [ ] Pooler URL / [ ] Direct URL
   - Preview: [ ] Pooler URL / [ ] Direct URL
   - Development: [ ] Pooler URL / [ ] Direct URL

2. Neon Metrics:
   - Active connections (アイドル時): _____
   - Compute hours (昨日): _____
   - Scale to zero動作: [ ] 正常 / [ ] 異常

3. Suspend設定:
   - 有効: [ ] Yes / [ ] No
   - 時間: _____ 分

4. Vercelログ:
   - エラー: [ ] あり / [ ] なし
   - タイムアウト: [ ] あり / [ ] なし

5. 次のアクション:
   _________________________________
```

---

## 🔗 参考リンク

- [Neon Console](https://console.neon.tech/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [NEON_COST_OPTIMIZATION.md](./NEON_COST_OPTIMIZATION.md) - 詳細な説明

---

## ⏱️ 全体の所要時間

- **初回確認**: 約30分
- **毎日の確認**: 約5分（Metricsを確認するだけ）
