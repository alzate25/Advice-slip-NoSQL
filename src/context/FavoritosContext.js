// src/context/FavoritosContext.js
import React, { createContext, useState } from 'react';

export const FavoritosContext = createContext();

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState([]);

  const agregarFavorito = (item) => {
    setFavoritos((prev) => {
      if (prev.find(fav => fav.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const quitarFavorito = (id) => {
    setFavoritos((prev) => prev.filter(fav => fav.id !== id));
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, agregarFavorito, quitarFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}
