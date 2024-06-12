<template>
  <div>
    <q-card :expand="false"></q-card>
    <q-card class="q-pa-sm q-gutter-sm" flat bordered>
      <!-- Sadržaj kartice -->
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
          </q-card-actions>
        </q-card>
      </q-dialog>
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
      item: [],
      showDialog: false,
      odabranaCijena: null,
      prices: [
        { label: "100 €" },
        { label: "200 €" },
        { label: "300 €" },
        { label: "400 €" },
        { label: "500 €" },
        { label: "1500 €" },
      ],
      message: '', // Držimo poruku
    };
  },
  mounted() {
    axios
      .get(baseUrl + "unostrenutnaponuda/get-predmet/" + this.sifra_predmeta, {})
      .then((response) => {
        this.item = response.data[0];
      });

    axios
      .get(baseUrl + "unostrenutnaponuda/get-predmet-trenutna-cijena/" + this.sifra_predmeta, {})
      .then((response) => {
        this.item = response.data[0];
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
/* Dodaj stilove ovdje ako je potrebno */
.q-banner {
  background-color: #ffc107;
  color: #000;
}
</style>