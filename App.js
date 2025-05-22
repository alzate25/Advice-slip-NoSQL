// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import { FavoritosProvider } from './src/context/FavoritosContext';

import Aleatorio from './src/components/aleatorio';   // Si tienes
import Favoritos from './src/components/favoritos';
import Original from './src/components/original';       // Si tienes
import Listar from './src/components/listar';
import Usuario from './src/components/usuario'; // Asegúrate de que el path sea correcto


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function ListarStack() {
  const [consejos, setConsejos] = React.useState([]);

  const handleSearch = async (query) => {
    if (query.trim().length < 3) {
      setConsejos([]);
      return;
    }
    try {
      const res = await fetch(`https://api.adviceslip.com/advice/search/${query}`, { cache: 'no-cache' });
      const data = await res.json();
      setConsejos(data.slips || []);
    } catch (error) {
      console.error(error);
      setConsejos([]);
    }
  };

  return (
    <Stack.Navigator initialRouteName="Listar">
      <Stack.Screen name="Listar">
        {(props) => <Listar {...props} consejos={consejos} onSearch={handleSearch} />}
      </Stack.Screen>
      {/* Puedes agregar otras pantallas aquí */}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <FavoritosProvider>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Aleatorio" screenOptions={{ headerTitle: 'Consejos App' }}>
          {/* Reemplaza Aleatorio, Original, Usuario si no los tienes */}
          <Drawer.Screen name="Aleatorio" component={Aleatorio} />
          <Drawer.Screen name="Favoritos" component={Favoritos} />
          <Drawer.Screen name="Original" component={Original} />
          <Drawer.Screen name="ListarStack" component={ListarStack} options={{ title: 'Listar' }} />
          <Drawer.Screen name="Usuario" component={Usuario} />
        </Drawer.Navigator>
      </NavigationContainer>
    </FavoritosProvider>
  );
}