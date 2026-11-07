// Estado global de la app: la "base de datos" reactiva y la sesión.
import { reactive, ref } from "vue";
import { cargar, guardar, reiniciar, alCambiarEnOtraPestana } from "./db/storage.js";

export const db = reactive(cargar());
export const sesion = ref(JSON.parse(sessionStorage.getItem("sigr_sesion") || "null"));
export const aviso = ref(null);

function reemplazar(nuevo) {
  for (const k of Object.keys(db)) delete db[k];
  Object.assign(db, nuevo);
}

// Ejecuta un cambio sobre la base de datos, lo guarda y muestra el resultado o el error.
export function mutar(fn, mensajeOk) {
  try {
    const r = fn(db);
    guardar(JSON.parse(JSON.stringify(db)));
    if (mensajeOk) mostrar(mensajeOk, "ok");
    return r;
  } catch (e) {
    mostrar(e.message, "error");
    return null;
  }
}

export function mostrar(texto, tipo = "ok") {
  aviso.value = { texto, tipo };
  clearTimeout(mostrar._t);
  mostrar._t = setTimeout(() => (aviso.value = null), 3500);
}

export function entrar(usuario) {
  sesion.value = usuario;
  sessionStorage.setItem("sigr_sesion", JSON.stringify(usuario));
}

export function salir() {
  sesion.value = null;
  sessionStorage.removeItem("sigr_sesion");
}

export function restaurarDatosDemo() {
  reemplazar(reiniciar());
  mostrar("Datos de demostración restaurados", "ok");
}

// "Tiempo real" entre pestañas: si otra pestaña cambia un pedido, esta se actualiza sola.
alCambiarEnOtraPestana((nuevo) => reemplazar(nuevo));
