// src/services/api.js

export async function getRandomAdvice() {
  try {
    const res = await fetch('https://api.adviceslip.com/advice');
    const data = await res.json();
    return data.slip;
  } catch (error) {
    console.error('Error al obtener consejo aleatorio:', error);
    return null;
  }
}

export async function searchAdvice(term) {
  try {
    const res = await fetch(`https://api.adviceslip.com/advice/search/${term}`, { cache: 'no-cache' });
    const data = await res.json();
    return data.slips || [];
  } catch (error) {
    console.error('Error al buscar consejos:', error);
    return [];
  }
}
