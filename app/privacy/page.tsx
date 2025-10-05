import { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Nexana Database",
  description: "Nexana Databaseのプライバシーポリシーについて",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Nexana Database（以下「本サービス」）におけるユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. 取得する情報</h2>
            <p className="text-gray-600 mb-4">
              当社は、本サービスを提供するにあたり、以下の情報を取得することがあります：
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>氏名、メールアドレス、電話番号などの連絡先情報</li>
              <li>ログ情報、Cookie、利用環境、端末情報など</li>
              <li>検索履歴、閲覧履歴、利用状況などのサービス利用情報</li>
              <li>お問い合わせ内容、サポート依頼内容などのコミュニケーション情報</li>
              <li>その他、サービス提供に必要な情報</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. 利用目的</h2>
            <p className="text-gray-600 mb-4">
              取得した個人情報は、以下の目的の範囲内で使用します：
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>Nexana Databaseサービスの提供および運営</li>
              <li>コンテスト、公募、施設、ニュース、ナレッジ情報の提供</li>
              <li>検索機能、フィルタリング機能の提供</li>
              <li>サービス提供およびその品質向上のため</li>
              <li>利用者サポート、問い合わせ対応のため</li>
              <li>サービスの改善および新サービスの開発</li>
              <li>利用状況の分析および統計情報の作成</li>
              <li>法令に基づく対応</li>
              <li>その他、お客様の同意を得た目的</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. データの保存期間</h2>
            <p className="text-gray-600 mb-4">
              当社は、個人情報を以下の期間保存します：
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>アカウント情報：アカウント削除まで</li>
              <li>利用履歴：サービス提供に必要な期間</li>
              <li>お問い合わせ情報：対応完了後1年間</li>
              <li>ログ情報：セキュリティ目的で最大1年間</li>
              <li>その他の情報：利用目的達成後、法令に基づく保存期間を除き、速やかに削除</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. 情報の管理と安全対策</h2>
            <p className="text-gray-600 mb-4">
              当社は、個人情報の漏洩、滅失、毀損等を防止するため、以下の安全対策を実施しています：
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>SSL（Secure Socket Layer）による暗号化通信</li>
              <li>アクセストークンや個人情報の暗号化保存</li>
              <li>アクセス権限の制限とログ管理</li>
              <li>外部セキュリティ監査の実施</li>
              <li>個人情報へのアクセス制限</li>
              <li>定期的なセキュリティ監査</li>
              <li>従業員への個人情報保護教育</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. 第三者提供の制限</h2>
            <p className="text-gray-600 mb-4">
              当社は、以下の場合を除き、個人情報を第三者に提供いたしません：
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>本人の同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>サービス提供に必要な業務委託先に必要最小限の範囲で提供する場合</li>
              <li>人の生命、身体または財産の保護のために必要な場合</li>
              <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要な場合</li>
              <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. 個人情報の開示・訂正・利用停止・消去</h2>
            <p className="text-gray-600 mb-4">
              お客様は、当社に対して、当社が保有するお客様の個人情報について、以下の請求を行うことができます：
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>個人情報の開示</li>
              <li>個人情報の訂正</li>
              <li>個人情報の利用停止</li>
              <li>個人情報の消去</li>
            </ul>
            <p className="text-gray-600 mb-6">
              これらの請求については、法令に基づき適切に対応いたします。
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. クッキー（Cookie）の使用</h2>
            <p className="text-gray-600 mb-4">
              当社のウェブサイトでは、お客様により良いサービスを提供するためにクッキーを使用することがあります。
            </p>
            <p className="text-gray-600 mb-4">クッキーの使用目的：</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>ウェブサイトの利用状況の分析</li>
              <li>お客様の利便性向上</li>
              <li>セキュリティの確保</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. プライバシーポリシーの変更</h2>
            <p className="text-gray-600 mb-6">
              当社は、法令等の変更に伴い、本ポリシーを予告なく改定することがあります。重要な変更がある場合には、ウェブサイト上での告知やメール等によりユーザーに通知します。
            </p>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500">
                制定日：2025年1月1日<br />
                最終更新日：2025年1月15日
              </p>
              <p className="text-sm text-gray-500 mt-2">
                お問い合わせ先：<a href="/contact" className="text-blue-600 hover:text-blue-800">お問い合わせページ</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
