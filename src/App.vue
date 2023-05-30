<template>
  <div id="wrapper" class="vh-100">

    <div id="content-wrapper" class="d-flex flex-column bg-gray-900 mb-5">
      <main>
        <router-view :key="$route.fullPath"></router-view>
      </main>
      <!-- End of Footer -->

    </div>
    <!-- End of Content Wrapper -->
    <nav class="navbar fixed-bottom navbar-expand-sm navbar-dark bg-danger">
      <div class="container-fluid">
        <router-link :to="{name: 'home'}" class="navbar-brand"><i class="fas fa-music rotate-n-15 me-2"></i> RadioRPi
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse mt-3" id="navbarCollapse">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link :to="{name: 'home'}" class="text-decoration-none text-white"><i class="fas fa-home me-1"></i>
                Domov
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
  <!-- End of Page Wrapper -->

  <!-- Scroll to Top Button-->
  <button class="scroll-to-top rounded btn btn-sm bg-danger border-dark" @click="moveTo" style="z-index: 10000">
    <i class="fas fa-angle-up align-self-center"></i>
  </button>
</template>

<script>

import $ from "jquery";

$(document).ready(function () {
  $(document).on("scroll", function () {
    100 < $(this).scrollTop() ? $(".scroll-to-top").fadeIn() : $(".scroll-to-top").fadeOut()
  })
});
/* eslint-disable */
import Swal from "sweetalert2";
import {Capacitor} from "@capacitor/core";

export default {

  name: 'App',
  created() {
    if (Capacitor.getPlatform() === 'android') {
      cordova.plugins.DozeOptimize.IsIgnoringBatteryOptimizations(function (response) {
        console.log("IsIgnoringBatteryOptimizations: " + response);
        if (response == "false") {
          Swal.fire({
            icon: 'info',
            title: 'Optimalizácia',
            showDenyButton: true,
            text: 'Pre správne prehrávanie zvuku na pozadí, je potrebné vypnúť šetrenie batérie pre túto aplikáciu. Pokračovať?',
            confirmButtonText: 'Áno',
            denyButtonText: 'Nie'
          }).then((result) => {
            if (result.isConfirmed) {
              cordova.plugins.DozeOptimize.RequestOptimizations(function (response) {
                if (response == "Optimizations Requested Successfully" || response == "true") {
                  Swal.fire({
                    icon: 'success',
                    title: 'Úspech!',
                    text: 'Nastavenie úspešne zmenené!',
                    confirmButtonText: 'Pokračovať',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.close();
                    }
                  });
                }
              }, function (error) {
                console.error("BatteryOptimizations Request Error" + error);
              });
            } else if (result.isDenied) {
              Swal.fire({
                icon: 'warning',
                title: 'Optimalizácia',
                text: 'Niekoľko minút po uspatí zariadenia sa preruší prehrávanie rádia, kvôli šetreniu batérie. Pre zmenu nastavenia reštartuj appku.',
                confirmButtonText: 'Ok',
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.close();
                }
              });
            }
          });
        } else {
          console.log("Application already Ignoring Battery Optimizations");
        }
      }, function (error) {
        Swal.fire({
          icon: 'warning',
          title: 'Chyba!',
          text: 'Chyba v nastavení optimalizácie! Chybová správa: ' + error,
          confirmButtonText: 'Pokračovať',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.close();
          }
        });
      });
    }
    document.title = 'RadioRPi - České a Slovenské rádiá!'
  },
  methods: {
    moveTo() {
      let to = this.moveToDown
          ? this.offsetTop - 60
          : 0

      window.scroll({
        top: to,
        left: 0,
        behavior: 'smooth'
      })

      this.moveToDown = !this.moveToDown
    },
    refreshStations() {
      this.$nextTick(function () {
      this.$axios.get(this.$apiUrl + `getAllRadios/`)
          .then(response => {
            console.log(response.data.message);
            if (response.data.status === 'success') {
              Swal.fire({
                icon: 'success',
                title: 'Úspech!',
                text: 'Stanice boli načítané!',
                confirmButtonText: 'Pokračovať',
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.close();
                }
              });
            } else if (response.data.status == 'error' || response.data.message == 'refreshTooSoon') {
              Swal.fire({title: "Rádiá", text: "Stanice boli nedávno obnovené! Skús za 12 hodín.", icon: "warning"});
            } else {
              Swal.fire({title: "Rádiá", text: "Nastal problém! Skús neskôr.", icon: "warning"});
            }
          })
          .catch(function (error) {
            //console.error(error);
            Swal.fire({title: "Rádiá", html: "Chyba:\n" + error.response.data.status, icon: "warning"});
          });
      });
    }
  }
}
</script>
