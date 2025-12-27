"use client";

import { useState } from "react";
import ContestOrganizerForm from "./contest-organizer-form";
import { PlusCircle, Sparkles } from "lucide-react";

export default function ContestOrganizerButton() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <div className="mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl sm:rounded-2xl border border-amber-200/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 flex items-center gap-2">
                  <span>コンテストを主催される方へ</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                    無料
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3 sm:mb-4">
                  あなたのコンテストを<span className="font-semibold text-amber-700">無料でデータベースに追加</span>できます。
                  <br className="hidden sm:block" />
                  フォームから簡単に追加リクエストをお送りください。
                </p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 min-h-[44px] transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">追加リクエストを送る</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ContestOrganizerForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </>
  );
}
