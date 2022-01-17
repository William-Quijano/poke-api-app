<template>
  <div>
    <div style="background-color: #ff6600">
      <div style="margin-bottom: 0.5em" class="d-flex justify-content-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1200px-International_Pok%C3%A9mon_logo.svg.png"
          style="max-width: 60%; height: auto"
          alt=""
        />
      </div>
      <div
        class="d-flex flex-column flex-nowrap justify-content-center align-items-center"
      >
        <p
          class="text-center order-1"
          style="box-shadow: 0px 2px 5px 3px black; background-color: #fad86a"
        >
          Busca tu pokemon de tu elección
        </p>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center styleInput">
        <Autocomplete
          v-model="namePokemon"
          v-on:keyup.enter="searchPokemon"
          @keyup="suggestionSearch"
          :results="pokemonfilter"
          :max="5"
          @onSelect="selectPokemon"
          :value="namePokemon"
          placeholder="Pokemon"
        ></Autocomplete>
        <div class="input-group-append">
          <span
            class="input-group-text text-primary"
            style="cursor: pointer"
            v-on:click="searchPokemon"
            ><i class="fas fa-search"></i
          ></span>
        </div>
      </div>

      <div class="d-flex justify-content-center flex-row flex-wrap">
        <div
          class="card"
          v-for="pokemon in pokemons"
          :key="pokemon.id"
          v-on:click="showDetail(pokemon.id)"
          style="
            width: 8rem;
            margin-left: 1em;
            margin-bottom: 2em;
            box-shadow: 10px 11px 8px;
            border-radius: 15%;
            cursor: pointer;
          "
        >
          <img
            class="card-img-top"
            :src="imgUrl + pokemon.id + '.png'"
            style="border-radius: 20%"
            alt="Card image cap"
          />
          <h6 class="text-dark text-center">{{ pokemon.name }}</h6>
        </div>
      </div>

      <div id="scroll-trigger" ref="infinitescrolltrigger">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
    </div>
  </div>
</template>
<script>
import Autocomplete from "vue3-autocomplete";
// Optional: Import default CSS
import "vue3-autocomplete/dist/vue3-autocomplete.css";

export default {
  name: "YourComponentName",
  components: {
    Autocomplete,
  },
  data() {
    return {
      pokemons: [],
      imgUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/",
      nextUrl: "",
      namePokemon: "",
      currentUrl: "",
      apiUrl: "https://pokeapi.co/api/v2/pokemon/",
      allpokemon: [],
      pokemonfilter: [],
    };
  },

  methods: {
    async viewPokemon() {
      await this.axios
        .get(this.currentUrl)
        .then((resp) => {
          if (resp.status === 200) return resp;
        })
        .then((resp) => {
          this.nextUrl = resp.data.next;
          if (this.namePokemon) {
            let pokemonId = resp.data.id;
            this.showDetail(pokemonId);
            this.namePokemon = "";
            this.currentUrl = this.apiUrl;
            this.viewPokemon();
          } else {
            resp.data.results.forEach((pokemon) => {
              pokemon.id = pokemon.url
                .split("/")
                .filter(function (part) {
                  return !!part;
                })
                .pop();
              this.pokemons.push(pokemon);
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$swal({
            icon: "error",
            Title: "Pokemon no encontrado!",
            text: "Nombre de Pokemon no encontrado",
            background: "#ff8f36",
          });
        });
    },
    async suggestionRequest() {
      await this.axios
        .get("https://pokeapi.co/api/v2/pokemon?limit=1118")
        .then((result) => {
          result.data.results.forEach((pokemon) => {
            this.allpokemon.push(pokemon);
          });
        });
    },
    suggestionSearch() {
      let expresion = new RegExp(`${this.namePokemon}.*`, "i");
      this.pokemonfilter = this.allpokemon.filter((poke) => expresion.test(poke.name));

      console.log(this.pokemonfilter);
    },
    async selectPokemon(pokemon) {
      this.namePokemon = pokemon.name;
    },
    searchPokemon() {
      this.currentUrl = this.apiUrl + this.namePokemon.toLowerCase();
      this.viewPokemon();
    },

    scrollTrigger() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0 && this.nextUrl) {
            this.next();
          }
        });
      });

      observer.observe(this.$refs.infinitescrolltrigger);
    },
    next() {
      this.currentUrl = this.nextUrl;
      this.viewPokemon();
    },
    showDetail(id) {
      this.axios.get("https://pokeapi.co/api/v2/pokemon/" + id).then((result) => {
        let type = [];
        let han = [];
        result.data.types.forEach((data) => {
          type.push('<span class="badge badge-dark">' + data.type.name + "</span>");
        });
        result.data.abilities.forEach((data) => {
          han.push('<span class="badge badge-dark">' + data.ability.name + "</span>");
        });
        this.$swal({
          html:
            '<img src="' +
            this.imgUrl +
            id +
            '.png" style="width:10em;background-color:#FAD86A;border-radius: 50%">' +
            '<h4 class="text-dark">' +
            result.data.name +
            "</h4>" +
            '<p style="box-shadow: 0px 2px 5px 3px black;background-color: #FAD86A">Experiencia : ' +
            result.data.base_experience +
            " px</p>" +
            '<p style="box-shadow: 0px 2px 5px 3px black;background-color: #FAD86A">Altura : ' +
            (result.data.height / 10).toFixed(1) +
            " m</p>" +
            '<p style="box-shadow: 0px 2px 5px 3px black;background-color: #FAD86A">Peso : ' +
            (result.data.weight / 10).toFixed(1) +
            " kg</p>" +
            '<h4 class="text-dark">Tipo de pokemon</h4>' +
            "<div>" +
            type +
            "</div>" +
            '<h4 class="text-dark">Habilidades</h4>' +
            "<div>" +
            han +
            "</div>",

          imageHeight: 200,
          background: "#ff8f36",
        });
      });
    },
  },
  created() {
    this.currentUrl = this.apiUrl;
    this.viewPokemon();
  },
  mounted() {
    this.suggestionRequest();
    this.scrollTrigger();
  },
};
</script>
