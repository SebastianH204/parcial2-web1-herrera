# Parcial 2 · Respuestas de razonamiento

Nombre:Sebastian Herrera Rueda

Son cuatro preguntas de 5 puntos sobre código que ya conoces. Para cada una:

1. Lee el código y escribe primero lo que **crees** que pasa.
2. Compruébalo: pégalo en la consola de DevTools (F12 → Console) con tu página del parcial abierta en Live Server. En esa consola sí se puede usar `await` fuera de una función.
3. Escribe tu respuesta debajo de cada letra: (a), (b), (c)…

Se califica la explicación, no solo el resultado: con dos o tres frases por letra es suficiente. Escríbela con tus palabras, porque te la pueden preguntar.

## P1 · ¿En qué orden se imprime? (5 puntos)

**Lo viste en:** la función `cargar` del Explorador (semana 8): «await pausa ESTA función, no el navegador».

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
const cargar = async () => {
  console.log('3');
  const respuesta = await fetch('https://rickandmortyapi.com/api/episode/1');
  console.log('4');
};
cargar();
console.log('5');
```

**(a)** Los cinco números en el orden en que salen en la consola. (2 pts)

Respuesta: 1, 3, 5, 2, 4

**(b)** Por qué el `3` sale **antes** que el `5`, si `cargar` es una función `async`. (2 pts)

Respuesta:Porque el async no hace que la función espere desde el principio. cargar() arranca normal como cualquier función y ejecuta todo hasta que llega al await.
O sea, el 3 está antes del await, entonces sale de inmediato, antes de que el código de afuera llegue al 5.

**(c)** Por qué el `5` no espera a que termine el `fetch`, y por qué el `2` y el `4` salen al final. (1 pt)

Respuesta:El await pausa esa función, no la página. El fetch es algo lento, entonces se le delega al navegador y la caja registradora sigue atendiendo lo de afuera, por eso sale el 5.
El setTimeout también se delega. Aunque sea de 0, su función se va a la fila y espera a que termine todo lo que se estaba ejecutando, por eso el 2 sale después del 5.
El 4 sale de último porque tiene que esperar a que el servidor conteste, y eso se demora más que el setTimeout.

## P2 · Un 404 que no llega al catch (5 puntos)

**Lo viste en:** el `pedirJSON` del Explorador (semana 8): «fetch solo falla si NO pudo hablar con el servidor».

El episodio 9999 no existe: la API responde con código **404** y el cuerpo `{"error":"Episode not found"}`.

```js
try {
  const respuesta = await fetch('https://rickandmortyapi.com/api/episode/9999');
  const datos = await respuesta.json();
  console.log('Episodio:', datos.name);
} catch (error) {
  console.log('Falló:', error.message);
}
```

**(a)** Qué imprime la consola, exactamente. (1 pt)

Respuesta:Episodio: undefined

**(b)** Por qué **no** entra al `catch`, aunque el episodio no existe. Pista: piensa en la diferencia entre «el servidor respondió con un 404» y «no hubo respuesta» (por ejemplo, sin internet). (2 pts)

Respuesta:Porque el servidor sí contestó, solo que le dijo al navegador “ese episodio no existe” con un 404. Para fetch, que el servidor conteste ya es un éxito, entonces no se va al catch.
fetch solo se va al catch cuando ni siquiera pudo hablar con el servidor (por ejemplo sin internet o con el dominio mal escrito).
El .json() también funciona porque el cuerpo es un JSON normal, solo que trae “error” y no name. Por eso sale undefined.

**(c)** La línea que falta para que sí entre al `catch`: escríbela e indica en qué parte del código va. Luego escribe qué imprimiría la consola con esa línea. (2 pts)

Respuesta:Toca poner esta línea justo después del fetch y antes del .json():

```js
if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
```

respuesta.ok solo es true con códigos del 200 al 299. Con el 404 da false, entonces uno mismo lanza el error y así sí se va al catch.
La consola imprimiría: Falló: HTTP 404

## P3 · LocalStorage sin JSON (5 puntos)

**Lo viste en:** `js/favoritos.js` del Explorador (semana 8): «localStorage solo guarda TEXTO».

```js
const vistos = [1, 5, 8];
localStorage.setItem('vistos', vistos);
const leido = localStorage.getItem('vistos');
console.log(leido, typeof leido);      // (a)
console.log(leido.length);             // (b)
const recuperado = JSON.parse(leido);  // (c)
```

**(a)** Qué imprime la línea marcada (a): el valor y su tipo. (1 pt)

Respuesta:Imprime: 1,5,8 string
localStorage solo guarda texto, entonces convirtió el array en el texto “1,5,8” (sin corchetes).

**(b)** Qué imprime la línea marcada (b), y por qué da ese número. (1 pt)

Respuesta:Imprime 5. Como leido es un texto, length cuenta los caracteres y no los números: 1 , 5 , 8 son 3 números y 2 comas.

**(c)** Qué pasa en la línea marcada (c): ¿funciona o sale un error? Si sale un error, cuál y por qué. (1 pt)

Respuesta:Sale un error: SyntaxError. JSON.parse necesita un texto JSON válido y “1,5,8” sin corchetes no lo es. Lee el 1 y después se encuentra una coma que no debería estar ahí.

**(d)** La segunda línea corregida, para que `recuperado` vuelva a ser el array `[1, 5, 8]`. (1 pt)

Respuesta:
```js
localStorage.setItem('vistos', JSON.stringify(vistos));
```

Con JSON.stringify se guarda "[1,5,8]" con los corchetes, y así JSON.parse sí lo puede volver a convertir en el array [1, 5, 8].

**(e)** Por qué en tu `leerVistos` el `JSON.parse` va dentro de un `try/catch`: qué podría pasarle a la app si no estuviera. (1 pt)

Respuesta:Porque lo que está guardado puede estar dañado, por ejemplo si alguien lo cambia a mano en Application o se guardó sin stringify.
Si el JSON.parse no estuviera en un try/catch, ese error rompería app.js desde que arranca y la página no mostraría nada.
Con el try/catch, si falla devuelve [] y la app carga normal, solo que sin vistos. Eso lo probé en la prueba 9 con {roto.

## P4 · Botones que dejan de funcionar (5 puntos)

**Lo viste en:** la delegación en la grilla del Explorador (semana 7, paso 04). Está explicada en el README, en R6: «¿Qué es la delegación?».

Un compañero escribió este código. Al cargar la página, el primer clic en «Marcar como visto» funciona; pero después de ese clic, o después de escribir una letra en el buscador, **ningún botón responde**.

```js
render();
document.querySelectorAll('[data-id]').forEach((boton) => {
  boton.addEventListener('click', () => {
    vistos = alternarId(vistos, Number(boton.dataset.id));
    guardarVistos(vistos);
    render();
  });
});
```

**(a)** Qué les pasó a los botones. Pista: fíjate en qué hace `render()` con el contenido de `#lista` cada vez que se llama, y en cuántas veces se ejecuta el `forEach`. (2 pts)

