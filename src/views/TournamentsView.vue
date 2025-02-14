<template>
    <v-card class="px-2 pt-6" flat>
        <v-card-text>
            <v-data-table :headers="headers" :items="tournaments" class="elevation-1">
                <template v-slot:top class="bg-black">
                    <v-toolbar flat>
                        <v-toolbar-title class="font-weight-bold">Torneos</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer />
                        <v-btn variant="outlined" color="black" @click="openCreateDialog">
                            <font-awesome-icon :icon="faPenToSquare" class="mr-2" />
                            Nuevo Torneo
                        </v-btn>
                    </v-toolbar>
                </template>
                <template v-slot:item.startDate="{ item }">
                    {{ new Date(item.startDate).toLocaleDateString() }}
                </template>
                <template v-slot:item.endDate="{ item }">
                    {{ new Date(item.endDate).toLocaleDateString() }}
                </template>
                <template v-slot:item.state="{ item }">
                    <v-chip :color="getStateColor(item.state)" dark>
                        {{ item.state }}
                    </v-chip>
                </template>

                <template v-slot:item.participants="{ item }">
                    {{ item.participants.length }} Participantes
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-btn color="blue" @click="openEditDialog(item)" small class="mr-2">
                        <font-awesome-icon :icon="faEdit" class="mr-1" />
                        Editar
                    </v-btn>
                    <v-btn color="green" @click="openManageParticipantsDialog(item)" small>
                        <font-awesome-icon :icon="faUsers" class="mr-1" />
                        Participantes
                    </v-btn>
                </template>
            </v-data-table>
        </v-card-text>

        <!-- Modal para crear torneo -->
        <v-dialog v-model="dialogCreate" max-width="600px">
            <v-card>
                <v-card-title>
                    Crear Torneo
                </v-card-title>

                <v-card-text>
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-select v-model="form.category" :items="categories" label="Categoría" required
                            class="mb-4"></v-select>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="form.startDate" type="date" label="Fecha de Inicio"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="form.endDate" type="date" label="Fecha de Fin"
                                    required></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="form.startTime" type="time" label="Hora de Inicio"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="form.endTime" type="time" label="Hora de Fin"
                                    required></v-text-field>
                            </v-col>
                        </v-row>

                        <v-select v-model="form.participants" :items="users" item-title="name" item-value="id"
                            label="Seleccionar Participantes" multiple required class="mb-4">
                        </v-select>

                        <v-select v-model="form.state" :items="['En progreso', 'Finalizado']" label="Estado" required
                            class="mb-4"></v-select>
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-btn color="grey" @click="dialogCreate = false">Cancelar</v-btn>
                    <v-btn color="primary" @click="createTournament" :disabled="!valid">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Modal para editar torneo -->
        <v-dialog v-model="dialogEdit" max-width="600px">
            <v-card>
                <v-card-title>
                    Editar Torneo
                </v-card-title>

                <v-card-text>
                    <v-form ref="editForm" v-model="editValid" lazy-validation>
                        <v-select v-model="editForm.category" :items="categories" label="Categoría" required
                            class="mb-4"></v-select>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="editForm.startDate" type="date" label="Fecha de Inicio"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="editForm.endDate" type="date" label="Fecha de Fin"
                                    required></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="editForm.startTime" type="time" label="Hora de Inicio"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="editForm.endTime" type="time" label="Hora de Fin"
                                    required></v-text-field>
                            </v-col>
                        </v-row>

                        <v-select v-model="editForm.state" :items="['En progreso', 'Finalizado']" label="Estado"
                            required class="mb-4"></v-select>
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-btn color="grey" @click="dialogEdit = false">Cancelar</v-btn>
                    <v-btn color="primary" @click="updateTournament" :disabled="!editValid">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Modal para agregar/eliminar participantes -->
        <v-dialog v-model="dialogManageParticipants" max-width="600px">
            <v-card>
                <v-card-title>
                    Gestionar Participantes
                </v-card-title>

                <v-card-text>
                    <v-select v-model="selectedParticipants" :items="availableUsers" item-title="name" item-value="id"
                        return-object label="Seleccionar Participantes" multiple class="mb-4">
                    </v-select>
                    <v-sheet max-height="300px" class="overflow-y-auto">
                        <v-list dense>
                            <v-list-item v-for="(participant, index) in selectedParticipantsDetails"
                                :key="participant.id">
                                <v-card class="w-100 pa-2 mb-2">
                                    <v-row align="center">
                                        <v-col cols="10">
                                            <v-list-item-title class="font-weight-bold">
                                                {{ participant.name }}
                                            </v-list-item-title>
                                        </v-col>

                                        <v-col cols="2" class="text-right">
                                            <v-btn icon color="red" @click="removeParticipant(participant.id)">
                                                <font-awesome-icon :icon="faTrash" />
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-list-item>
                        </v-list>
                    </v-sheet>


                </v-card-text>

                <v-card-actions>
                    <v-btn color="grey" @click="dialogManageParticipants = false">Cancelar</v-btn>
                    <v-btn color="primary" @click="updateParticipants">
                        <font-awesome-icon :icon="faSave" class="mr-1" />
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
import { db, collection, getDocs, addDoc, updateDoc, doc } from '../firebase.js';
import { ref, reactive, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPenToSquare, faTrash, faUsers, faSave, faEdit } from '@fortawesome/free-solid-svg-icons';

