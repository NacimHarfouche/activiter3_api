// Liste des liens Web à afficher. Un lien est défini par :
// - son titre
// - son URL
// - son auteur (la personne qui l'a publié)
let listeLiens = [
    {
        titre: "So Foot",
        url: "http://sofoot.com",
        auteur: "yann.usaille"
    },
    {
        titre: "Guide d'autodéfense numérique",
        url: "http://guide.boum.org",
        auteur: "paulochon"
    },
    {
        titre: "L'encyclopédie en ligne Wikipedia",
        url: "http://Wikipedia.org",
        auteur: "annie.zette"
    }
];

/*******************************************/
/**************** Variable ****************/
/*****************************************/
// récupère le h1 du DOM
const h1Elt = document.querySelector("h1");
// variable du button qui va afficher le formulaire
let buttonDisplayElt;

/*******************************************/
/**************** fonction ****************/
/*****************************************/

// function ajax get
function ajaxGet(url, callback) {
    let req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
}

// function callback d'ajax get
function gestionReponse(data) {
    // vide la div avant de la réremplir
    document.getElementById("contenu").innerHTML = "";
    // creation d'une boucle qui appel la function pour afficher les article présent dans l'objet ci dessus les div
    for (let i = 0; i < listeLiens.length ; i++){
       displayDiv(i);
    }
    // stock la reponse dans une variable après l'avoir parse
    let reponses = JSON.parse(data);
    // affiche les reponses reçu dans le DOM via une boucle
    for (let i = reponses.length-1; i >= 0; i--) {
        addDiv(reponses[i].auteur,reponses[i].titre,reponses[i].url);
    }
}

