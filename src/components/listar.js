// src/components/Listar.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { FavoritosContext } from '../context/FavoritosContext';

export default function Listar({ consejos = [], onSearch }) {
  const [busqueda, setBusqueda] = useState('');
  const keywords = ['life', 'love', 'money', 'success', 'happiness'];

  const { favoritos, agregarFavorito, quitarFavorito } = useContext(FavoritosContext);

  const esFavorito = (id) => favoritos.some(fav => fav.id === id);

  const toggleFavorito = (item) => {
    if (esFavorito(item.id)) {
      quitarFavorito(item.id);
    } else {
      agregarFavorito(item);
    }
  };

  const handleKeywordClick = (keyword) => {
    setBusqueda(keyword);
    onSearch(keyword);
  };

  return (
    <View style={{ padding: 10 }}>
      <TextInput
        placeholder="Buscar consejo (en inglés)"
        value={busqueda}
        onChangeText={setBusqueda}
        style={styles.input}
      />
      <Button title="Buscar" onPress={() => onSearch(busqueda)} />

      <View style={styles.keywordsContainer}>
        {keywords.map((keyword) => (
          <TouchableOpacity
            key={keyword}
            onPress={() => handleKeywordClick(keyword)}
            style={styles.keywordButton}
          >
            <Text style={styles.keywordText}>{keyword}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {!consejos || consejos.length === 0 ? (
        <Text style={{ marginTop: 20, textAlign: 'center' }}>No hay consejos para mostrar.</Text>
      ) : (
        <FlatList
          data={consejos}
          keyExtractor={(item) => item.id.toString()}
          style={{ marginTop: 20 }}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.adviceText}>{item.advice}</Text>
              <TouchableOpacity onPress={() => toggleFavorito(item)}>
                <Text style={[styles.heart, esFavorito(item.id) ? styles.heartActive : styles.heartInactive]}>
                  ❤️
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  keywordButton: {
    backgroundColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  keywordText: {
    fontSize: 14,
    color: '#333',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  adviceText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  heart: {
    fontSize: 24,
    marginLeft: 10,
    userSelect: 'none',
  },
  heartActive: {
    color: 'red',
    textShadowColor: 'rgba(255, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  heartInactive: {
    color: 'gray',
  },
});
