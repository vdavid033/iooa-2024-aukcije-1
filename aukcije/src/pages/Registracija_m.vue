<template>
  <div>
    <q-page class="bg-blue window-height window-width row justify-center items-center">
      <div class="column">
        <div class="row">
          <h5 class="text-h3 text-white q-my-md">Registracija</h5>
        </div>
        <div class="row">
          <q-card square bordered class="q-pa-lg shadow-1">
            <q-card-section>
              <q-form class="q-gutter-md">
                <q-input square filled clearable v-model="ime_korisnika" type="text" label="Vaše ime" />
                <q-input square filled clearable v-model="prezime_korisnika" type="text" label="Vaše prezime" />
                <q-input square filled clearable v-model="email" type="email" label="Vaš email" />
                <q-input square filled clearable v-model="lozinka" type="password" label="Lozinka" />
                <!-- Dodano polje za unos adrese -->
                <q-input square filled clearable v-model="adresa_korisnika" type="text" label="Vaša adresa" />
              </q-form>
            </q-card-section>
            <q-card-actions class="q-px-md">
              <q-btn unelevated color="light-blue-7" size="lg" class="full-width" label="Registracija" @click="registracija" />
            </q-card-actions>
            <q-card-actions class="q-px-md">
              <q-btn unelevated color="light-blue-7" size="lg" class="full-width" label="Prijava" @click="prijava" />
            </q-card-actions>
            <q-card-section class="text-center q-pa-none">
              <router-link to="/" class="link-style"><p class="text-grey-6">Nastavi kao gost</p></router-link>
            </q-card-section>
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
// Uvoz funkcije za slanje registracijskog zahtjeva
import axios from 'axios';

export default {
  data() {
    return {
      ime_korisnika: '',
      prezime_korisnika: '',
      email: '',
      lozinka: '',
      adresa_korisnika: '',
      dialog: false,
      dialogTitle: '',
      dialogMessage: ''
    };
  },
  methods: {
    registracija() {
      // Provjera jesu li sva polja popunjena
      if (!this.ime_korisnika || !this.prezime_korisnika || !this.email || !this.lozinka || !this.adresa_korisnika) {
        this.dialogTitle = 'Neuspješna registracija';
        this.dialogMessage = 'Molimo vas da popunite sva polja.';
        this.dialog = true;
        return;
      }

      // Provjera formata emaila
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.dialogTitle = 'Neuspješna registracija';
        this.dialogMessage = 'Unesena e-mail adresa nije valjana.';
        this.dialog = true;
        return;
      }

      // Provjera sadržaja imena i prezimena (samo slova i razmaci)
      const nameRegex = /^[a-zA-ZčćžšđČĆŽŠĐ\s]*$/;
      if (!nameRegex.test(this.ime_korisnika) || !nameRegex.test(this.prezime_korisnika)) {
        this.dialogTitle = 'Neuspješna registracija';
        this.dialogMessage = 'Ime i prezime mogu sadržavati samo slova.';
        this.dialog = true;
        return;
      }

      // Provjera duljine lozinke
      if (this.lozinka.length < 4) {
        this.dialogTitle = 'Neuspješna registracija';
        this.dialogMessage = 'Lozinka mora sadržavati barem 4 znaka.';
        this.dialog = true;
        return;
      }

      // Slanje registracijskog zahtjeva
      axios.post('http://localhost:3000/api/registracija', {
        ime_korisnika: this.ime_korisnika,
        prezime_korisnika: this.prezime_korisnika,
        email: this.email,
        lozinka: this.lozinka,
        adresa_korisnika: this.adresa_korisnika
      })
      .then(response => {
        // Ako je registracija uspješna, postavljamo poruku za skočni prozor
        this.dialogTitle = 'Uspješna registracija';
        this.dialogMessage = 'Vaš račun je uspješno kreiran.';
        this.dialog = true;
      })
      .catch(error => {
            // Ako je registracija neuspješna, postavljamo odgovarajuću poruku za skočni prozor
    if (error.response && error.response.data && error.response.data.message) {
      this.dialogTitle = 'Neuspješna registracija';
      this.dialogMessage = 'Došlo je do greške prilikom registracije: ' + error.response.data.message;
    } else if (error.request) {
      this.dialogTitle = 'Neuspješna registracija';
      this.dialogMessage = 'Nije primljen odgovor od servera.' + error.response.data; 
    } else {
      this.dialogTitle = 'Neuspješna registracija';
      this.dialogMessage = 'Došlo je do greške prilikom slanja zahtjeva.';
    }
    this.dialog = true;
    console.error(error);
  });
},

    prijava() {
      // Logika za prijavu korisnika
      console.log('Prijavljivanje korisnika:', this.email, this.lozinka);
    },
    zatvoriDialog() {
      // Zatvaranje skočnog prozora
      this.dialog = false;
    }
  }
};
</script>