// function ajax post
function ajaxPost(url, data, callback, isJson) {
    let req = new XMLHttpRequest();
    req.open("POST", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    if (isJson) {
        req.setRequestHeader("Content-Type", "application/json");
        data = JSON.stringify(data);
    }
    req.send(data);
}

// creation d'une fonction pour automatiser l'affichage des divs au chargement de la page
function displayDiv(i) {
    
    // declaration paragraphe
    let paraElt = document.createElement("p");
    paraElt.className = "info";

    // declaration lien
    let lienElt = document.createElement("a");
    lienElt.href = listeLiens[i].url;
    lienElt.textContent = listeLiens[i].titre;

    // introduction des different elements dans le dom
    paraElt.appendChild(lienElt);
    paraElt.appendChild(document.createTextNode(` ${listeLiens[i].url}`));
    paraElt.appendChild(document.createElement("br"));
    paraElt.appendChild(document.createTextNode(`Ajouté par ${listeLiens[i].auteur}`));
    document.getElementById("contenu").appendChild(paraElt);

    // ### Partie Style CSS ###
    // Paragraphe
    paraElt.style.backgroundColor = "white";
    paraElt.style.padding = "10px";
    paraElt.style.fontSize = "15px";
    paraElt.style.lineHeight = "1.5em"

    // Lien
    lienElt.style.color = "#428bca";
    lienElt.style.fontWeight = "bold";
    lienElt.style.textDecoration = "none";
    lienElt.style.fontSize = "18px";
    lienElt.style.fontWeight = "bold";
}

// fonction qui crée le formulaire, et les button, et les insert dans le DOM (une fois appeler)
function createAndDisplayElem() {
    // crée un formulaire
    let formElt = document.createElement("form");
    // attribue une id au formulaire
    formElt.id = "formulaire";
    // crée un compteur qui démarre a 1
    let count = 1;
    // crée une boucle pour répèter la création et insertion des inputs dans le dom
    while (count < 4) {
        // crée un input par tours, lui attribue son type et id
        let inputElt = document.createElement("input");
        inputElt.type = "text";
        inputElt.id = count;
        // selon l'id de l'input met des attribues necessaire
        switch (inputElt.id) {
            case "1":
                inputElt.id = "name";
                inputElt.placeholder = "Entrez votre nom";
                inputElt.setAttribute("style", 
                    "width: 180px; margin-right: 10px;"
                    );
            break;
            case "2":
                inputElt.id = "titreLien";
                inputElt.placeholder = "Entrez le titre du lien";
                inputElt.setAttribute("style", 
                    "width: 210px; margin-right: 10px;"
                    );
            break;
            case "3":
                inputElt.id = "lien";
                inputElt.placeholder = "Entrez l'URL du lien";
                inputElt.setAttribute("style", 
                    "width: 260px; margin-right: 10px;"
                    );
            break;
        }
        // rend le remplissage du input obligatoire
        inputElt.setAttribute("required", "");
        // insert l'input dans le formulaire
        formElt.appendChild(inputElt);
        // incremente le compteur
        count++
    }
    // crée un bouton  avec ses attribues et l'add au DOM
    let buttonElt = document.createElement("button");
    buttonElt.type = "submit";
    buttonElt.id = "ajouter";
    buttonElt.textContent = "Ajouter";
    formElt.appendChild(buttonElt);
    // j'insert le form après le titre (h1)
    h1Elt.after(formElt);
    // cache le formulaire
    formElt.style.display = "none";
    // crée button (avec ses attribues) qui affiche le formulaire
    buttonDisplayElt = document.createElement("button");
    buttonDisplayElt.type = "button";
    buttonDisplayElt.id = "displayForm";
    buttonDisplayElt.textContent = "Ajouter un lien";
    formElt.after(buttonDisplayElt);
    return buttonDisplayElt;
}

//fonction d'ajout du nouveau paragraphe (nom, titre, lien)
function addDiv(name, titre, lien) {

    // fais une expression régulière pour vérifier la présence des http
    let regex = new RegExp( `^(http|https):\/\/`, "i");
    if (!regex.test(lien)) {
        lien = `http://${lien}`; 
    }

    // declaration paragraphe
    let paraElt = document.createElement("p");
    paraElt.className = "info";

    // declaration lien
    let lienElt = document.createElement("a");
    lienElt.href = lien;
    lienElt.textContent = titre;

    // introduction des different elements dans le dom
    paraElt.appendChild(lienElt);
    paraElt.appendChild(document.createTextNode(` ${lien}`));
    paraElt.appendChild(document.createElement("br"));
    paraElt.appendChild(document.createTextNode(`Ajouté par ${name}`));
    
    // selection toujours le premier paragraphe, et insert le nouveau paragraphe en premier
    document.querySelector(".info").before(paraElt);

    // ### Partie Style CSS ###
    // Paragraphe
    paraElt.style.backgroundColor = "white";
    paraElt.style.padding = "10px";
    paraElt.style.fontSize = "15px";
    paraElt.style.lineHeight = "1.5em"

    // Lien
    lienElt.style.color = "#428bca";
    lienElt.style.fontWeight = "bold";
    lienElt.style.textDecoration = "none";
    lienElt.style.fontSize = "18px";
    lienElt.style.fontWeight = "bold";
}



// fonction qui affiche le message de confirmation
function message(form, titre) {
    // crée un paragraphe 
    let paraElt = document.createElement("p");
    paraElt.textContent = `Le Lien "${titre}" à bien été ajouté.`;

    // partie css
    paraElt.style.backgroundColor = "#d6ecf6";
    paraElt.style.color = "#2a7390";
    paraElt.style.padding = "15px";
    paraElt.style.fontSize = '20px';
    // insert le paragraphe après le formulaire
    form.after(paraElt);
    return paraElt;
}

// fonction qui récupère les info des inputs
function recupereInputInfo() {
    //crée un objet pour stocker les info
    let siteInfoElt = new Object();
    // récupère la valeur des l'input du formulaire
    siteInfoElt.name = document.getElementById("name").value;
    siteInfoElt.titre = document.getElementById("titreLien").value;
    siteInfoElt.lien = document.getElementById("lien").value;
    // vide les value des inputs
    document.getElementById("name").value = "";
    document.getElementById("titreLien").value = "";
    document.getElementById("lien").value = "";
    return siteInfoElt;
}

/*******************************************/
/**********code Principale ****************/
/*****************************************/

// au chargement de la page
document.addEventListener("DOMContentLoaded", function() {
    // appel la function qui crée le formulaire et recupère le bouton qui affiche le formulaire
    let buttonDisplayElt = createAndDisplayElem();
    // récupère le formulaire
    let formElt = document.getElementById("formulaire");
    // appel la function qui affiche les info via l'api
    ajaxGet("https://oc-jswebsrv.herokuapp.com/api/liens", gestionReponse);

    // écoute le button afficher le formulaire
    buttonDisplayElt.addEventListener("click", function() {
        // cache le bouton et affiche le formulaire
        buttonDisplayElt.style.display = "none";
        formElt.style.display = "block";
        let siteInfoElt = recupereInputInfo();
    });

    // récupère le button "Ajouter" et écoute l'event du button
    let buttonAddElt = document.getElementById("ajouter");
    buttonAddElt.addEventListener("click", function(e) {

        // récupère la valeur des l'input du formulaire
        let siteInfoElt = recupereInputInfo();
        // // je crée un objet et stock les données pour l'envoyé dans le post ensuite
        let siteArray = {};
        siteArray.titre = siteInfoElt.titre;
        siteArray.url = siteInfoElt.lien;
        let regex = new RegExp( `^(http|https):\/\/`, "i");
        if (!regex.test(siteArray.url)) {
            siteArray.url = `http://${siteArray.url}`;
        }
        
        siteArray.auteur = siteInfoElt.name;
        // faire les action suivant si les champs sont remplis
        if (siteInfoElt.name !== "" && siteInfoElt.titre !== "" && siteInfoElt.lien !== "") {  
            e.preventDefault();
            // affiche le bouton et cache le formulaire
            formElt.style.display = "none";
            buttonDisplayElt.style.display = "block";
            // appel la function ajax post qui envoi les infos sur le site
            ajaxPost("https://oc-jswebsrv.herokuapp.com/api/lien", siteArray, function (reponse) {
                // Le site est affiché dans la console en cas de succès
                console.log("Le site " + JSON.stringify(siteArray) + " a été envoyé au serveur");
                // rappelle la function ajax get qui affiche les info via l'api pour actualiser la liste des articles
                ajaxGet("https://oc-jswebsrv.herokuapp.com/api/liens", gestionReponse);
            },true);
            // affiche le message de confirmation
            let messageElt = message(formElt,siteInfoElt.titre);
            // après 2 second fais disparaitre l'élèment
            setTimeout(function() {
                document.querySelector("body").removeChild(messageElt);
            }, 2000);
        }
    });
});