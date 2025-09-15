"use client";

import React from "react";
import { ThinkingAnimation, AdvancedThinkingAnimation } from "./thinking-animation";

export function ThinkingDemo() {
  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Các hiệu ứng "Đang suy nghĩ..." có sẵn</h2>
      
      <div className="grid gap-4">
        <div className="p-4 border rounded-lg bg-secondary/20">
          <h3 className="font-semibold mb-2">1. Dots Animation (Mặc định)</h3>
          <div className="bg-secondary/80 rounded-lg px-4 py-3 inline-block">
            <ThinkingAnimation variant="dots" text="Đang suy nghĩ" />
          </div>
          <p className="text-sm text-gray-600 mt-2">Ba chấm nhảy lên xuống theo nhịp</p>
        </div>

        <div className="p-4 border rounded-lg bg-secondary/20">
          <h3 className="font-semibold mb-2">2. Pulse Animation</h3>
          <div className="bg-secondary/80 rounded-lg px-4 py-3 inline-block">
            <ThinkingAnimation variant="pulse" text="Đang xử lý" />
          </div>
          <p className="text-sm text-gray-600 mt-2">Hiệu ứng pulse với vòng tròn</p>
        </div>

        <div className="p-4 border rounded-lg bg-secondary/20">
          <h3 className="font-semibold mb-2">3. Wave Animation</h3>
          <div className="bg-secondary/80 rounded-lg px-4 py-3 inline-block">
            <ThinkingAnimation variant="wave" text="Đang phân tích" />
          </div>
          <p className="text-sm text-gray-600 mt-2">Sóng âm thanh với các thanh dọc</p>
        </div>

        <div className="p-4 border rounded-lg bg-secondary/20">
          <h3 className="font-semibold mb-2">4. Typing Animation</h3>
          <div className="bg-secondary/80 rounded-lg px-4 py-3 inline-block">
            <ThinkingAnimation variant="typing" text="Đang soạn câu trả lời" />
          </div>
          <p className="text-sm text-gray-600 mt-2">Hiệu ứng đánh máy với cursor nhấp nháy</p>
        </div>

        <div className="p-4 border rounded-lg bg-secondary/20">
          <h3 className="font-semibold mb-2">5. Brain Animation</h3>
          <div className="bg-secondary/80 rounded-lg px-4 py-3 inline-block">
            <ThinkingAnimation variant="brain" text="Đang suy nghĩ" />
          </div>
          <p className="text-sm text-gray-600 mt-2">Biểu tượng não bộ với hiệu ứng sáng</p>
        </div>

        <div className="p-4 border rounded-lg bg-secondary/20">
          <h3 className="font-semibold mb-2">6. Spinner Animation</h3>
          <div className="bg-secondary/80 rounded-lg px-4 py-3 inline-block">
            <ThinkingAnimation variant="spinner" text="Đang tải" />
          </div>
          <p className="text-sm text-gray-600 mt-2">Spinner quay tròn cổ điển</p>
        </div>

        <div className="p-4 border rounded-lg bg-secondary/20">
          <h3 className="font-semibold mb-2">7. Advanced Animation (Đặc biệt)</h3>
          <div className="bg-secondary/80 rounded-lg px-4 py-3 inline-block">
            <AdvancedThinkingAnimation text="AI đang phân tích câu hỏi của bạn" />
          </div>
          <p className="text-sm text-gray-600 mt-2">Kết hợp não bộ, particles và text glow</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">💡 Cách sử dụng:</h3>
        <div className="text-sm space-y-2">
          <p>1. Trong file <code>chat-messages.tsx</code>, uncomment hiệu ứng bạn muốn sử dụng</p>
          <p>2. Comment lại hiệu ứng hiện tại nếu muốn thay đổi</p>
          <p>3. Bạn có thể thay đổi text bằng prop <code>text</code></p>
          <p>4. Tất cả hiệu ứng đều responsive và hỗ trợ dark mode</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">🎨 Tùy chỉnh:</h3>
        <div className="text-sm space-y-2">
          <p>• Thay đổi màu sắc trong file <code>globals.css</code></p>
          <p>• Điều chỉnh tốc độ animation bằng cách thay đổi <code>animation-duration</code></p>
          <p>• Tạo hiệu ứng riêng bằng cách thêm variant mới trong component</p>
        </div>
      </div>
    </div>
  );
}
