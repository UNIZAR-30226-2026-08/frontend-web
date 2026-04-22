import { createContext, useState, useEffect, useContext, useCallback } from 'react';

const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [itemData, setItemData] = useState({ token: [], emoji: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/items.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch items');
        return res.json();
      })
      .then((data) => {
        setItemData(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  const getItemInfo = useCallback((id : any) => {
    const token = itemData.token.find(t => t.id === id);
    if (token) {
      return { name: token.name, url: `/skins/${token.icon}` };
    }

    const emoji = itemData.emoji.find(e => e.id === id);
    if (emoji) {
      return { name: emoji.name, url: `/emojis/${emoji.icon}` };
    }

    return null;
  }, [itemData]);

  return (
    <ItemContext.Provider value={{ itemData, loading, getItemInfo }}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItemData = () => {
  const context = useContext(ItemContext);
  if (!context) throw new Error('useItemData must be used within an ItemProvider');
  return context;
};
