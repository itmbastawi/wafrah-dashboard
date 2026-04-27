'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Bot, Sparkles } from 'lucide-react';
import type { ChatMessage } from '../../../types/inventory';

interface ChatbotProps {
  healthScore?: number;
  criticalItems?: number;
  alertsCount?: number;
  healthyCount?: number;
  warningCount?: number;
}

const quickReplies = [
  'Show health score',
  'Show alerts',
  'Show KPI summary',
  'What needs attention?',
];

export function Chatbot({
  healthScore = 72.5,
  criticalItems = 12,
  alertsCount = 4,
  healthyCount = 3,
  warningCount = 2,
}: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'bot',
      content: "Hello! I'm your Inventory AI Assistant. I can help you with health scores, alerts, KPIs, and more. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('health') || lowerMessage.includes('score')) {
      return `The overall inventory health score is ${healthScore.toFixed(1)}/100. This is calculated based on availability, turnover, freshness, balance, and value metrics.`;
    }
    
    if (lowerMessage.includes('alert') || lowerMessage.includes('warning')) {
      return `You have ${alertsCount} active alerts: ${criticalItems} critical items that need immediate attention, and ${warningCount} items in warning status.`;
    }
    
    if (lowerMessage.includes('kpi') || lowerMessage.includes('summary') || lowerMessage.includes('overview')) {
      return `KPI Summary:\n• Average Health Score: ${healthScore.toFixed(1)}\n• Critical Items: ${criticalItems}\n• Healthy Items: ${healthyCount}\n• Warning Items: ${warningCount}\n\nWould you like more details on any specific metric?`;
    }
    
    if (lowerMessage.includes('critical') || lowerMessage.includes('attention') || lowerMessage.includes('problem')) {
      return `Items needing attention:\n• Gaming Mouse - Critical stock level (only 5 units)\n• 4K Monitor - High overstock ratio (50% excess)\n• USB-C Hub - Slowing turnover (22 days no movement)`;
    }
    
    if (lowerMessage.includes('stock') || lowerMessage.includes('inventory')) {
      return `Current inventory status:\n• Healthy items: ${healthyCount}\n• Warning items: ${warningCount}\n• Critical items: ${criticalItems}\n\nUse the product selector to view specific product details.`;
    }
    
    if (lowerMessage.includes('turnover')) {
      return `The average inventory turnover rate is 6.8x. This indicates how many times inventory is sold and replaced over the period. A higher rate generally indicates better inventory management.`;
    }
    
    if (lowerMessage.includes('dead stock') || lowerMessage.includes('slow moving')) {
      return `Dead stock currently accounts for 8.5% of inventory. Items like Gaming Mouse (45 days without movement) are at risk of becoming dead stock.`;
    }
    
    if (lowerMessage.includes('overstock')) {
      return `Overstock levels are at 15.3%, which is above optimal. The 4K Monitor has a 50% excess inventory ratio and should be reviewed.`;
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm here to help you with inventory analytics. Ask me about health scores, alerts, KPIs, or any specific metrics.";
    }
    
    if (lowerMessage.includes('thank')) {
      return "You're welcome! Let me know if you need any more information about your inventory.";
    }
    
    if (lowerMessage.includes('help')) {
      return "I can help you with:\n• Health scores and metrics\n• Active alerts and warnings\n• KPI summaries\n• Stock levels and inventory status\n• Turnover and dead stock info\n• Overstock analysis\n\nJust ask!";
    }
    
    return "I'm not sure I understand. Try asking about health scores, alerts, KPIs, stock levels, or type 'help' to see what I can assist with.";
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: generateResponse(userMessage.content),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`bg-surface-elevated border border-border-default rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-out ${
            isMinimized 
              ? 'w-80 h-14' 
              : 'w-96 h-[500px]'
          }`}
          style={{ animation: 'chatSlideIn 0.3s ease-out' }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between px-4 py-3 border-b border-border-default cursor-pointer"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-surface-elevated" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary text-sm">AI Assistant</h3>
                <p className="text-xs text-text-muted flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Online
                </p>
              </div>
            </div>
            <button className="p-1.5 hover:bg-surface rounded-lg transition-colors">
              {isMinimized ? (
                <MessageCircle className="w-5 h-5 text-text-muted" />
              ) : (
                <Minimize2 className="w-5 h-5 text-text-muted" />
              )}
            </button>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                        msg.role === 'user'
                          ? 'bg-primary text-white rounded-br-md'
                          : 'bg-surface border border-border-default text-text-primary rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${
                        msg.role === 'user' ? 'text-white/60' : 'text-text-muted'
                      }`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-surface border border-border-default rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="px-3 pb-2">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs px-2.5 py-1 bg-surface border border-border-default rounded-full text-text-muted hover:text-text-primary hover:border-primary/30 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="px-4 pb-4 pt-2 border-t border-border-default">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 bg-surface border border-border-default rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
          style={{ animation: 'chatBounce 0.5s ease-out' }}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Close Button when chat is open */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-3 -right-3 p-2 bg-surface-elevated border border-border-default rounded-full shadow-md hover:bg-surface transition-colors"
        >
          <X className="w-4 h-4 text-text-muted" />
        </button>
      )}

      <style jsx>{`
        @keyframes chatSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes chatBounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}