import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Aleatorio() {
  const [advice, setAdvice] = useState('');

  const obtenerConsejo = () => {
    fetch('https://api.adviceslip.com/advice')
      .then(res => res.json())
      .then(data => {
        setAdvice(data.slip.advice);
      })
      .catch(err => {
        console.error('Error al obtener el consejo:', err);
        setAdvice('No se pudo cargar el consejo.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consejo Aleatorio</Text>
      <Text style={styles.advice}>
        {advice || 'Haz clic en el botón para obtener un consejo.'}
      </Text>
      <Button title="Obtener Consejo" onPress={obtenerConsejo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  advice: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
});
