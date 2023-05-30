<template>
  <Transition name="fade" mode="out-in">
    <div key=1 class="container-fluid" v-if="isLoading !== true">
      <div v-if="radioList.length < 1">
        <div class="d-sm-flex align-items-center justify-content-start mt-3">
          <h1 class="h3 mb-0 text-white">Táto stanica neexistuje</h1>
        </div>
      </div>
      <div v-else>
        <div class="row justify-content-center">

          <div class="col-12 mb-4">

            <!-- Illustrations -->
            <div class="card bg-transparent shadow-lg mt-3 border-primary align-middle">
              <div class="card-header bg-transparent py-3 border-dark">
                <h6 class="m-0 font-weight-bold text-white">{{ this.radioList[0].name }}</h6>
              </div>
              <div class="card-body">
                <div class="row justify-content-end">
                  <div class="col-12 align-self-center text-center">
                    <img class="card-img-top text-center" style="max-width: 100px"
                         :src="(this.radioList[0].icon).includes('https://') == true ? this.radioList[0].icon : (this.radioList[0].icon).replace('http://','https://')" :alt="this.radioList[0].name">
                  </div>
                </div>
              </div>

              <div class="card-footer bg-transparent border-top border-0 text-center">
                <i class="fas fa-music fa-fw fa-3x mb-3 mt-3 text-primary" id="musicSpinner"></i>
                <div class="row justify-content-center">
                  <div class="col-12">
                    <div class="card border-0 shadow-sm">
                        <button id="playBtn" @click="playButton" type="button" class="btn btn-block btn-primary">Spustiť rádio
                        </button>
                    </div>
                  </div>
                </div>
                <div class="row justify-content-center">
                  <div class="col-12">
                    <div class="card border-0 shadow-sm bg-transparent mt-4 text-white">
                      <label for="volumeRange" class="form-label">Hlasitosť</label>
                      <input type="range" class="form-range p-3" step="0.01" value="0.5" min="0" max="1"
                             id="volumeRange" @input="setRadioVolume">
                    </div>
                  </div>
                </div>

                <hr class="mt-3 mb-3 bg-danger">
                <div class="row justify-content-center">
                  <div class="col-6-lg">
                    <a @click.once="newTabRadio" type="button"
                       class="btn btn-sm btn-danger font-weight-light">Klikni sem ak rádio nejde prehrať</a>
                  </div>
                </div>

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
import $ from "jquery";
import {Howl} from 'howler';
import {Browser} from '@capacitor/browser';

export default {
  name: "RadioPage",
  data() {
    return {
      radioList: [{name: 'notSet'}],
      isLoading: false,
      radioLive: null,
      isPlaying: false
    }
  },
  created() {
    $("#volumeRange").val("0.5");
    this.isLoading = true;
    document.title = 'RadioRPi - Práve hrá rádio ' + this.$route.params.station
  },
  mounted() {
    this.getSpecificRadio();
  },
  deactivated() {
    this.radioLive.unload();
    this.radioLive.stop();
  },
  beforeUnmount() {
    this.radioLive.unload();
    this.radioLive.stop();
  },
  methods: {
    getSpecificRadio() {
      if (typeof this.$route.params.station === 'string' && typeof this.$route.params.sid === 'string') {
        this.isLoading = true;
        this.radioList = [];
        this.$axios.get(this.$apiUrl + `getSpecificRadio/${this.$route.params.sid}`)
            .then(response => {
              if (response.data.status == 'success') {
                this.radioList = response.data.message;
                document.title = 'RadioRPi - Práve hrá rádio ' + this.radioList[0].name;
                this.radioLive = new Howl({
                  src: [(this.radioList[0].url).includes('https://') == true ? this.radioList[0].url : (this.radioList[0].url).replace('http://','https://')],
                  autoplay: false,
                  volume: 0.5,
                  html5: true
                });
                this.radioLive.unload();
                this.radioLive.volume(0.5);
                this.radioLive.stop();
                setTimeout(() => this.isLoading = false, Math.floor(Math.random() * 351));
              } else {
                Swal.fire({title: "Rádiá", text: "Nastala chyba!<br>" + response.data.message, icon: "warning"});
                this.radioList = [];
                this.isLoading = false;
              }

            })
            .catch(function (error) {
              console.error(error);
              Swal.fire({title: "Rádiá", html: "Chyba:<br>" + error, icon: "warning"});
              this.isLoading = false;
            });
      } else {
        Swal.fire({title: "Rádiá", html: "Prosím zadaj názov rádia.", icon: "warning"});
      }
    },
    playButton(){
      if (this.isPlaying) {
        $("#musicSpinner").removeClass("fa-spin");
        $("#playBtn").removeClass("btn-danger");
        $("#playBtn").addClass("btn-primary");
        $("#playBtn").html("Spustiť rádio");
        this.radioLive.stop();
        this.isPlaying = false;
      } else {
        $("#musicSpinner").addClass("fa-spin");
        $("#playBtn").removeClass("btn-primary");
        $("#playBtn").addClass(" btn-danger");
        $("#playBtn").html("Pozastaviť rádio");
        this.radioLive.play();
        this.isPlaying = true;
      }
    },
    newTabRadio(){
      this.isPlaying = false;
      $("#musicSpinner").removeClass("fa-spin");
      $("#playBtn").removeClass("btn-danger");
      $("#playBtn").addClass("btn-primary");
      $("#playBtn").html("Spustiť rádio");
      this.radioLive.stop();
      this.radioLive.unload();
      const openUrlInBrowser = async () => {
        await Browser.open({url: this.radioList[0].url.includes('https://') == true ? this.radioList[0].url : this.radioList[0].url.replace('http://','https://')});
      };
      openUrlInBrowser();
    },
    setRadioVolume(){
      this.radioLive.volume($("#volumeRange").val());
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