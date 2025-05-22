import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function Menu({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Aleatorios" onPress={() => navigation.navigate('Aleatorios')} />
      <Button title="Favoritos" onPress={() => navigation.navigate('Favoritos')} />
      <Button title="Original" onPress={() => navigation.navigate('Original')} />
      <Button title="Usuario" onPress={() => navigation.navigate('Usuario')} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 20,
  },
});
