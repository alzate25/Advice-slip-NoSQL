// src/components/Favoritos.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { FavoritosContext } from '../context/FavoritosContext';

export default function Favoritos() {
  const { favoritos, quitarFavorito } = useContext(FavoritosContext);

  if (!favoritos || favoritos.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.mensaje}>No tienes consejos favoritos.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.advice}>{item.advice}</Text>
      <TouchableOpacity onPress={() => quitarFavorito(item.id)}>
        <Text style={styles.heart}>❤️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={favoritos}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mensaje: { fontSize: 16, color: '#555' },
  list: { padding: 20 },
  item: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#222', padding: 15, marginBottom: 10, borderRadius: 8,
  },
  advice: { color: '#fff', flex: 1, marginRight: 10 },
  heart: { fontSize: 24, color: 'red' },
});
