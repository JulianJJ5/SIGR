<script setup>
import { reactive, computed } from "vue";
import { db, sesion, mutar } from "../store.js";
import { fechaLocal } from "../db/storage.js";
import { crearReserva, cambiarEstadoReserva, mesasDisponibles, HORARIO } from "../services/reservas.js";

const hoy = fechaLocal();
const form = reactive({ nombreCliente: sesion.value.rol === "cliente" ? sesion.value.nombre : "", telefono: "", fecha: hoy, hora: "19:00", personas: 2 });
const personal = computed(() => sesion.value.rol !== "cliente");

const libres = computed(() => (form.fecha && form.hora && form.personas > 0 ? mesasDisponibles(db, form.fecha, form.hora, Number(form.personas)) : []));
const lista = computed(() =>
  db.reservas
    .filter((r) => personal.value || r.usuarioId === sesion.value.id)
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
);
const mesa = (id) => db.mesas.find((m) => m.id === id)?.numero;

function reservar() {
  const r = mutar((d) => crearReserva(d, { ...form, usuarioId: sesion.value.id }), "Reserva registrada");
  if (r && personal.value) Object.assign(form, { nombreCliente: "", telefono: "" });
}
</script>

<template>
  <div class="dos-columnas">
    <section class="tarjeta">
      <h3>Nueva reserva</h3>
      <form class="rejilla" @submit.prevent="reservar">
        <label>Nombre <input v-model="form.nombreCliente" required /></label>
        <label>Teléfono <input v-model="form.telefono" /></label>
        <label>Fecha <input v-model="form.fecha" type="date" :min="hoy" required /></label>
        <label>Hora <input v-model="form.hora" type="time" :min="HORARIO.apertura" :max="HORARIO.cierre" step="1800" required /></label>
        <label>Personas <input v-model.number="form.personas" type="number" min="1" max="8" required /></label>
        <button type="submit">Reservar</button>
      </form>
      <p class="nota">Horario: {{ HORARIO.apertura }} a {{ HORARIO.cierre }}. Cada reserva ocupa la mesa 2 horas.
        Mesas libres para esa franja: <strong>{{ libres.length ? libres.map((m) => m.numero).join(", ") : "ninguna" }}</strong></p>
    </section>

    <section class="tarjeta">
      <h3>{{ personal ? "Reservas" : "Mis reservas" }}</h3>
      <p v-if="!lista.length" class="nota">No hay reservas.</p>
      <table v-else>
        <thead><tr><th>Fecha</th><th>Hora</th><th>Nombre</th><th>Pers.</th><th>Mesa</th><th>Estado</th><th></th></tr></thead>
        <tbody>
          <tr v-for="r in lista" :key="r.id">
            <td>{{ r.fecha }}</td><td>{{ r.hora }}</td><td>{{ r.nombreCliente }}</td><td>{{ r.personas }}</td><td>{{ mesa(r.mesaId) }}</td>
            <td><span class="estado" :class="r.estado">{{ r.estado }}</span></td>
            <td class="fila">
              <button v-if="personal && r.estado === 'pendiente'" class="mini" @click="mutar((d) => cambiarEstadoReserva(d, r.id, 'confirmada'), 'Reserva confirmada')">Confirmar</button>
              <button v-if="r.estado !== 'cancelada'" class="mini peligro" @click="mutar((d) => cambiarEstadoReserva(d, r.id, 'cancelada'), 'Reserva cancelada')">Cancelar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>
