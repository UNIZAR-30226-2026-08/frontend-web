import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useItemData } from '@/context/ItemContext';
// @ts-ignore
import { fetchUserEmojis } from '@/api/shopServices';

interface EmojiPickerBarProps {
  onEmojiSelect: (emojiId: string | number) => void;
}

export function EmojiPickerBar({ onEmojiSelect }: EmojiPickerBarProps) {
  const { token } = useAuth();
  const { getItemInfo } = useItemData();
  const [userEmojis, setUserEmojis] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      fetchUserEmojis(token, (data: any) => {
        let fetchedEmojis: any[] = [];
        
        if (data && Array.isArray(data)) {
          fetchedEmojis = data;
        } else if (data && typeof data === 'object') {
          fetchedEmojis = Object.values(data);
        }

        setUserEmojis(fetchedEmojis);
      });
    }
  }, [token]);

  return (
    <div className="w-[94%] mx-auto overflow-x-auto flex items-center gap-6 px-4 pt-3 pb-2.5 bg-slate-100/90 border-2 border-slate-200 rounded-xl mb-3 min-h-[56px] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-thumb]:rounded-full">
      {userEmojis.length === 0 ? (
        <div className="w-full flex items-center justify-center">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider text-center">
            No tienes emojis, ¡cómpralos en la tienda!
          </span>
        </div>
      ) : (
        userEmojis.map((item: any) => {
          const realEmojiId = item.custom_id || item.id;  
          const info = getItemInfo(realEmojiId);

          if (!info) return null;

          return (
            <button
              key={realEmojiId}
              onClick={() => onEmojiSelect(realEmojiId)}
              className="shrink-0 flex items-center justify-center transition-transform duration-150 ease-bouncy hover:scale-125 hover:-translate-y-1 active:scale-95"
              title={info.name}
            >
              <img 
                src={info.url} 
                alt={info.name} 
                className="w-8 h-8 object-contain drop-shadow-sm pointer-events-none" 
              />
            </button>
          );
        })
      )}
    </div>
  );
}
