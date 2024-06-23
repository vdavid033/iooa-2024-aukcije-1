<template>
  <q-card class="q-pa-sm q-gutter-sm" flat bordered>
    <q-card-section>
      <div class="text-h3 text-bold text-center text-blue-7 q-ml-sm">
        Prikaz aukcije
        <div class="q-ml-sm flex justify-end q-gutter-sm">
          <q-btn size="15px" name="send" rel="stylesheet" to="/" color="red" label="Natrag" />
        </div>
      </div>
    </q-card-section>
    <q-separator color="red" />

    <div class="q-pa-sm col flex flex-start q-gutter-sm">
      <div class="row flex flex-center">
        <div style="width: 600px">
          <q-card-section class="q-pt-none">
            <template v-if="!showSingleImage && item.slike && item.slike.length > 1">
              <q-carousel control-color="black" animated v-model="slide" navigation infinite :autoplay="autoplay" arrows transition-prev="slide-right" transition-next="slide-left" @mouseenter="autoplay = false" @mouseleave="autoplay = true">
                <q-carousel-slide :key="index" v-for="(image, index) in item.slike" :name="index + startingIndex">
                  <q-img :src="image" />
                </q-carousel-slide>
              </q-carousel>
            </template>
            <template v-else>
              <q-img v-if="showSingleImage" :src="item.slike ? item.slike[0] : item.slika" />
            </template>
          </q-card-section>
        </div>
      </div>
      <div class="q-ml-sm col flex flex-start q-gutter-sm">
        <div class="q-ml-sm flex flex-start q-gutter-sm">
          <div style="width: 80%">
            <q-field filled label="Naziv proizvoda" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ item.naziv_predmeta }}
                </div>
              </template>
            </q-field>
          </div>
          <div style="width: 80%">
            <q-field filled label="Opis proizvoda" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ item.opis_predmeta }}
                </div>
              </template>
            </q-field>
          </div>
          <div style="width: 39.5%">
            <q-field filled label="Početno vrijeme aukcije" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ formattedDate(item.vrijeme_pocetka) }}
                </div>
              </template>
            </q-field>
          </div>

          <div style="width: 39.5%">
            <q-field filled label="Završno vrijeme aukcije" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ formattedDate(item.vrijeme_zavrsetka) }}
                </div>
              </template>
            </q-field>
          </div>
          <div style="width: 39.5%">
            <q-field filled label="Početna cijena proizvoda" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ item.pocetna_cijena + "$" }}
                </div>
              </template>
            </q-field>
          </div>
          <div style="width: 39.5%">
            <q-field filled label="Trenutna cijena " stack-label>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ item.trenutna_cijena + "" }}
              </div>
            </q-field>
          </div>
        </div>
      </div>
    </div>
  </q-card>
  <div class="q-pa-md flex flex-center">
    <q-btn label="Ponuda" color="primary" @click="showDialog = true" />
    <q-dialog v-model="showDialog">
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">Ponudi</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-select outlined v-model="odabranaCijena" :options="prices" label="Odaberi cijenu" />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Potvrdi ponudu" @click="potvrdiPonudu" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { jwtDecode } from "jwt-decode";
import { ref } from "vue";
import axios from "axios";

const baseUrl = "http://localhost:3000/api/";

export default {
  computed: {
    sifra_predmeta() {
      return this.$route.query.sifra_predmeta;
    },

    startingIndex() {
      return 2;
    },
  },
  data() {
    return {
      item: [],
      showDialog: false,
      odabranaCijena: "",
      prices: [
        { label: "100 €" },
        { label: "200 €" },
        { label: "300 €" },
        { label: "400 €" },
        { label: "500 €" },
        { label: "1000 €" },
        { label: "2000 €" },
        { label: "3000 €" },
        { label: "5000 €" },
        { label: "10000 €" },
      ],
      predmet: {
        id_ponude: null,
        vrijednost_ponude: null,
        vrijeme_ponude: null,
        id_korisnika: null,
        sifra_predmeta: null,
      },
      slike: [],
      showSingleImage: false,
      index: 1,
    };
  },
  mounted() {
    axios.get(baseUrl + "get-predmet/" + this.sifra_predmeta, {}).then((response) => {
      this.item = response.data[0];
   
   
    });

    axios .get(baseUrl + "unostrenutnaponuda/get-predmet-trenutna-cijena/" + this.sifra_predmeta, {})
      .then((response) => {
        this.item = response.data[0];
      });
  },
  

  methods: {
    formattedDate(dateString) {
      return new Date(dateString).toLocaleString("hr-HR").replace(",", "");
    },

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