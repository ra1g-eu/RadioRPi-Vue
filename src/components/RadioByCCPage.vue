<template>
  <Transition name="fade" mode="out-in">
    <div key=1 class="container-fluid" v-if="isLoading !== true">

      <div class="d-sm-flex align-items-center justify-content-start mb-4">
        <h1 class="h3 mb-0 text-white">Vybrané {{ countryText }} rádiá</h1>
      </div>

      <div class="row">

        <div class="col-xl-12 col-md-12 col-sm-12 mb-4">
          <div class="card border-left-primary bg-transparent border-0 shadow-lg h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Počet rádio staníc
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-white">{{ radioList.length }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-sort-numeric-up-alt fa-2x text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="radioList.length < 1">
        <div class="d-sm-flex align-items-center justify-content-start mb-4">
          <h1 class="h3 mb-0 text-danger">Nenašli na žiadne rádiá!</h1>
        </div>
      </div>
      <div v-else>
        <div class="d-sm-flex align-items-center justify-content-start mb-4">
          <h1 class="h3 mb-0 text-white">Vyber si z dostupných rádií:</h1>
        </div>

        <div class="row justify-content-center">
          <div class="col-lg-4 mb-4" v-for="(radio, index) in radioList" :key="index">
            <!-- Illustrations -->
            <div class="card bg-transparent shadow-lg mb-4 border-primary">
              <div class="card-header bg-transparent py-3 border-dark">
                <h6 class="m-0 font-weight-bold text-primary">{{ radio.name }}</h6>
              </div>
              <div class="card-body">
                <div class="row justify-content-end">
                  <div class="col-5 align-self-center text-center">
                    <img class="card-img-top text-center" style="max-width: 100px" :src="(radio.icon).includes('https://') == true ? radio.icon : (radio.icon).replace('http://','https://')"
                         :alt="radio.name">
                  </div>
                  <div class="col-7">
                    <ul class="list-group list-group-flush text-white">
                      <li class="list-group-item bg-transparent">Počet hlasov: <span
                          class="badge badge-pill badge-primary">{{ radio.votes }}</span></li>
                      <li class="list-group-item bg-transparent">Bitrate: <span
                          class="badge badge-pill badge-primary">{{ radio.bitrate }}</span></li>
                      <li class="list-group-item bg-transparent">Žánre: <span
                          class="badge badge-pill badge-primary text-wrap">{{ radio.tags }}</span></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card-footer bg-transparent border-top border-dark text-center">
                <router-link :to="{ name: 'radiopage', params: {station: radio.name.replace(/\s/g, ''), sid: radio.id}}" class="stretched-link btn btn-sm btn-primary">Pustiť rádio</router-link>
              </div>
            </div>

          </div>
        </div>

      </div>
</div>
    <div key=2 class="container-fluid" v-else>

      <div class="text-center d-flex justify-content-center m-5 p-5">
        <i class="fas fa-sync fa-spin fa-7x text-danger align-self-center m-5 p-5"></i>
      </div>

    </div>
  </Transition>
</template>

<script>
import Swal from "sweetalert2";

export default {

  name: "RadioByCCPage",
  data() {
    return {
      radioList: [],
      isLoading: false,
      countryList: {'slovak': 'Slovenské', 'czech': 'České', 'error': ''},
      countryText: ''
    }
  },
  created() {
    this.isLoading = true;
    document.title = 'RadioRPi - Rádiá'
  },
  mounted() {
    this.getRadiosByCountry();
  },
  methods: {
    getRadiosByCountry() {
      if (this.$route.params.countrycode != null && typeof this.$route.params.countrycode === 'string') {
        this.isLoading = true;
        this.radioList = [];
        this.countryText = '';
        this.$axios.get(this.$apiUrl + `getRadiosByCountry/${this.$route.params.countrycode}`)
            .then(response => {
              if (response.data.status == 'success') {
                this.radioList = response.data.message;
                this.countryText = this.countryList[this.$route.params.countrycode in this.countryList ? this.$route.params.countrycode : 'error'];
                setTimeout(() => this.isLoading = false, Math.floor(Math.random() * 351));
              } else {
                Swal.fire({title: "Rádiá", text: "Nastala chyba!<br>" + response.data.message, icon: "warning"});
                this.radioList = [];
                this.isLoading = false;
                this.countryText = '';
              }

            })
            .catch(function (error) {
              console.error(error);
              Swal.fire({title: "Rádiá", html: "Chyba:<br>" + error, icon: "warning"});
              this.isLoading = false;
            });
      } else {
        Swal.fire({title: "Rádiá", html: "Prosím zadaj názov krajiny.", icon: "warning"});
      }
    }
  }
}
</script>

<style scoped>
.fade-leave-active {
  transition: opacity .5s ease-out;
}

.fade-enter-to,
.fade-leave-to {
  opacity: 0
}
</style>