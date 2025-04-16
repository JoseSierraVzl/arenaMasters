<template>
    <v-card class="px-2 pt-6" flat>
        <v-row>
            <v-col cols="12" md="2" class="md:mb-0">
                <v-select v-model="searchType" :items="searchOptions" variant="outlined" label="Buscar por"
                    class="rounded-lg" density="compact" hide-details dense />
            </v-col>

            <v-col cols="12" md="6" class="md:mb-0">
                <v-text-field v-model="search" append-icon="mdi-magnify" class="rounded-lg" variant="outlined"
                    label="Buscar" density="compact" single-line hide-details dense />
            </v-col>

            <v-col cols="12" md="2">
                <v-btn variant="outlined" color="black" @click="openDialog()" class="w-full">
                    Agregar Usuario
                </v-btn>
            </v-col>

            <v-col cols="12" md="2">
                <v-btn variant="outlined" color="red" @click="clearPayments()" class="w-full">
                    Limpiar Pagos
                </v-btn>
            </v-col>
        </v-row>
        <v-data-table :headers="headers" :items="filteredUsers" :items-per-page="5" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title class="font-weight-bold">Usuarios</v-toolbar-title>
                </v-toolbar>
            </template>
            <template v-slot:item.esReferido="{ item }">
                <span v-if="item.referredBy">{{ item.referredBy }}</span>
                <span v-else>No referido</span>
            </template>
            <template v-slot:item.registeredAt="{ item }">
                {{ new Date(item.registeredAt).toLocaleString() }}
            </template>

            <template v-slot:item.pago="{ item }">
                <span>{{ item.pago ? 'Pago' : 'No pago'}}</span>
            </template>

            <template v-slot:item.monto="{ item }">
                <span>{{ item.monto}}</span>
            </template>

            <template v-slot:item.rango="{ item }">
                <span>{{ item.rango}}</span>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-btn density="compact" @click="editUser(item)">
                    <template v-slot:prepend>
                        <font-awesome-icon :icon="['fas', 'pen-to-square']" />
                    </template>
                </v-btn>

                <v-btn density="compact" color="red" @click="deleteUser(item.id)">
                    <template v-slot:prepend>
                        <font-awesome-icon :icon="['fas', 'trash']" />
                    </template>
                </v-btn>
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title>
                    {{ isEditing ? 'Editar Usuario' : 'Agregar Usuario' }}
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="form.name" label="Nombre" required></v-text-field>
                    <v-text-field v-model="form.username" label="Usuario" required></v-text-field>
                    <v-text-field v-model="form.phone" label="Teléfono" required></v-text-field>
                    <v-text-field v-model="form.kills" label="Kills Acumuladas" type="number"></v-text-field>
                    <v-text-field v-model="form.referralCode" label="Código de Referido"></v-text-field>
                    <v-text-field v-model="form.referredBy" label="Código de Referido Por (Opcional)"></v-text-field>
                    <v-select v-model="form.rango" :items="rangos" label="Rango" required class="mb-4"></v-select>
                    <v-checkbox v-model="form.pago" label="Pago"></v-checkbox>
                    <v-text-field v-model="form.monto" label="Monto" type="number" :disabled="!form.pago"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="grey" @click="dialog = false">Cancelar</v-btn>
                    <v-btn color="primary" @click="saveUser">{{ isEditing ? 'Guardar Cambios' : 'Agregar' }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from '../firebase.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

library.add(faPenToSquare, faTrash);

export default {
    components: {
        FontAwesomeIcon
    },
    data() {
        return {
            search: "",
            searchType: "id",
            searchOptions: [
                { title: "ID", value: "id" },
                { title: "Usuario", value: "username" },
                { title: "Código de Referido", value: "referralCode" },
                { title: "Es Referido", value: "referredBy" },
                { title: "Pago", value: "pago" }
            ],
            headers: [
                { title: 'ID', value: 'id', align: 'start', sortable: true },
                { title: 'Nombre', value: 'name', align: 'start', sortable: true },
                { title: 'Usuario', value: 'username', align: 'start', sortable: true },
                { title: 'Teléfono', value: 'phone', align: 'start', sortable: true },
                { title: 'Kills Acumuladas', value: 'kills', align: 'start', sortable: true },
                { title: 'Pago', value: 'pago', align: 'center', sortable: false },
                { title: 'Monto', value: 'monto', align: 'center', sortable: false },
                { title: 'Rango', value: 'rango', align: 'center', sortable: false },
                { title: 'Código de Referido', value: 'referralCode', align: 'start', sortable: true },
                { title: 'Es Referido', value: 'esReferido', align: 'start', sortable: false },
                { title: 'Registrado en', value: 'registeredAt', align: 'start', sortable: true },
                { title: 'Acciones', value: 'actions', align: 'center', sortable: false }
            ],
            users: [],
            dialog: false,
            form: { id: null, name: '', username: '', phone: '', kills: 0, pago: false, monto: 0, referralCode: '', referredBy: '', rango: '' },
            isEditing: false,
            rangos: [
                { title: "Novato", value: "novato" },
                { title: "Veterano", value: "Veterano" },
                { title: "Elite", value: "Elite" },
                { title: "Profesional", value: "profesional" },
                { title: "Maestro", value: "maestro" },
                { title: "Gran maestro", value: "gran maestro" },
                { title: "Leyenda", value: "leyenda" },
            ]
        };
    },
    computed: {
        filteredUsers() {
            if (!this.search) return this.users;
            const searchTerm = this.search.toLowerCase();
            return this.users.filter(user => {
                const fieldValue = user[this.searchType]?.toString().toLowerCase() || "";
                return fieldValue.includes(searchTerm);
            });
        }
    },
    methods: {
        async fetchUsers() {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                this.users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log("Usuarios cargados:", this.users);
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            }
        },

        async saveUser() {
            try {
                const { id, username, referralCode, ...userData } = this.form;
                const isEditing = !!id;

                const existingUser = this.users.find(user => user.username === username && user.id !== id);
                const existingReferral = referralCode
                    ? this.users.find(user => user.referralCode === referralCode && user.id !== id)
                    : null;

                if (existingUser) throw new Error("El usuario ya existe.");
                if (existingReferral) throw new Error("El código de referido ya está en uso.");

                if (isEditing) {
                    const userRef = doc(db, 'users', id);
                    const userSnapshot = await getDoc(userRef);

                    if (!userSnapshot.exists()) throw new Error("Usuario no encontrado en la base de datos.");

                    await updateDoc(userRef, { username, referralCode, ...userData });
                } else {
                    const newUser = {
                        username,
                        referralCode,
                        ...userData,
                        registeredAt: new Date().toISOString()
                    };

                    const docRef = await addDoc(collection(db, 'users'), newUser);
                    const newUserId = docRef.id;

                    await updateDoc(doc(db, 'users', newUserId), { id: newUserId });

                    this.users.push({ id: newUserId, ...newUser });
                }

                this.dialog = false;
                this.resetForm();
                this.fetchUsers();
            } catch (error) {
                console.error("Error al guardar usuario:", error.message);
            }
        },

        editUser(user) {
            this.form = { ...user };
            this.isEditing = true;
            this.dialog = true;
        },

        async deleteUser(id) {
            try {
                const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este usuario?");
                if (!confirmDelete) return;

                const userRef = doc(db, 'users', id);
                await deleteDoc(userRef);
                this.users = this.users.filter(user => user.id !== id);
                console.log(`Usuario con ID ${id} eliminado correctamente.`);
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
            }
        },

        resetForm() {
            this.form = { id: null, name: '', username: '', phone: '', kills: 0, pago: false, monto: 0, referralCode: '', referredBy: '', rango: '' };
            this.isEditing = false;
        },

        openDialog() {
            this.resetForm();
            this.dialog = true;
        },

        async clearPayments() {
            try {
                const confirmClear = confirm("¿Estás seguro de que deseas limpiar los pagos de todos los usuarios?");
                if (!confirmClear) return;

                const usersToUpdate = this.users.filter(user => user.pago);

                for (const user of usersToUpdate) {
                    const userRef = doc(db, 'users', user.id);
                    await updateDoc(userRef, { pago: false, monto: 0 });
                }

                this.fetchUsers();
                console.log("Pagos limpiados correctamente.");
            } catch (error) {
                console.error("Error al limpiar pagos:", error);
            }
        }
    },

    mounted() {
        this.fetchUsers();
    }
};
</script>

<style scoped></style>