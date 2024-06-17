<template>
  <q-card class="q-pa-sm q-gutter-sm" flat bordered>
    <q-card-section>
      <div class="text-h3 text-bold text-center text-blue-7 q-ml-sm">
        Postavi aukciju
        <div class="q-ml-sm flex justify-end q-gutter-sm">
          <q-btn
            size="15px"
            name="send"
            rel="stylesheet"
            to="/IndexPage"
            color="red"
            label="Natrag"
          />
        </div>
      </div>
    </q-card-section>
    <q-separator color="red" />
    <div class="q-ml-sm flex flex-start q-gutter-sm">
      <div style="width: 500px">
        <q-input
          ref="nazivPredmetaRef"
          filled
          type="text"
          label="Naziv proizvoda"
          v-model="naziv_predmeta"
          lazy-rules
          :rules="[(val) => (val !== null && val !== '') || 'Unesite naziv']"
        />
      </div>
      <div style="width: 500px">
        <q-select
          ref="selectedCategory1Ref"
          filled
          type="int"
          lazy-rules
          emit-value
          v-model="selectedCategory1"
          label="Kategorija"
          :options="categories"
          option-label="name"
          option-value="value"
          :rules="[
            (val) => (val !== null && val !== '') || 'Odaberite kategoriju',
          ]"
        />
      </div>
      <div style="width: 500px">
        <q-input
          ref="pocetnaCijenaRef"
          filled
          type="double"
          label="Početna cijena proizvoda"
          v-model="pocetna_cijena"
          lazy-rules
          :rules="[
            [rules.required, rules.price],
          ]"
        />
      </div>
      <div style="width: 500px">
        <q-select
          ref="selectedCategory2Ref"
          filled
          type="text"
          lazy-rules
          v-model="selectedCategory2"
          label="Svrha"
          :options="svrha"
          emit-value
          option-label="name"
          option-value="value"
          :rules="[
            (val) =>
              (val !== null && val !== '') ||
              'Odaberite humanitarnu svrhu aukcije',
          ]"
        />
      </div>
      <div style="width: 500px">
        <q-input
          ref="selectedCategory3Ref"
          filled
          type="integer"
          lazy-rules
          emit-value
          v-model="korisnik_trenutno.ime_korisnika"
          label="Korisnik"
          :rules="[
            (val) => (val !== null && val !== '') || 'Odaberite korisnika',
          ]"
          readonly
        />
      </div>
    </div>
    <div class="text-h6 text-bold text-left text-blue-7 q-ml-sm">
      Početak aukcije
    </div>
    <div class="q-ml-sm flex flex-start q-gutter-sm">
      <div style="width: 300px">
        <q-input 
          filled 
          v-model="vrijemePocetka" 
          label="Datum i vrijeme početka aukcije"
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date 
                  v-model="vrijemePocetka" 
                  mask="YYYY-MM-DD HH:mm" ref="datePicker"
                >
                  <div class="row items-center justify-right">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time 
                  v-model="vrijemePocetka" 
                  mask="YYYY-MM-DD HH:mm" 
                  format24h>
                  <div class="row items-center justify-right">
                    <q-btn 
                      v-close-popup label="Close" 
                      color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <div v-if="dateError" class="text-red">{{ dateErrorMessage }}</div>
      </div>
    </div>
    <div class="text-h6 text-bold text-left text-blue-7 q-ml-sm">
      Završetak aukcije
    </div>
    <div class="q-ml-sm flex flex-start q-gutter-sm">
      <div style="width: 300px">
        <q-input filled v-model="vrijemeZavrsetka2" label="Datum i vrijeme završetka aukcije">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="vrijemeZavrsetka2" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-right">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="vrijemeZavrsetka2" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-right">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <div style="width: 500px">
      <q-input
        ref="opisPredmetaRef"
        filled
        type="text"
        label="Opis proizvoda"
        v-model="opis_predmeta"
        lazy-rules
        :rules="[(val) => (val !== null && val !== '') || 'Unesite opis']"
      />
    </div>
    <div>
      <q-separator></q-separator>
      <div>
        <input type="file" @change="onFileChange">
        <img v-if="compressedImage" :src="compressedImage" alt="Compressed Image">
      </div>
      <div>
        <q-separator></q-separator>
      </div>
    </div>
    <div class="q-ml-sm flex justify-center q-gutter-sm">
      <q-btn
        label="Postavi"
        @click="submitForm"
        color="green"
        class="q-ml-sm"
        :rules="[handleSubmit]"/> 
      <q-btn label="Otkaži" type="submit" color="red" class="q-ml-sm" />
    </div>
    <q-dialog v-model="showDialog">
      <q-card>
        <q-card-section> Predmet je uspješno dodan! </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Close"
            color="primary"
            v-close-popup
            @click="closeAndReload"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import imageCompression from "browser-image-compression";
