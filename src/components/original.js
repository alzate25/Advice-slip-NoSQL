// src/components/original/index.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { auth, db } from '../firebase/config';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function Original() {
  const [advice, setAdvice] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [consejos, setConsejos] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetchConsejos(firebaseUser.uid);
      } else {
        setUser(null);
        setConsejos([]);
      }
    });
    return unsubscribe;
  }, []);

  const handleGuardar = async () => {
    setMensaje('');
    if (!advice.trim()) {
      setMensaje('Por favor escribe un consejo.');
      return;
    }

    if (!user) {
      setMensaje('Debes iniciar sesión para guardar un consejo.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'original_advices'), {
        advice,
        user_id: user.uid,
        created_at: new Date(),
      });
      setMensaje('¡Consejo guardado con éxito!');
      setAdvice('');
      fetchConsejos(user.uid);
    } catch (error) {
      console.error('Error al guardar consejo:', error);
      setMensaje('Error al guardar el consejo.');
    } finally {
      setLoading(false);
    }
  };

  const fetchConsejos = async (userId) => {
    try {
      const q = query(
        collection(db, 'original_advices'),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setConsejos(data);
    } catch (error) {
      console.error('Error al obtener consejos:', error);
      setMensaje('Error al obtener consejos.');
    }
  };

  const handleEliminar = async (id) => {
    setMensaje('');
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'original_advices', id));
      setMensaje('Consejo eliminado.');
      fetchConsejos(user.uid);
    } catch (error) {
      console.error('Error al eliminar consejo:', error);
      setMensaje('Error al eliminar el consejo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escribe tu propio consejo</Text>
      <TextInput
        placeholder="Comparte tu sabiduría aquí..."
        value={advice}
        onChangeText={setAdvice}
        style={styles.textarea}
        multiline
      />
      <Button title={loading ? 'Guardando...' : 'Guardar Consejo'} onPress={handleGuardar} disabled={loading} />
      {mensaje !== '' && <Text style={styles.message}>{mensaje}</Text>}

      <Text style={styles.subtitle}>Tus consejos guardados:</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={consejos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.advice}</Text>
              <Button title="Eliminar" onPress={() => handleEliminar(item.id)} color="tomato" />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 20, marginBottom: 10 },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    minHeight: 80,
    marginBottom: 10,
    borderRadius: 6,
  },
  subtitle: { fontSize: 18, marginVertical: 10 },
  item: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  message: {
    textAlign: 'center',
    marginTop: 10,
    color: 'green',
  },
});
