// =====================================================
// ecoquest
// script.js
// DONT TOUCH SHIT UNLESS U KNOW WHAT UR DOING OK??
// =====================================================

// -------------------------
// game variables
// -------------------------

let selectedBuilding = "";
let gameOver = false;

let money = 1000;
let population = 0;
let pollution = 0;
let happiness = 50;
let income = 0;
let turns = 0;

// -------------------------
// buildings
// -------------------------

const buildings = {

    "🏠":{
        cost:100,
        population:5,
        pollution:2,
        happiness:4,
        income:15
    },

    "🌳":{
        cost:75,
        population:0,
        pollution:-5,
        happiness:10,
        income:0
    },

    "🏭":{
        cost:300,
        population:2,
        pollution:15,
        happiness:-5,
        income:40
    },

    "☀️":{
        cost:250,
        population:1,
        pollution:-10,
        happiness:8,
        income:20
    }

};

// -------------------------
// music
// -------------------------

const songs = [
    "music/karolina - sore.mp3",
    "music/laputa - panchiko.mp3",
    "music/lovesongs - clairo.mp3",
    "music/setapak sriwedari.mp3"
];

const songNames = [
    "karolina - sore",
    "laputa - panchiko",
    "lovesongs - clairo",
    "setapak sriwedari"
];

const bgm = document.getElementById("bgm");
const songName = document.getElementById("songName");

const nextBtn = document.getElementById("nextSong");
const prevBtn = document.getElementById("prevSong");
const pauseBtn = document.getElementById("pauseSong");
const volumeSlider = document.getElementById("volume");

let currentSong = 0;

bgm.volume = .4;

function playSong(index){

    currentSong = index;

    bgm.pause();

    bgm.src = encodeURI(songs[index]);

    songName.textContent = songNames[index];

    bgm.play();

    pauseBtn.textContent = "⏸";
}

document.addEventListener("click",function(){

    if(bgm.src==""){

        playSong(0);

    }

},{once:true});

nextBtn.onclick=function(){

    currentSong++;

    if(currentSong>=songs.length){

        currentSong=0;

    }

    playSong(currentSong);

};

prevBtn.onclick=function(){

    currentSong--;

    if(currentSong<0){

        currentSong=songs.length-1;

    }

    playSong(currentSong);

};

pauseBtn.onclick=function(){

    if(bgm.paused){

        bgm.play();

        pauseBtn.textContent="⏸";

    }

    else{

        bgm.pause();

        pauseBtn.textContent="▶";

    }

};

volumeSlider.oninput=function(){

    bgm.volume=this.value/100;

};

bgm.onended=function(){

    currentSong++;

    if(currentSong>=songs.length){

        currentSong=0;

    }

    playSong(currentSong);

};

// -------------------------
// stat updater
// -------------------------

function updateStats(){

    document.getElementById("money").textContent=money;

    document.getElementById("population").textContent=population;

    document.getElementById("income").textContent=income;

    document.getElementById("pollution").textContent=pollution;

    document.getElementById("happy").textContent=happiness;

    document.getElementById("turns").textContent=turns+" / 20";

}

// -------------------------
// toolbar
// -------------------------

document.getElementById("houseBtn").onclick=function(){

    selectedBuilding="🏠";

};

document.getElementById("parkBtn").onclick=function(){

    selectedBuilding="🌳";

};

document.getElementById("factoryBtn").onclick=function(){

    selectedBuilding="🏭";

};

document.getElementById("solarBtn").onclick=function(){

    selectedBuilding="☀️";

};

document.getElementById("eraseBtn").onclick=function(){

    selectedBuilding="erase";

};

// -------------------------
// create grid
// -------------------------

const grid=document.getElementById("grid");

for(let i=0;i<32;i++){

    const tile=document.createElement("div");

    tile.className="tile";

    tile.dataset.building="";

    tile.onclick=function(){

        if(gameOver){

            return;

        }

        // -------------------------
        // erase
        // -------------------------

        if(selectedBuilding=="erase"){

            if(tile.dataset.building==""){

                return;

            }

            const old=buildings[tile.dataset.building];

            money+=old.cost;
            population-=old.population;
            pollution-=old.pollution;
            happiness-=old.happiness;

            tile.textContent="";
            tile.dataset.building="";

            calculateIncome();

            updateStats();

            return;

        }

        // -------------------------
        // nothing selected
        // -------------------------

        if(selectedBuilding==""){

            return;

        }

        // -------------------------
        // already occupied
        // -------------------------

        if(tile.dataset.building!=""){

            return;

        }

        const building=buildings[selectedBuilding];

        // -------------------------
        // enough money?
        // -------------------------

        if(money<building.cost){

            alert("not enough money");

            return;

        }

        // -------------------------
        // place building
        // -------------------------

        money-=building.cost;

        population+=building.population;

        pollution+=building.pollution;

        happiness+=building.happiness;

        tile.dataset.building=selectedBuilding;

        tile.textContent=selectedBuilding;

        turns++;

        calculateIncome();

        money+=income;

        updateStats();

        if(turns>=20){

            endGame();

        }

    };

    grid.appendChild(tile);

}

updateStats();

// =====================================================
// helper functions
// =====================================================

function calculateIncome(){

    income = 0;

    document.querySelectorAll(".tile").forEach(function(tile){

        if(tile.dataset.building != ""){

            income += buildings[tile.dataset.building].income;

        }

    });

}

function endGame(){

    gameOver = true;

    let rating;

    if(pollution <= 20){

        rating = "eco master";

    }

    else if(pollution <= 50){

        rating = "green city";

    }

    else if(pollution <= 80){

        rating = "industrial city";

    }

    else{

        rating = "environmental disaster";

    }

    alert(`game over!

money: ${money}

population: ${population}

income: ${income}/turn

pollution: ${pollution}

happiness: ${happiness}

turns: ${turns}/20

rating: ${rating}`);

}