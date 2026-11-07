<script setup>
import { ref, computed } from "vue";
import { sesion, salir, aviso } from "./store.js";
import { PERMISOS } from "./services/auth.js";
import LoginForm from "./components/LoginForm.vue";
import MenuView from "./views/MenuView.vue";
import PedidosView from "./views/PedidosView.vue";
import ReservasView from "./views/ReservasView.vue";
import CajaView from "./views/CajaView.vue";
import UsuariosView from "./views/UsuariosView.vue";

const SECCIONES = {
  menu: { titulo: "Menú", vista: MenuView },
  pedidos: { titulo: "Pedidos", vista: PedidosView },
  reservas: { titulo: "Reservas", vista: ReservasView },
  caja: { titulo: "Caja y reportes", vista: CajaView },
  usuarios: { titulo: "Usuarios", vista: UsuariosView },
};

const actual = ref("menu");
const permitidas = computed(() => (sesion.value ? PERMISOS[sesion.value.rol] : []));
const vista = computed(() => {
  if (!permitidas.value.includes(actual.value)) actual.value = permitidas.value[0];
  return SECCIONES[actual.value]?.vista;
});
</script>

<template>
  <header class="barra">
    <div class="marca">🍽️ SIGR <small>Sistema Integral de Gestión de Restaurante</small></div>
    <div v-if="sesion" class="usuario">
      {{ sesion.nombre }} · <span class="rol">{{ sesion.rol }}</span>
      <button class="secundario" @click="salir">Salir</button>
    </div>
  </header>

  <LoginForm v-if="!sesion" />

  <template v-else>
    <nav class="pestanas">
      <button
        v-for="s in permitidas"
        :key="s"
        :class="{ activa: s === actual }"
        @click="actual = s"
      >{{ SECCIONES[s].titulo }}</button>
    </nav>
    <main><component :is="vista" @ir="actual = $event" /></main>
  </template>

  <div v-if="aviso" class="aviso" :class="aviso.tipo">{{ aviso.texto }}</div>
  <footer>SIGR v1.1.1 · prototipo académico · fotos de <a href="https://www.pexels.com" target="_blank" rel="noopener">Pexels</a></footer>
</template>
