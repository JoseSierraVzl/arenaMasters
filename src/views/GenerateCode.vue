<template>
    <v-container class="fill-height d-flex justify-center align-center">
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-card class="pa-6 text-center" elevation="10" rounded="lg">
                    <v-card-title class="text-h5 font-weight-bold">
                        Código de Referido
                    </v-card-title>
                    <v-card-text v-if="codigoReferido" class="text-h6 bg-grey rounded-lg pa-2 mx-2">
                        {{ codigoReferido }}
                    </v-card-text>
                    <v-card-actions class="mt-3">
                        <v-btn 
                            color="black" 
                            @click="generarCodigoReferido()" 
                            block
                            rounded="lg" 
                            variant="elevated"
                        >
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