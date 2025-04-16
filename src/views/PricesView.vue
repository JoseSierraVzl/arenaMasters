<template>
    <v-container>
        <v-card class="pa-4">
            <v-card-title class="text-h6">Calculadora de Precios con Envío</v-card-title>

            <v-card-text>
                <v-btn color="primary" @click="agregarProducto" class="mr-2">Agregar Producto</v-btn>
                <v-btn color="success" @click="copiarDatos">Copiar Datos</v-btn>

                <v-textarea v-model="textoProducto"
                    label="Pega aquí el texto del producto (Ej: Id: 23907101\n$2,90 - 400gr)" auto-grow outlined dense
                    class="mt-4" />
                <v-btn color="secondary" class="mt-2" @click="agregarProductoDesdeTexto">Agregar desde texto</v-btn>

                <v-row v-for="(producto, index) in productos" :key="index" class="mt-4" dense>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field v-model.number="producto.id" label="ID Producto" type="number" outlined dense />
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-text-field v-model.number="producto.precio" label="Precio ($)" type="number" outlined
                            dense />
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-text-field v-model.number="producto.peso" label="Peso (g)" type="number" outlined dense />
                    </v-col>

                    <v-col cols="12" sm="6" md="3" class="d-flex align-center">
                        <v-btn color="red" icon @click="eliminarProducto(index)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>


                <v-divider class="my-4" />

                <div style="overflow-x: auto;">
                    <v-list dense class="min-w-[600px]">
                        <v-list-item v-for="(producto, index) in productosCalculados" :key="'res-' + index">
                            <v-list-item-content>
                                <v-list-item-title>
                                    Producto {{ index + 1 }} — ID: {{ producto.id }} — Precio sugerido:
                                    <strong>${{ producto.precioVenta.toFixed(2) }}</strong>
                                    (Costo total: ${{ producto.total.toFixed(2) }})
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    Envío: ${{ producto.envio.toFixed(2) }} | Tipo de ganancia:
                                    <strong>{{ producto.tipoGanancia }}</strong>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </div>


                <v-divider class="my-4" />

                <v-alert type="info" border="left" colored-border elevation="2">
                    <p><strong>Total productos:</strong> ${{ totalProductos.toFixed(2) }}</p>
                    <p><strong>Total sugerido (con ganancia):</strong> ${{ totalVenta.toFixed(2) }}</p>
                    <p><strong>Ganancia estimada:</strong> ${{ (totalVenta - totalProductos).toFixed(2) }}</p>
                </v-alert>

            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            productos: [
                { id: null, precio: null, peso: null }
            ],
            textoProducto: '',
            costoPorLibra: 5.99,
            gramosPorLibra: 453.59
        };
    },
    computed: {
        productosCalculados() {
            return this.productos.map(prod => {
                const pesoLb = prod.peso / this.gramosPorLibra;
                const envio = pesoLb * this.costoPorLibra;
                const total = prod.precio + envio;

                // Regla de ganancia
                let tipoGanancia = '';
                let ganancia = 1;

                if (prod.precio < 10) {
                    tipoGanancia = '50%';
                    ganancia = 1.5;
                } else if (prod.precio >= 10 && prod.precio < 25) {
                    tipoGanancia = '20%';
                    ganancia = 1.2;
                } else if (prod.precio >= 25) {
                    tipoGanancia = '13%';
                    ganancia = 1.13;
                }

                const precioVenta = total * ganancia;

                return { ...prod, envio, total, precioVenta, tipoGanancia };
            });
        },
        totalProductos() {
            return this.productos.reduce((sum, prod) => sum + (prod.precio || 0), 0);
        },
        totalVenta() {
            return this.productosCalculados.reduce((sum, prod) => sum + prod.precioVenta, 0);
        }
    },
    methods: {
        agregarProducto() {
            this.productos.push({ id: null, precio: null, peso: null });
        },
        eliminarProducto(index) {
            this.productos.splice(index, 1);
        },
        agregarProductoDesdeTexto() {
            const datos = this.parsearTextoProducto(this.textoProducto);
            if (datos) {
                this.productos.push(datos);
                this.textoProducto = ''; // limpia el campo
            } else {
                alert('El texto no tiene el formato esperado.');
            }
        },
        parsearTextoProducto(texto) {
            try {
                const idMatch = texto.match(/Id:\s*(\d+)/i);
                const precioMatch = texto.match(/\$(\d+[\.,]?\d*)/);
                const pesoMatch = texto.match(/(\d+)\s*(gr|g)/i);

                if (!idMatch || !precioMatch || !pesoMatch) return null;

                const id = parseInt(idMatch[1]);
                const precio = parseFloat(precioMatch[1].replace(',', '.'));
                const peso = parseInt(pesoMatch[1]);

                return { id, precio, peso };
            } catch (e) {
                return null;
            }
        },
        copiarDatos() {
            const resumenFinal = `Total: ${this.totalVenta.toFixed(2).replace('.', ',')}$\nPrimer pago: ${this.totalProductos.toFixed(2).replace('.', ',')}$\nSegundo pago: ${(this.totalVenta - this.totalProductos).toFixed(2).replace('.', ',')}$`;
            this.copiarAlPortapapeles(resumenFinal);
        },

        copiarAlPortapapeles(texto) {
            const el = document.createElement('textarea');
            el.value = texto;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            alert('Datos copiados al portapapeles');
        }
    }
};
</script>
