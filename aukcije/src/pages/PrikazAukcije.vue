<template>
  <div>
    <!-- Glavna kartica s podacima o predmetu -->
    <q-card class="q-pa-sm q-gutter-sm" flat bordered>
      <!-- Prikaz slike predmeta -->
      <q-img
        :src="item.slika_url"
        alt="Slika predmeta"
        style="max-height: 300px; width: 100%; object-fit: cover;"
      />

      <!-- Prikaz informacija o predmetu -->
      <q-card-section>
        <div class="text-h5">{{ item.naziv_predmeta }}</div>
        <div class="text-subtitle2 q-mb-md">{{ item.opis_predmeta }}</div>
        <div class="text-body1">
          Trenutna cijena: <strong>{{ item.trenutna_cijena }} €</strong>
        </div>
      </q-card-section>
    </q-card>

    <!-- Dialog za ponudu -->
    <div class="q-pa-md flex flex-center">
      <q-btn label="Ponuda" color="primary" @click="showDialog = true" />
      <q-dialog v-model="showDialog">
        <q-card style="width: 300px">
          <q-card-section>
            <div class="text-h6">Ponudi</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
              rounded
              outlined
              v-model="odabranaCijena"
              :options="prices"
              label="Odaberi cijenu"
            />
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="Potvrdi ponudu" @click="potvrdiPonudu" />
            <q-btn flat label="Odustani" @click="showDialog = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <!-- Gumb za povratak -->
    <div class="q-pa-md flex flex-center">
      <q-btn label="Povratak" color="primary" @click="goBack" />
    </div>

    <!-- Prikaz poruka -->
    <div v-if="message" class="q-pa-md">
      <q-banner dense>{{ message }}</q-banner>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

const baseUrl = "http://localhost:3000/api/";

export default {
  computed: {
    sifra_predmeta() {
      return this.$route.query.sifra_predmeta;
    },
  },
  data() {
    return {
      item: {}, // Promijenjeno iz niza u objekt
      showDialog: false,
      odabranaCijena: null,
      prices: [
        { label: "100 €" },
        { label: "200 €" },
        { label: "300 €" },
        { label: "400 €" },
        { label: "500 €" },
        { label: "1000 €" },
      ],
      message: '', // Držimo poruku
    };
  },
  mounted() {
    axios.get(baseUrl + "get-predmet/" + this.sifra_predmeta, {}).then((response) => {
      this.item = response.data;
    });
    /*axios
      .get(baseUrl + "unostrenutnaponuda/get-predmet/" + this.sifra_predmeta, {})
      .then((response) => {
        this.item = response.data[0];
      });
*/
    axios
      .get(baseUrl + "unostrenutnaponuda/get-predmet-trenutna-cijena/" + this.sifra_predmeta, {})
      .then((response) => {
        this.item.trenutna_cijena = response.data[0].trenutna_cijena;
      });
  },

  methods: {
    async potvrdiPonudu() {
      if (this.odabranaCijena) {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        try {
          const response = await axios.post(
            `${baseUrl}unostrenutnaponuda`,
            {
              vrijednost_ponude: parseFloat(this.odabranaCijena.label.replace(' €', '')),
              vrijeme_ponude: new Date().toISOString(),
              sifra_predmeta: this.sifra_predmeta,
            },
            { headers }
          );

          this.message = response.data.message;
          this.showDialog = false;
          this.item.trenutna_cijena = this.odabranaCijena.label; // Ažuriranje prikaza trenutne cijene
        } catch (error) {
          this.message = 'Greška pri dodavanju ponude: ' + (error.response ? error.response.data.message : error.message);
        }
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  },

  setup() {
    return {
      date: ref("2023-03-27 12:44"),
      date2: ref("2023-03-27 12:44"),
      slide: ref(2),
      autoplay: ref(false),
    };
  },
};
</script>

<style>
.q-banner {
  background-color: #ffc107;
  color: #000;
}
</style>