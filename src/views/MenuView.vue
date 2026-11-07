<script setup>
import { ref, reactive, computed } from "vue";
import { db, sesion, mutar } from "../store.js";
import * as menu from "../services/menu.js";
import { crearPedido } from "../services/pedidos.js";
import { pesos } from "../services/caja.js";

const emit = defineEmits(["ir"]);
const esAdmin = computed(() => sesion.value.rol === "administrador");
const categorias = computed(() => menu.menuPorCategoria(db, !esAdmin.value));

// ----- Carrito para crear pedidos -----
const carrito = reactive({});
const mesaId = ref("");
const observaciones = ref("");
const lineasCarrito = computed(() =>
  Object.entries(carrito)
    .filter(([, c]) => c > 0)
    .map(([id, cantidad]) => {
      const p = db.platos.find((x) => x.id === Number(id));
      return { platoId: p.id, nombre: p.nombre, cantidad, subtotal: p.precio * cantidad };
    })
);
const totalCarrito = computed(() => lineasCarrito.value.reduce((s, l) => s + l.subtotal, 0));
const agregar = (p) => (carrito[p.id] = (carrito[p.id] || 0) + 1);
const quitar = (p) => (carrito[p.id] = Math.max(0, (carrito[p.id] || 0) - 1));

function enviarPedido() {
  const pedido = mutar(
    (d) => crearPedido(d, {
      items: lineasCarrito.value.map(({ platoId, cantidad }) => ({ platoId, cantidad })),
      mesaId: mesaId.value ? Number(mesaId.value) : null,
      usuarioId: sesion.value.id,
      observaciones: observaciones.value,
    }),
    "Pedido enviado a cocina"
  );
  if (pedido) {
    Object.keys(carrito).forEach((k) => delete carrito[k]);
    observaciones.value = "";
    emit("ir", "pedidos");
  }
}

// ----- CRUD (administrador) -----
const nuevaCategoria = ref("");
const formPlato = reactive({ id: null, nombre: "", descripcion: "", precio: "", categoriaId: "", disponible: true });
function limpiarPlato() { Object.assign(formPlato, { id: null, nombre: "", descripcion: "", precio: "", categoriaId: "", disponible: true }); }
function editar(p) { Object.assign(formPlato, { ...p }); window.scrollTo({ top: 0, behavior: "smooth" }); }
function guardarPlato() {
  const ok = formPlato.id
    ? mutar((d) => menu.editarPlato(d, formPlato.id, formPlato), "Plato actualizado")
    : mutar((d) => menu.crearPlato(d, formPlato), "Plato creado");
  if (ok) limpiarPlato();
}
function crearCategoria() { if (mutar((d) => menu.crearCategoria(d, nuevaCategoria.value), "Categoría creada")) nuevaCategoria.value = ""; }
function renombrar(c) {
  const nombre = prompt("Nuevo nombre de la categoría", c.nombre);
  if (nombre) mutar((d) => menu.editarCategoria(d, c.id, nombre), "Categoría actualizada");
}
</script>

<template>
  <div class="dos-columnas">
    <section>
      <div v-if="esAdmin" class="tarjeta">
        <h3>{{ formPlato.id ? "Editar plato" : "Nuevo plato" }}</h3>
        <form class="rejilla" @submit.prevent="guardarPlato">
          <label>Nombre <input v-model="formPlato.nombre" required /></label>
          <label>Precio (COP) <input v-model="formPlato.precio" type="number" min="1" required /></label>
          <label>Categoría
            <select v-model.number="formPlato.categoriaId" required>
              <option value="" disabled>Seleccione…</option>
              <option v-for="c in db.categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
            </select>
          </label>
          <label>Descripción <input v-model="formPlato.descripcion" /></label>
          <label class="check"><input v-model="formPlato.disponible" type="checkbox" /> Disponible</label>
          <div class="fila">
            <button type="submit">{{ formPlato.id ? "Guardar cambios" : "Crear plato" }}</button>
            <button v-if="formPlato.id" type="button" class="secundario" @click="limpiarPlato">Cancelar</button>
          </div>
        </form>
        <h3>Categorías</h3>
        <form class="fila" @submit.prevent="crearCategoria">
          <input v-model="nuevaCategoria" placeholder="Nueva categoría" />
          <button type="submit">Agregar</button>
        </form>
      </div>

      <div v-for="c in categorias" :key="c.id" class="tarjeta">
        <div class="fila entre">
          <h3>{{ c.nombre }}</h3>
          <div v-if="esAdmin" class="fila">
            <button class="mini secundario" @click="renombrar(c)">Renombrar</button>
            <button class="mini peligro" @click="mutar((d) => menu.eliminarCategoria(d, c.id), 'Categoría eliminada')">Eliminar</button>
          </div>
        </div>
        <p v-if="!c.platos.length" class="nota">Sin platos.</p>
        <div v-for="p in c.platos" :key="p.id" class="plato" :class="{ apagado: !p.disponible }">
          <div>
            <strong>{{ p.nombre }}</strong> <span v-if="!p.disponible" class="etiqueta">no disponible</span>
            <div class="nota">{{ p.descripcion }}</div>
          </div>
          <div class="fila">
            <span class="precio">{{ pesos(p.precio) }}</span>
            <template v-if="esAdmin">
              <button class="mini secundario" @click="editar(p)">Editar</button>
              <button class="mini peligro" @click="mutar((d) => menu.eliminarPlato(d, p.id), 'Plato eliminado')">Eliminar</button>
            </template>
            <template v-else>
              <button class="mini secundario" @click="quitar(p)">−</button>
              <span class="cantidad">{{ carrito[p.id] || 0 }}</span>
              <button class="mini" @click="agregar(p)">+</button>
            </template>
          </div>
        </div>
      </div>
    </section>

    <aside v-if="!esAdmin" class="tarjeta carrito">
      <h3>Pedido actual</h3>
      <p v-if="!lineasCarrito.length" class="nota">Agregue platos con el botón +.</p>
      <div v-for="l in lineasCarrito" :key="l.platoId" class="fila entre">
        <span>{{ l.cantidad }} × {{ l.nombre }}</span><span>{{ pesos(l.subtotal) }}</span>
      </div>
      <hr />
      <div class="fila entre total"><span>Total</span><span>{{ pesos(totalCarrito) }}</span></div>
      <label v-if="sesion.rol === 'mesero'">Mesa
        <select v-model="mesaId">
          <option value="">Para llevar</option>
          <option v-for="m in db.mesas" :key="m.id" :value="m.id">Mesa {{ m.numero }} ({{ m.capacidad }} pers.)</option>
        </select>
      </label>
      <label>Observaciones <input v-model="observaciones" placeholder="Sin cebolla, etc." /></label>
      <button :disabled="!lineasCarrito.length" @click="enviarPedido">Enviar pedido</button>
    </aside>
  </div>
</template>
