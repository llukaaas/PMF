var xmlhttp = new XMLHttpRequest();
var podaci; //cuvam JSON
var staTrazim = "Sve";
var korpa = {};
var broj = 0;
xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
        podaci = JSON.parse(this.responseText);
        podaci = podaci.uponudi;
        console.log(podaci);
        var kategorije = document.getElementById('kategorije');
        for(ponuda of podaci) {
            kategorije.innerHTML += '<a id="'+ponuda.ime+'" class="dropdown-item" href="#" onclick="prikazi(\''+ponuda.ime+'\', \'Sve\')">'+ponuda.ime+'</a>';
        }
            ocitaj();
	}
};

xmlhttp.open("GET", "./podaci.json", true);
xmlhttp.send();


function pretrazi() {
    prikazi(staTrazim, document.getElementById('search').value);
    console.log(document.getElementById('search').value);
}

function prikazi(sta, sa) {
    document.getElementById(staTrazim).classList.remove('active');
    var dom = document.getElementById(sta);
    dom.classList.add('active');
    staTrazim = sta;

    // Uzima HTML element za spisak artikala
    dom = document.getElementById('spisak');
    dom.innerHTML = '';
    var dodaj = '';
   
    for(ponuda of podaci) {
        console.log('Ponuda : ', ponuda, staTrazim);
        if(ponuda.ime === staTrazim || staTrazim === 'Sve') {
            console.log('Dodajem', sa);
            for(predmet of ponuda.predmeti) {
                if(sa === 'Sve' || predmet.ime.includes(sa) || predmet.opis.includes(sa)) {
                    // Dodajem taj artikal u spisak
                    console.log('Dodajem', predmet);
                    dodaj = '';
                    dodaj += '<div class="grid-item">';
                    dodaj += '<div class="grid-slika"> <img class="slika" src="slike/'+predmet.slika+'" height=275px> </div>';
                    dodaj += '<div class="naslov">'+predmet.ime+'</div>';
                    dodaj += '<div class="text">'+predmet.opis+'</div>';
                    dodaj += '<div class="cena">'+predmet.cena+' din</div>';
                    dodaj += '<div id="dodaj-u-korpu" class="dodaj-u-korpu">';
                    if(predmet.dostupno) dodaj += '<button type="button" class="btn btn-dark"';
                    else dodaj += '<button type="button" class="btn btn-danger"';
                    dodaj += 'onclick="dodajUKorpu(\''+predmet.id+'\', \''+predmet.ime+'\')"';
                    if(!predmet.dostupno) dodaj += 'disabled';
                    if(predmet.dostupno) dodaj += '>Dodaj u korpu</button>';
                    else dodaj += '>Nedostupno</button>';
                    dodaj += '</div>';
                    dodaj += '</div>';
                    dom.innerHTML += dodaj;
                }
            }
        }
    }
}

function ocitaj() {
    prikazi('Sve', 'Sve');
    azurirajKorpu();
}

//dodavanje
function dodajUKorpu(id, ime) {
    if(id in korpa) korpa[id].broj++;
    else {
        korpa[id] = {ime: ime, broj: 1};
    }
    broj++;
    azurirajKorpu();
}

// brisanje iz korpe
function obrisiIzKorpe(id) {
    if(id in korpa) {
        broj -= korpa[id].broj;
        delete korpa[id];
    }
    azurirajKorpu();
}

function azurirajKorpu() {
    var dom = document.getElementById('koliko');
    dom.innerHTML = broj;
    console.log(korpa);
    // Nalazi sadrzaj
    dom = document.getElementById('korpa-sadrzaj');
    
    if(Object.keys(korpa).length === 0) {
        dom.innerHTML = '<div class="alert alert-danger" role="alert">Vasa korpa je prazna. Molimo vas da dodate nesto u nju.</div>';
        return;
    }
    dom.innerHTML = '';
    var tabela = '';
    // Generise pocetak tabele za trenutne artikle u korpi
    tabela += '<table class="table">';
    tabela += '<thead class="thead-dark">';
    tabela += '<tr>';
    tabela += '<th scope="col">Ime</th>';
    tabela += '<th scope="col">Broj</th>';
    tabela += '<th scope="col">Opcije</th>';
    tabela += '</tr>';
    tabela += '</thead>';
    tabela += '<tbody>';
   
    for(ponuda of podaci) {
        for(predmet of ponuda.predmeti) {
            if(predmet.id in korpa) {
                tabela += '<tr>';
                tabela += '<td>'+korpa[predmet.id].ime+'</td>';
                tabela += '<td>'+korpa[predmet.id].broj+'</td>';
                tabela += '<td><button type="button" class="btn btn-danger korpa" onclick="obrisiIzKorpe(\''+predmet.id+'\')">X</button></th></td>';
                tabela += '</tr>';
            }
        }
    }
    tabela += '</tbody>';
    tabela += '</table>';
    dom.innerHTML = tabela;
}