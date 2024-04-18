<template>
  <div>
    <q-page class="bg-blue window-height window-width row justify-center items-center">
      <div class="column">
        <div class="row">
          <h5 class="text-h3 text-white q-my-md">Prijava</h5>
        </div>
        <div class="row">
          <q-card square bordered class="q-pa-lg shadow-1">
            <q-card-section>
              <q-form class="q-gutter-md">
                <q-input square filled clearable v-model="email" type="email" label="Vaš email" />
                <q-input square filled clearable v-model="lozinka" type="password" label="Lozinka" />
              </q-form>
            </q-card-section>
            <q-card-actions class="q-px-md">
              <q-btn unelevated color="light-blue-7" size="lg" class="full-width" label="Prijava" @click="prijava" />
            </q-card-actions>
            <q-card-actions class="q-px-md">
              <router-link to="/registracija" class="link-style"><p class="text-grey-6">Nemate račun? Registrirajte se ovdje.</p></router-link>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </q-page>

    <!-- Skočni prozor za prikaz poruka -->
    <q-dialog v-model="dialog" persistent>
      <q-card class="bg-white q-pa-md" style="width: 300px;">
        <q-card-section>
          <q-card-title class="text-center">{{ dialogTitle }}</q-card-title>
        </q-card-section>
        <q-card-section>
          <p class="text-center">{{ dialogMessage }}</p>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn color="primary" label="Zatvori" @click="zatvoriDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
// Uvoz funkcije za slanje prijavničkog zahtjeva
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      lozinka: '',
      dialog: false,
      dialogTitle: '',
      dialogMessage: ''
    };
  },
  methods: {
    prijava() {
      // Provjera jesu li svi potrebni podaci poslani
      if (!this.email || !this.lozinka) {
        this.dialogTitle = 'Neuspješna prijava';
        this.dialogMessage = 'Molimo vas da popunite sva polja.';
        this.dialog = true;
        return;
      }

      // Slanje prijavničkog zahtjeva
      axios.post('http://localhost:3000/api/prijava', {
        email: this.email,
        lozinka: this.lozinka
      })
      .then(response => {
        // Ako je prijava uspješna, preusmjeravamo korisnika na početnu stranicu ili neku drugu stranicu
        this.dialogTitle = 'Uspješna prijava';
        this.dialogMessage = 'Dobrodošli nazad!';
        this.dialog = true;
        // Ovdje možete dodati preusmjeravanje na drugu stranicu
      })
      .catch(error => {
        // Ako je prijava neuspješna, prikazujemo odgovarajuću poruku
        if (error.response && error.response.data && error.response.data.message) {
          this.dialogTitle = 'Neuspješna prijava';
          this.dialogMessage = error.response.data.message;
        } else {
          this.dialogTitle = 'Neuspješna prijava';
          this.dialogMessage = 'Došlo je do greške prilikom prijave.';
        }
        this.dialog = true;
        console.error(error);
      });
    },
    zatvoriDialog() {
      // Zatvaranje skočnog prozora za prikaz poruka
      this.dialog = false;
    }
  }
};
</script>
