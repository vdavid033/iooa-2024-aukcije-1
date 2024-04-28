<template>
  <div v-if="!authenticated">
    <q-card :expand="false"></q-card>
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
              <router-link v-if="!authenticated" to="/registracija" class="link-style">
                <p class="text-grey-6">Nemate račun? Registrirajte se ovdje.</p>
              </router-link>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </q-page>
  </div>
  <div v-else>
    <q-page class="bg-blue window-height window-width row justify-center items-center">
      <h5 class="text-h3 text-white q-my-md">Dobrodošli nazad!</h5>
      <q-btn unelevated color="light-blue-7" size="lg" class="full-width" label="Odjava" @click="odjava" />
    </q-page>
  </div>

  <!-- Skočni prozor za prikaz poruka -->

</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      lozinka: '',
      dialog: false,
      dialogTitle: '',
      dialogMessage: '',
      authenticated: false, // Stanje prijavljenosti
    };
  },
  created() {
    // Provjeri prijavu prilikom učitavanja komponente
    this.provjeriPrijavu();
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

      axios.post('http://localhost:3000/api/prijava', {
          email: this.email,
          lozinka: this.lozinka,
        })
        .then((response) => {
          // Provjera je li prijava uspješna
          if (response.data.token) {
            // Ako je prijava uspješna, spremite token u lokalno pohranu ili u globalni state
            const token = response.data.token;
            localStorage.setItem('token', token); // Spremanje tokena u lokalnu pohranu
            // Prikaz poruke o uspješnoj prijavi
            this.dialogTitle = 'Uspješna prijava';
            this.dialogMessage = 'Dobrodošli nazad!';
            this.dialog = true;
            // Postavite zastavicu za označavanje da je korisnik prijavljen
            this.authenticated = true;
            // Preusmjeravanje na početnu stranicu nakon kratkog vremenskog razmaka
            setTimeout(() => {
              this.$router.push("/");
            }, 2000); // 2 sekunde odgode prije preusmjeravanja
          }
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.message) {
            this.dialogTitle = 'Neuspješna prijava';
            this.dialogMessage = error.response.data.message;
          } else {
            this.dialogTitle = 'Neuspješna prijava';
            this.dialogMessage = 'Došlo je do greške prilikom prijave.';
          }
          this.dialog = true;
        });
    },
    odjava() {
      this.authenticated = false; // Postavite na false nakon odjave
      localStorage.removeItem('token'); // Uklonite token iz lokalne pohrane
      this.$router.push('/prijava'); // Preusmjerite na stranicu prijave
    },
    zatvoriDialog() {
      // Zatvaranje skočnog prozora za prikaz poruka
      this.dialog = false;
    },
    provjeriPrijavu() {
      // Provjeri prijavu prilikom učitavanja komponente
      const token = localStorage.getItem('token');
      if (token) {
        // Ako postoji token, korisnik je prijavljen
        this.authenticated = true;
      }
    },
  },
};
</script>








