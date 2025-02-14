<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Mi Aplicación</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/generate-code">Generar Código</v-btn>
      <v-btn text to="/users">Usuarios</v-btn>
      <v-btn text to="/tournaments">Torneos</v-btn>
    </v-app-bar>
    <v-main>
      <router-view></router-view> <!-- Aquí se renderizan las vistas -->
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>
