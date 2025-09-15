"use client";

import React from "react";

interface ThinkingAnimationProps {
  variant?: "dots" | "pulse" | "wave" | "typing" | "brain" | "spinner";
  text?: string;
}

export function ThinkingAnimation({ 
  variant = "dots", 
  text = "Đang suy nghĩ..." 
}: ThinkingAnimationProps) {
  
  const renderDotsAnimation = () => (
    <div className="flex items-center space-x-1">
      <span className="text-sm font-medium">{text}</span>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
      </div>
    </div>
  );

  const renderPulseAnimation = () => (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-4 h-4 bg-current rounded-full animate-ping"></div>
        <div className="absolute inset-0 w-4 h-4 bg-current rounded-full animate-pulse"></div>
      </div>
      <span className="text-sm font-medium animate-pulse">{text}</span>
    </div>
  );

  const renderWaveAnimation = () => (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">{text}</span>
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1 h-6 bg-current rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.8s'
            }}
          ></div>
        ))}
      </div>
    </div>
  );

  const renderTypingAnimation = () => (
    <div className="flex items-center space-x-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0s] [animation-duration:1.4s]"></div>
        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:1.4s]"></div>
        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s] [animation-duration:1.4s]"></div>
      </div>
      <span className="text-sm font-medium typing-text">{text}</span>
    </div>
  );

  const renderBrainAnimation = () => (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="brain-icon">
          🧠
        </div>
        <div className="absolute -top-1 -right-1">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
        </div>
      </div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );

  const renderSpinnerAnimation = () => (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      </div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );

  const animations = {
    dots: renderDotsAnimation,
    pulse: renderPulseAnimation,
    wave: renderWaveAnimation,
    typing: renderTypingAnimation,
    brain: renderBrainAnimation,
    spinner: renderSpinnerAnimation,
  };

  return (
    <div className="thinking-animation">
      {animations[variant]()}
    </div>
  );
}

// Advanced Thinking Component với nhiều hiệu ứng kết hợp
export function AdvancedThinkingAnimation({ text = "Đang suy nghĩ..." }: { text?: string }) {
  return (
    <div className="flex items-center space-x-3 p-2">
      {/* Animated brain with particles */}
      <div className="relative">
        <div className="text-2xl animate-pulse brain-bounce">🧠</div>
        {/* Floating particles */}
        <div className="absolute -top-2 -right-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping particle-1"></div>
        </div>
        <div className="absolute -bottom-1 -left-1">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping particle-2"></div>
        </div>
        <div className="absolute top-1 -right-3">
          <div className="w-1 h-1 bg-yellow-400 rounded-full animate-ping particle-3"></div>
        </div>
      </div>
      
      {/* Animated text with typing effect */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium typing-text-advanced">{text}</span>
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce dot-1"></div>
          <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce dot-2"></div>
          <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce dot-3"></div>
        </div>
      </div>
    </div>
  );
}
