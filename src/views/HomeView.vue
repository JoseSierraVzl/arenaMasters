<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title class="text-h5">Generar Código de Referido</v-card-title>
          <v-card-text>
            <v-text-field v-model="codigoReferido" label="Código de Referido" readonly outlined
              class="mt-4"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="generarCodigoReferido" block>
              Generar Nuevo Código
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      codigoReferido: '',
    };
  },
  methods: {
    generarCodigoReferido(longitud = 8) {
      const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let codigo = '';
      const timestamp = Date.now().toString(36);

      for (let i = 0; i < longitud; i++) {
        const randomIndex = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres[randomIndex];
      }

      codigo = timestamp + '-' + codigo;

      this.codigoReferido = codigo;
    },
  },
};
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí si es necesario */
</style>