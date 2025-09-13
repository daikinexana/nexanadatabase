import { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | Nexana Database",
  description: "Nexana Databaseの利用規約について",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">利用規約</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              本規約は、Nexana Database（以下「本サービス」）の利用に関する条件を定めるものです。
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">第1条（適用）</h2>
            <p className="text-gray-600 mb-6">
              本規約は、Nexana Database（以下「本サービス」）の利用に関する条件を定めるものです。
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">第2条（定義）</h2>
            <p className="text-gray-600 mb-4">
              本規約において、以下の用語は以下の意味を有するものとします：
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>「ユーザー」：本サービスを利用する者</li>
              <li>「コンテンツ」：本サービスを通じて提供される情報、データ、画像等</li>
              <li>「アカウント」：本サービスの利用に必要な識別情報</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">第3条（利用登録）</h2>
            <p className="text-gray-600 mb-4">
              本サービスの利用を希望する者は、本規約に同意の上、当社の定める方法により利用登録を行うものとします。
            </p>
            <p className="text-gray-600 mb-4">
              当社は、利用登録の申請者が以下の事由に該当する場合、利用登録を拒否することがあります：
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>虚偽の情報を提供した場合</li>
              <li>本規約に違反したことがある者からの申請である場合</li>
              <li>その他、当社が利用登録を適当でないと判断した場合</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">第4条（利用料金）</h2>
            <p className="text-gray-600 mb-4">
              本サービスの利用料金は、当社が別途定める料金体系に従うものとします。
            </p>
            <p className="text-gray-600 mb-6">
              利用料金の支払い方法、支払い時期等については、当社が別途定める方法に従うものとします。
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">第5条（禁止事項）</h2>
            <p className="text-gray-600 mb-4">
              ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません：
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>当社のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
              <li>本サービスの運営を妨害するおそれのある行為</li>
              <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
              <li>他のユーザーに成りすます行為</li>
              <li>当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">第6条（本サービスの提供の停止等）</h2>
            <p className="text-gray-600 mb-4">
              当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします：
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
              <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
              <li>コンピュータまたは通信回線等が事故により停止した場合</li>
              <li>その他、当社が本サービスの提供が困難と判断した場合</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">第7条（利用制限および登録抹消）</h2>
            <p className="text-gray-600 mb-4">
              当社は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して、本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします：
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>本規約のいずれかの条項に違反した場合</li>
              <li>登録事項に虚偽の事実があることが判明した場合</li>
              <li>料金等の支払債務の不履行があった場合</li>
              <li>当社からの連絡に対し、一定期間返答がない場合</li>
              <li>本サービスについて、最後の利用から一定期間利用がない場合</li>
              <li>その他、当社が本サービスの利用を適当でないと判断した場合</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">第8条（免責事項）</h2>
            <p className="text-gray-600 mb-4">
              当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
            </p>
            <p className="text-gray-600 mb-4">
              当社は、本サービスに起因してユーザーに生じたあらゆる損害について、当社の故意又は重過失による場合を除き、一切の責任を負いません。ただし、本サービスに関する当社とユーザーとの間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。
            </p>
            <p className="text-gray-600 mb-6">
              当社は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">第9条（サービス内容の変更等）</h2>
            <p className="text-gray-600 mb-6">
              当社は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">第10条（利用規約の変更）</h2>
            <p className="text-gray-600 mb-6">
              当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約変更後、本サービスの利用を継続した場合には、変更後の規約に同意したものとみなします。
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">第11条（通知または連絡）</h2>
            <p className="text-gray-600 mb-6">
              ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。当社は、ユーザーから、当社が別途定める方法に従った変更の届出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">第12条（権利義務の譲渡の禁止）</h2>
            <p className="text-gray-600 mb-6">
              ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">第13条（準拠法・裁判管轄）</h2>
            <p className="text-gray-600 mb-4">
              本規約の解釈にあたっては、日本法を準拠法とします。
            </p>
            <p className="text-gray-600 mb-6">
              本サービスに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500">
                制定日：2025年1月1日<br />
                最終更新日：2025年1月15日
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
