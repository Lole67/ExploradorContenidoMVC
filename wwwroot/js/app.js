'use strict';
const endpoints = {
  cita: 'https://dummyjson.com/quotes/random',
  perro: 'https://dog.ceo/api/breeds/image/random',
  gato: 'https://cataas.com/cat?json=true',
  dato: 'https://uselessfacts.jsph.pl/api/v2/facts/random?language=en'
};
function textoValido(valor) {
  if (typeof valor !== 'string' || !valor.trim()) throw new Error('Respuesta incompleta');
  return valor;
}
function crearTexto(texto, etiqueta = 'p') {
  const elemento = document.createElement(etiqueta);
  elemento.textContent = textoValido(texto);
  return elemento;
}
function cargarImagen(url, alternativo) {
  return new Promise((resolve, reject) => {
    const imagen = new Image();
    const temporizador = setTimeout(() => finalizar(new Error('La imagen tardó demasiado')), 15000);
    function finalizar(error) {
      clearTimeout(temporizador);
      imagen.onload = imagen.onerror = null;
      if (error) { imagen.removeAttribute('src'); reject(error); }
      else resolve(imagen);
    }
    imagen.alt = alternativo;
    imagen.onload = () => finalizar();
    imagen.onerror = () => finalizar(new Error('No se pudo cargar la imagen'));
    imagen.src = url;
  });
}
async function consultarSeccion(nombre, prepararContenido) {
  const seccion = document.getElementById(nombre);
  const boton = seccion.querySelector('button');
  const estado = seccion.querySelector('.estado');
  if (boton.disabled) return;
  boton.disabled = true;
  seccion.setAttribute('aria-busy', 'true');
  estado.classList.remove('error');
  estado.textContent = 'Cargando…';
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), 15000);
  try {
    const response = await fetch(endpoints[nombre], {cache: 'no-store', signal: controlador.signal});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const datos = await response.json();
    clearTimeout(temporizador);
    const elementos = await prepararContenido(datos);
    seccion.querySelector('.contenido').replaceChildren(...elementos);
    estado.textContent = 'Contenido actualizado.';
  } catch (error) {
    estado.classList.add('error');
    estado.textContent = 'No pudimos cargar el contenido. Revisa tu conexión y pulsa el botón para reintentar.';
    console.warn(`Error en ${nombre}:`, error);
  } finally {
    clearTimeout(temporizador);
    boton.disabled = false;
    seccion.setAttribute('aria-busy', 'false');
  }
}
async function obtenerCita() {
  await consultarSeccion('cita', datos => [crearTexto(datos.quote), crearTexto(datos.author, 'cite')]);
}
async function mostrarPerro() {
  await consultarSeccion('perro', async datos => {
    if (datos.status !== 'success') throw new Error('Respuesta de perro inválida');
    return [await cargarImagen(textoValido(datos.message), 'Perro aleatorio proporcionado por Dog CEO')];
  });
}
async function mostrarGato() {
  await consultarSeccion('gato', async datos => {
    const url = datos.url ? new URL(textoValido(datos.url), 'https://cataas.com').href
      : `https://cataas.com/cat/${encodeURIComponent(textoValido(datos.id))}`;
    return [await cargarImagen(url, 'Gato aleatorio proporcionado por CATAAS')];
  });
}
async function mostrarDato() {
  await consultarSeccion('dato', datos => [crearTexto(datos.text)]);
}
for (const [nombre, consultar] of Object.entries({cita: obtenerCita, perro: mostrarPerro, gato: mostrarGato, dato: mostrarDato})) {
  document.querySelector(`#${nombre} button`).addEventListener('click', consultar);
  void consultar();
}
