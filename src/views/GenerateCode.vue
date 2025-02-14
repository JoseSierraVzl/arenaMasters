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
                        <v-btn color="primary" @click.prevent="generarCodigoReferido()" block>
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
        generarRandom(longitud) {
            let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(''),
                result = "";

            for (let i = 0; i < longitud; i++) {
                result += characters.splice(Math.floor(Math.random() * characters.length), 1)[0];
            }
            return result;
        },
        generarCodigoReferido(longitud = 6) {
            const timestamp = Date.now().toString(36);
            const codigoFinal = `${timestamp}-${this.generarRandom(longitud)}`;

            this.codigoReferido = codigoFinal;
        },
    },
};
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí si es necesario */
</style>