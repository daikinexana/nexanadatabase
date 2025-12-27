"use client";

import { useState } from "react";
import WorkspaceOrganizerForm from "./workspace-organizer-form";
import { PlusCircle, Sparkles } from "lucide-react";

export default function WorkspaceOrganizerButton() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <div className="mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-xl sm:rounded-2xl border border-emerald-200/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-sm">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 flex items-center gap-2">
                  <span>ワークスペースを運営される方へ</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    無料
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3 sm:mb-4">
                  あなたのワークスペースを<span className="font-semibold text-emerald-700">無料でデータベースに追加</span>できます。
                  <br className="hidden sm:block" />
                  フォームから簡単に追加リクエストをお送りください。
                </p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 min-h-[44px] transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">追加リクエストを送る</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WorkspaceOrganizerForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </>
  );
}