import axios from "axios";
import { ref } from 'vue';

export default {
  data() {
    return {
      sifra_predmeta: null,
      naziv_predmeta: "",
      opis_predmeta: "",
      selectedCategory1: null,
      selectedCategory2: null,
      selectedCategory3: null,
      pocetna_cijena: "",
      slika: null,
      file: null,
      originalImage: null,
      compressedImage: null,
      imageUrl: "",
      showDialog: false,
      dateError: false,
      dateErrorMessage: '',
      korisnik_trenutno: {
        ime_korisnika: "",
        prezime_korisnika: "",
        email_korisnika: "",
        adresa_korisnika: ""
      },
      
      categories: [
        { name: "Namjestaj", value: "1" },
        { name: "Automobili", value: "2" },
        { name: "Nakit", value: "3" },
        { name: "Ostalo", value: "4" },
      ],
      svrha: [
        { name: "Za osobe pogođene potresom", value: "Potres" },
        { name: "Za osobe pogođene poplavom", value: "Poplava" },
        { name: "Za osobe pogođene požarom", value: "Požar" },
        { name: "Ostalo", value: "ostalo" },
      ],
      korisnik: [
        { name: "Masimo", value: "1" },
        { name: "Emil", value: "2" },
        { name: "Dorijan", value: "3" },
        { name: "Dario", value: "4" },
      ],

      rules: {
        required: value => !!value || 'Unesite početnu cijenu',
        price: value => /^\d+(\.\d{1,2})?$/.test(value) || 'Unesite početnu cijenu (x.xx format)'
      },
    };
  },

  async mounted() {
    try {
      // Get the JWT token from local storage
      const token = localStorage.getItem("token");

      // Parse the token to get user ID
      const userId = this.getUserIdFromToken(token);

      // Fetch user data using user ID
      const userData = await this.fetchUserData(userId);
      const headers = { Authorization: `Bearer ${token}` };
      // Update the component's data with the fetched user data
      this.korisnik_trenutno = userData;

      this.selectedCategory3 = userId;  // Set the id_korisnika to userId

      this.dohvatPredmeta(userId, headers);
    } catch (error) {
      console.error("Greška kod dohvaćanja vlastitih predmeta:", error);
    }
  },

  methods: {
    async onFileChange(e) {
      const file = e.target.files[0];
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      try {
        // Compress the image file
        const compressedFile = await imageCompression(file, options);
        
        // Convert compressed file to base64 string
        const compressedBase64 = await this.convertToBase64(compressedFile);
        
        this.compressedImage = compressedBase64;
      } catch (error) {
        console.error("Error during image compression:", error);
        alert("Došlo je do pogreške prilikom kompresije slike.");
      }

      const originalImageDataUrl = URL.createObjectURL(file);
      this.originalImage = originalImageDataUrl;
    },

    convertToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    },
    getUserIdFromToken(token) {
      // Parse JWT token and extract user ID
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload).id;
    },
    async fetchUserData(userId) {
      try {
        // Fetch user data from the server using user ID
        const response = await axios.get(`http://localhost:3000/api/korisnikinfo1/${userId}`);
        // Return user data
        return response.data[0];
      } catch (error) {
        console.error("Error fetching user data:", error);
        // If an error occurs, you might want to handle it accordingly
        throw error;
      }
    },

    closeAndReload() {
      this.showDialog = false;
      window.location.reload();
    },

    validateDates() {
      const start = new Date(this.vrijemePocetka);
      const end = new Date(this.vrijemeZavrsetka2);
      const now = new Date();

      if (start < now) {
        this.dateError = true;
        this.dateErrorMessage = "Datum i vrijeme početka aukcije ne mogu biti u prošlosti.";
        return false;
      } else if (start >= end) {
        this.dateError = true;
        this.dateErrorMessage = "Datum završetka mora biti nakon datuma početka aukcije.";
        return false;
      }
      
      this.dateError = false;
      this.dateErrorMessage = "";
      return true;
    },

    validateForm() {
      // Validate all input fields and the image upload
      const isFieldsFilled = this.naziv_predmeta && this.selectedCategory1 && this.pocetna_cijena &&
                             this.selectedCategory2 && this.korisnik_trenutno.ime_korisnika && this.opis_predmeta &&
                             this.vrijemePocetka && this.vrijemeZavrsetka2;

      const isImageUploaded = this.compressedImage;

      if (!isFieldsFilled || !isImageUploaded) {
        let missingFieldsMsg = "Molim ispuniti sva polja i dodati sliku.";
        this.$q.notify({
          message: missingFieldsMsg,
          color: "red",
          position: "top",
        });
        this.highlightEmptyFields();
        return false;
      }

      return true;
    },

    highlightEmptyFields() {
      if (!this.naziv_predmeta) this.$refs.nazivPredmetaRef.validate();
      if (!this.selectedCategory1) this.$refs.selectedCategory1Ref.validate();
      if (!this.pocetna_cijena) this.$refs.pocetnaCijenaRef.validate();
      if (!this.selectedCategory2) this.$refs.selectedCategory2Ref.validate();
      if (!this.korisnik_trenutno.ime_korisnika) this.$refs.selectedCategory3Ref.validate();
      if (!this.opis_predmeta) this.$refs.opisPredmetaRef.validate();
      if (!this.vrijemePocetka) {
        this.dateError = true;
        this.dateErrorMessage = 'Unesite datum i vrijeme početka aukcije';
      }
      if (!this.vrijemeZavrsetka2) {
        this.dateError = true;
        this.dateErrorMessage = 'Unesite datum i vrijeme završetka aukcije';
      }
    },

    showMessageBox(message) {
      this.$q.dialog({
        title: 'Pogreška',
        message: message,
        ok: true,
        persistent: true
      });
    },

    async submitForm() {
      if (!this.validateDates() || !this.validateForm()) {
        return; // Early return if validation fails to avoid double error messages
      }

      const sampleData = {
        sifra_predmeta: this.sifra_predmeta,
        naziv_predmeta: this.naziv_predmeta,
        opis_predmeta: this.opis_predmeta,
        slika: this.compressedImage,
        vrijeme_pocetka: this.vrijemePocetka,
        vrijeme_zavrsetka: this.vrijemeZavrsetka2,
        pocetna_cijena: this.pocetna_cijena,
        svrha_donacije: this.selectedCategory2,
        id_korisnika: this.selectedCategory3,
        sifra_kategorije: this.selectedCategory1,
      };

      try {
        const response = await axios.post(
          "http://localhost:3000/unosPredmeta",
          sampleData
        );
        console.log(response.data);
        this.showDialog = true;
      } catch (error) {
        console.error(error);
        this.showMessageBox("Došlo je do pogreške prilikom slanja podataka.");
      }
    },
  },

  setup () {
    const vrijemeZavrsetka2 =  ref(null);// Initialize with null or any default value
    const vrijemePocetka = ref(null);
    // You can also set an initial value for vrijemeZavrsetka if needed
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 2); // Adding 2 hours to the current time
    vrijemeZavrsetka2.value = currentDate.toISOString().slice(0, 16).replace('T', ' ');
    vrijemePocetka.value = currentDate.toISOString().slice(0, 16).replace('T', ' ');
    // Return vrijemeZavrsetka to make it accessible in the component
    return {
      vrijemeZavrsetka2,
      vrijemePocetka
    };
  },

  watch: {
    vrijemePocetka(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.validateDates();
      }
    },
    vrijemeZavrsetka2(newVal, oldVal) {
      if (newVal !== oldVal && this.vrijemePocetka) {
        this.validateDates();
      }
    },
    pocetna_cijena(newVal) {
      this.rules.price(newVal); // This will apply the price rule dynamically
    },
  }
};
</script>
