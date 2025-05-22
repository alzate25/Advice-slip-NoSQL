// src/components/usuario/index.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export default function Usuario() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const fetchProfile = async (firebaseUser) => {
    try {
      const docRef = doc(db, 'profiles', firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      const profileData = docSnap.exists() ? docSnap.data() : {};
      setUser({ ...firebaseUser, full_name: profileData.full_name || '' });
      setFullName(profileData.full_name || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setMessage('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Usuario creado:", userCredential.user);
      const uid = userCredential.user.uid;
      await setDoc(doc(db, 'profiles', uid), {
        full_name: fullName,
        created_at: new Date(),
      });
      console.log("Documento creado en Firestore");

      setMessage('Registro exitoso. Revisa tu correo para confirmar.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await fetchProfile(userCredential.user);
      setMessage('Login exitoso.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setEmail('');
      setPassword('');
      setFullName('');
      setMessage('Sesión cerrada.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    setMessage('');
    try {
      const profileRef = doc(db, 'profiles', user.uid);
      await updateDoc(profileRef, {
        full_name: fullName,
        updated_at: new Date(),
      });
      setMessage('Perfil actualizado.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" />}
      {!user ? (
        <>
          <Text style={styles.title}>Registrar / Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            autoCapitalize="none"
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre completo (solo para registro)"
            value={fullName}
            onChangeText={setFullName}
          />
          <View style={styles.buttons}>
            <Button title="Registrar" onPress={handleRegister} />
            <Button title="Iniciar sesión" onPress={handleLogin} />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>Hola, {user.full_name}</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={fullName}
            onChangeText={setFullName}
          />
          <View style={styles.buttons}>
            <Button title="Actualizar perfil" onPress={handleUpdateProfile} />
            <Button title="Cerrar sesión" onPress={handleLogout} />
          </View>
        </>
      )}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 22, marginBottom: 10, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  buttons: {
    marginVertical: 10,
    gap: 10,
  },
  message: {
    textAlign: 'center',
    marginTop: 10,
    color: 'green',
  },
});
