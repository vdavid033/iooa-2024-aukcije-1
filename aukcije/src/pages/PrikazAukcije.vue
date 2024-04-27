<template>
  <div>
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
        { label: "1000 €" },
      ],
      potvrdjenaCijena: null,
    };
  },
  mounted() {
    axios
      .get(baseUrl + "get-predmet/" + this.sifra_predmeta, {})
      .then((response) => {
        this.item = response.data[0];
      });

    axios
      .get(baseUrl + "get-predmet-trenutna-cijena/" + this.sifra_predmeta, {})
      .then((response) => {
        this.item = response.data[0];
      });
  },

  methods: {
    formattedDate(dateString) {
      return new Date(dateString).toLocaleString("hr-HR").replace(",", "");
    },
    potvrdiPonudu() {
      if (this.odabranaCijena) {
        this.potvrdjenaCijena = this.odabranaCijena;
        this.showDialog = false;
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
