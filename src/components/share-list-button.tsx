"use client";

import { he } from "@/lib/locale";
import { Share2, Copy, Check, MessageCircle, Facebook, Twitter } from "lucide-react";
import { useState } from "react";

interface ShareListButtonProps {
  listName: string;
  listId: string;
  personCount: number;
}

export function ShareListButton({ listName, listId, personCount }: ShareListButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined"
    ? `${window.location.origin}/list/${listId}`
    : `/list/${listId}`;

  const shareText = `📿 ${listName} — רשימת תפילה עם ${personCount} שמות לתפילה. הצטרפו להתפלל לרפואתם!`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listName,
          text: shareText,
          url,
        });
      } catch {
        // User cancelled
      }
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${url}`)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        שיתוף
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute left-0 top-full mt-2 bg-white rounded-xl border border-gray-200 shadow-lg z-20 w-64 p-2">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-green-50 transition-colors text-gray-700"
              onClick={() => setOpen(false)}
            >
              <MessageCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">WhatsApp</span>
            </a>

            {/* Telegram */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-gray-700"
              onClick={() => setOpen(false)}
            >
              <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span className="font-medium">Telegram</span>
            </a>

            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-gray-700"
              onClick={() => setOpen(false)}
            >
              <Facebook className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Facebook</span>
            </a>

            {/* Twitter/X */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
              onClick={() => setOpen(false)}
            >
              <Twitter className="w-5 h-5 text-gray-800" />
              <span className="font-medium">X / Twitter</span>
            </a>

            <div className="border-t border-gray-100 my-1" />

            {/* Copy link */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 w-full"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-500" />
              )}
              <span className="font-medium">{copied ? "הקישור הועתק!" : "העתק קישור"}</span>
            </button>

            {/* Native share (mobile) */}
            {typeof navigator !== "undefined" && "share" in navigator && (
              <>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => {
                    handleNativeShare();
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 w-full"
                >
                  <Share2 className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">שיתוף נוסף...</span>
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
