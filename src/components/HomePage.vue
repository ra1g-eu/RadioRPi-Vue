<template>
  <div id="content">
    <Transition name="fade" mode="out-in">
      <div key=1 class="container-fluid" v-if="!isLoading">

        <div class="row">

          <div class="col-xl-12 col-md-12 col-sm-12 mb-4 mt-4">
            <div class="card border-left-light bg-transparent border-0 shadow-lg h-100 py-2">
              <div class="card-body">
                <div class="row no-gutters align-items-center">
                  <div class="col mr-2">
                    <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                      Vyhľadaj rádiovú stanicu
                    </div>
                    <div class="h5 mb-0 font-weight-bold text-white">
                      <input class="form-control form-control" type="text" v-model="searchedStation" placeholder="Fun Rádio, Vlna...">
                    </div>
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
          <div class="row justify-content-center">
            <div class="col-lg-4 mb-4" v-for="(radio, index) in filterByName" :key="index">
              <!-- Illustrations -->
              <div class="card bg-transparent shadow-lg mb-4 border-primary">
                <div class="card-header bg-transparent py-3 border-dark">
                  <h6 class="m-0 font-weight-bold text-white">{{ radio.name }}</h6>
                </div>
                <div class="card-body">
                  <div class="row justify-content-end">
                    <div class="col-5 align-self-center text-center">
                      <img class="card-img-top text-center" style="max-width: 80px" :src="(radio.icon).includes('https://') == true ? radio.icon : (radio.icon).replace('http://','https://')"
                           :alt="radio.name">
                    </div>
                    <div class="col-7">
                      <ul class="list-group list-group-flush text-white">
                        <li class="list-group-item bg-transparent"><i class="fas fa-poll-h fa-2x"></i> {{ radio.votes }}</li>
                        <li class="list-group-item bg-transparent"><i class="fas fa-wave-square fa-2x"></i> {{ radio.bitrate }} bit</li>
                        <!--<li class="list-group-item bg-transparent"><i class="fas fa-list fa-2x"></i> {{ radio.tags }}</li> -->
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="card-footer bg-transparent border-top border-dark text-center">
                  <router-link :to="{ name: 'radiopage', params: {station: radio.name.replace(/\s/g, ''), sid: radio.id}}" class="stretched-link btn btn-sm btn-block btn-primary">Pustiť rádio</router-link>
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
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "HomePage",
  data() {
    return {
      radioList: [],
      isLoading: false,
      searchedStation: "",
    }
  },
  computed: {
    filterByName(){
      let filteredStations = this.radioList;
      if (this.searchedStation != '' && this.searchedStation) {
        filteredStations = filteredStations.filter((item) => {

          return item.name
              .toLowerCase()
              .includes(this.searchedStation.toLowerCase())

        });
      }
      return filteredStations;
    }
  },
  created() {
    this.isLoading = true;
    this.refreshStations();
  },
  mounted() {
    //this.getRadios();
  },
  methods: {
    refreshStations() {
      this.$nextTick(function () {
        this.isLoading = true;
        this.$axios.get(this.$apiUrl + `getAllRadios/`)
            .then(response => {
              if (response.data.status === 'success') {
                this.radioList = response.data.message;
                setTimeout(() => this.isLoading = false, Math.floor(Math.random() * 351));
                /*Swal.fire({
                  icon: 'success',
                  title: 'Úspech!',
                  text: 'Stanice boli načítané!',
                  confirmButtonText: 'Pokračovať',
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.close();
                  }
                });*/
              } else if (response.data.status == 'error' || response.data.message == 'refreshTooSoon') {
                Swal.fire({title: "Rádiá", text: "Stanice boli nedávno obnovené! Skús za 12 hodín.", icon: "warning"});
              } else {
                Swal.fire({title: "Rádiá", text: "Nastal problém! Skús neskôr.", icon: "warning"});
              }
            })
            .catch(function (error) {
              Swal.fire({title: "Rádiá", html: "Chyba:\n" + error.response.data.status, icon: "warning"});
            });
        this.isLoading = false;
      });
    },
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