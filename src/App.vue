<template>
  <v-app>
    <v-app-bar app color="black" dark>
      <v-toolbar-title class="font-weight-bold">ArenaMaster</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn :variant="!isActive('/generate-code') ? 'outlined' : 'flat'" rounded="lg" to="/generate-code">
        Generar Código
      </v-btn>
      <v-btn :variant="!isActive('/users') ? 'outlined' : 'flat'" rounded="lg" to="/users" class="mx-6">
        Usuarios
      </v-btn>
      <v-btn :variant="!isActive('/tournaments') ? 'outlined' : 'flat'" rounded="lg" to="/tournaments" class="mr-6">
        Torneos
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  methods: {
    isActive(route) {
      return this.$route.path === route;
    }
  }
};
</script>
