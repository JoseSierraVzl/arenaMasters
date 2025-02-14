<template>
  <v-app>
    <v-app-bar app color="black" dark>
      <v-toolbar-title class="font-weight-bold">ArenaMaster</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn :variant="!isActive('/generate-code') ? 'outlined' : 'flat'" rounded="lg" to="/generate-code"
        class="hidden-sm-and-down">
        Generar Código
      </v-btn>
      <v-btn :variant="!isActive('/users') ? 'outlined' : 'flat'" rounded="lg" to="/users"
        class="mx-6 hidden-sm-and-down">
        Usuarios
      </v-btn>
      <v-btn :variant="!isActive('/tournaments') ? 'outlined' : 'flat'" rounded="lg" to="/tournaments"
        class="mr-6 hidden-sm-and-down">
        Torneos
      </v-btn>

      <v-menu v-if="$vuetify.display.smAndDown">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <font-awesome-icon :icon="['fa', 'bars']" />
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/generate-code">
            <v-list-item-title>Generar Código</v-list-item-title>
          </v-list-item>
          <v-list-item to="/users">
            <v-list-item-title>Usuarios</v-list-item-title>
          </v-list-item>
          <v-list-item to="/tournaments">
            <v-list-item-title>Torneos</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

library.add(faBars);

export default {
  name: 'App',
  components: {
    FontAwesomeIcon
  },
  methods: {
    isActive(route) {
      return this.$route.path === route;
    }
  }
};
</script>