Respuesta:El forEach solo se ejecuta una vez, cuando carga la página, y les pone el listener a los botones que existían en ese momento.
El problema es que cada render() destruye esos botones con innerHTML y crea otros nuevos, que nadie está escuchando.
Por eso el primer clic sí funciona, pero apenas se llama render() (al marcar uno o al escribir en el buscador), los botones nuevos ya no tienen listener.

**(b)** El código reescrito con **delegación**: un solo listener en `#lista` que funcione con cualquier botón, aunque `render()` lo haya creado después. Se revisan tres cosas, 1 punto cada una: que el listener esté en `#lista` y no en los botones; que use `closest('[data-id]')` (o algo equivalente) para saber qué botón se presionó; y que no haga nada si el clic no fue en un botón. (3 pts)

Respuesta:

```js
lista.addEventListener('click', (evento) => {
  const boton = evento.target.closest('[data-id]');
  if (!boton) return;   // el clic no fue en un botón: no hace nada

  vistos = alternarId(vistos, Number(boton.dataset.id));
  guardarVistos(vistos);
  render();
});
```
Así no importa cuántas veces render() vuelva a crear los botones. El listener está en #lista, que nunca se borra, y los clics burbujean hasta ahí. Con closest uno sabe en qué botón fue el clic, y si no fue en un botón no hace nada.