export default {
    components: {
        FontAwesomeIcon
    },
    data() {
        return {
            valid: false,
            editValid: false,
            dialogCreate: false,
            dialogEdit: false,
            dialogManageParticipants: false,
            users: [],
            tournaments: [],
            selectedTournament: null,
            selectedParticipants: [],
            categories: [
                'Novato, Veterano, Elite',
                'Profesional, Maestro',
                'Gran Maestro, Leyenda',
                'Mixto'
            ],
            headers: [
                { title: "Categoría", value: "category" },
                { title: "Inicio", value: "startDate" },
                { title: "Fin", value: "endDate" },
                { title: "Estado", value: "state" },
                { title: "Participantes", value: "participants" },
                { title: "Acciones", value: "actions", sortable: false }
            ],
            form: reactive({
                category: '',
                startDate: '',
                endDate: '',
                startTime: '',
                endTime: '',
                participants: [],
                state: 'En progreso'
            }),
            editForm: reactive({
                category: '',
                startDate: '',
                endDate: '',
                startTime: '',
                endTime: '',
                state: 'En progreso'
            }),
            faPenToSquare,
            faTrash,
            faUsers,
            faSave,
            faEdit
        };
    },
    computed: {
        selectedParticipantsDetails() {
            return this.selectedParticipants.map(participant => {
                if (typeof participant === "object") {
                    return participant;
                }

                const user = this.users.find(user => user.id === participant);

                return user ? user : { id: participant, name: participant.name || "Nombre no disponible" };
            });
        },

        availableUsers() {
            return this.users.filter(user => !this.selectedParticipants.includes(user.id));
        }
    },
    methods: {
        getStateColor(state) {
            const colors = {
                "En progreso": "green",
                "Finalizado": "red"
            };
            return colors[state] || "grey";
        },
        async fetchUsers() {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                this.users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            }
        },

        async fetchTournaments() {
            try {
                const querySnapshot = await getDocs(collection(db, 'tournaments'));
                this.tournaments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (error) {
                console.error("Error al cargar torneos:", error);
            }
        },

        async createTournament() {
            if (this.$refs.form.validate()) {
                try {
                    const tournamentData = {
                        category: this.form.category,
                        startDate: this.form.startDate,
                        endDate: this.form.endDate,
                        startTime: this.form.startTime,
                        endTime: this.form.endTime,
                        participants: this.form.participants,
                        state: this.form.state,
                        createdAt: new Date().toISOString()
                    };

                    await addDoc(collection(db, 'tournaments'), tournamentData);

                    this.dialogCreate = false;
                    this.fetchTournaments();
                } catch (error) {
                    console.error("Error al crear torneo:", error);
                }
            }
        },

        async updateTournament() {
            if (this.$refs.editForm.validate()) {
                try {
                    const docRef = doc(db, "tournaments", this.selectedTournament.id);
                    await updateDoc(docRef, {
                        category: this.editForm.category,
                        startDate: this.editForm.startDate,
                        endDate: this.editForm.endDate,
                        startTime: this.editForm.startTime,
                        endTime: this.editForm.endTime,
                        state: this.editForm.state
                    });

                    this.dialogEdit = false;
                    this.fetchTournaments();
                } catch (error) {
                    console.error("Error al actualizar torneo:", error);
                }
            }
        },

        async removeParticipant(participantId) {

            console.log(participantId)

            this.selectedParticipants = this.selectedParticipants.filter(participant => participant.id !== participantId);

            try {
                const docRef = doc(db, "tournaments", this.selectedTournament.id);
                await updateDoc(docRef, {
                    participants: this.selectedParticipants
                });

                this.fetchTournaments();
            } catch (error) {
                console.error("Error al eliminar participante:", error);
            }
        },

        async updateParticipants() {
            if (this.selectedTournament) {
                try {
                    const docRef = doc(db, "tournaments", this.selectedTournament.id);
                    await updateDoc(docRef, {
                        participants: this.selectedParticipants
                    });

                    this.dialogManageParticipants = false;
                    this.fetchTournaments();
                } catch (error) {
                    console.error("Error al actualizar participantes:", error);
                }
            }
        },

        openCreateDialog() {
            this.form = reactive({
                category: '',
                startDate: '',
                endDate: '',
                startTime: '',
                endTime: '',
                participants: [],
                state: 'En progreso'
            });
            this.dialogCreate = true;
        },

        openEditDialog(tournament) {
            this.selectedTournament = tournament;
            this.editForm = reactive({
                category: tournament.category,
                startDate: tournament.startDate,
                endDate: tournament.endDate,
                startTime: tournament.startTime,
                endTime: tournament.endTime,
                state: tournament.state
            });
            this.dialogEdit = true;
        },

        openManageParticipantsDialog(tournament) {
            this.selectedTournament = tournament;
            this.selectedParticipants = [...tournament.participants];
            this.dialogManageParticipants = true;
        },
    },

    mounted() {
        this.fetchUsers();
        this.fetchTournaments();
    }
};
</script>