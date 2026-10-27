// js/logica.js · Funciones PURAS: reciben datos y devuelven datos. Aquí NO aparece document.

// R4 · Devuelve los episodios cuyo name contiene `texto` (sin importar mayúsculas ni espacios
// al inicio o al final) y cuyo código episode (S01E01…) empieza por `temporada`.
// temporada === '' significa «todas las temporadas».
export const filtrarEpisodios = (lista, { texto, temporada }) => {
  const buscado = texto.trim().toLowerCase();
  return lista
    .filter((e) => e.name.toLowerCase().includes(buscado))
    .filter((e) => e.episode.startsWith(temporada));
};

// R5 · Suma la cantidad de personajes (characters.length) de todos los episodios de la lista.
// Usa reduce.
export const contarPersonajes = (lista) => {
  return lista.reduce((total, e) => total + e.characters.length, 0);
};

// R6 · Si id está en ids, devuelve un array NUEVO sin él; si no está, un array NUEVO con él.
// No modifiques el array que recibes.
export const alternarId = (ids, id) => {
  return ids.includes(id)
    ? ids.filter((x) => x !== id)
    : [...ids, id];
};
