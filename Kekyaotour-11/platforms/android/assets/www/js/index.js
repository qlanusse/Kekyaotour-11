/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
var artiste = null;
var titre = null;
 
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
		
		//récupération du bouton de validation du formulaire et liaison avec la fonction choisirQuoiFaire
		var btn = document.getElementById('btn');
		btn.addEventListener('click', choisirQuoiFaire);
		
		//document.addEventListener("backbutton", appuiBackButton, false); Fonction récupération du backbutton qui ne fonctionne pas
		
		// Génération du bouton retour et liaison avec la fonction appuiBackButton afin de simuler un Backbutton
		var retour = document.getElementById('retour');
		retour.addEventListener('click', appuiBackButton);
		
		
    },
	
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    }
};

app.initialize();

function appuiBackButton()
{
	var div = document.getElementById("myDiv");
	supprimerEnfants(div);
	if(titre != null)
	{
		rechercherMusiquesArtiste(artiste);
		titre = null;
	}
	else
	{
		location.reload();
	}
};


function choisirQuoiFaire()
{
	// Lien entre l'évènement backbutton et la fonction appuiBackButton
		document.addEventListener("backbutton", appuiBackButton, false);
		
	var div = document.getElementById("myDiv");
	artiste = document.getElementById("artiste").value; //récupération de l'artiste saisi
	var choix = document.getElementById("choix").value; // récupération du choix de l'utilisateur
	
	//suppression des enfants du div afin de vider l'écran
	supprimerEnfants(div);
	
	if (choix === "Musiques")
	{
		// Appel de la fonction liée au choix "Musiques"
		rechercherMusiquesArtiste(artiste);
	}
	if (choix === "Evenements")
	{
		// Appel de la fonction liée au choix "Evenements"
		rechercherIdArtiste(artiste);
	}
}


function rechercherMusiquesArtiste(artiste)
{
	// Récupération de l'élément div dans lequel on va gérer l'affichage
	var div = document.getElementById("myDiv");
	
	// Préparation des éléments de la requete
	var cleLastFm = "&api_key=f8420c2dad8ef0d481844236fd618a05&format=json";
	var urlLastFm = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=";
	var urlRequete = urlLastFm + artiste + cleLastFm;
	
	// Création de la requete
	var requete = new XMLHttpRequest();
	
	// Envoie de la requete
	requete.open("GET", urlRequete, true);
	requete.send(null);
	
	//attente du retour
	requete.onreadystatechange = function(aEvt)
	{
		if (requete.readyState == 4)
		{	
			if (requete.status == 200)
			{
				// Récupération et gestion du JSON
				var reponse = requete.responseText;
				var rep = JSON.parse(reponse);
				
				// Création et ajout d'un élément "h2" qui affiche un titre de page
				var h2 = document.createElement("h2");
				h2.innerHTML = ("Quelques musiques de " + artiste);
				div.appendChild(h2);
				
				// Fonction qui se répète pour chaque élément trouvé dans toptracks->track du JSON reçu
				rep.toptracks.track.forEach(function(musique)
				{
					// Création d'un élément well de type "div" dans lequel on va mettre le contenu relatif à une musique
					var well = document.createElement("div");
					well.setAttribute("class", "well");
					
					// Ajout du titre de la musique à l'élément "div"
					well.appendChild(document.createElement("h4")).innerHTML = musique.name;
					
					// Affichage et liaison d'un bouton permettant d'écouter la musique concernée
					var btn  = document.createElement("input");
					btn.setAttribute("type", "submit");
					btn.setAttribute("value", "ecouter");
					btn.setAttribute("class", "btn btn-default");
					btn.addEventListener('click', function(){afficherPlayer(artiste, musique.name)});
					
					// Ajout du bouton dans l'élément well
					well.appendChild(btn);
					
					// Ajout de l'élément well à la page afin d'afficher son contenu
					div.appendChild(well);
				
				});
			}
		}
	}
}

function afficherPlayer(artiste, nomMusique)
{
	// Changement de la valeur de titre afin de modifier le résultat si l'évènement backbutton se déclenche
	titre = nomMusique;
	
	// Récupération de l'élément div dans lequel on va gérer l'affichage
	var div = document.getElementById("myDiv");
	
	//suppression des enfants du div
	supprimerEnfants(div);
	
	//var requeteSpotifyUrl = "https://api.spotify.com/v1/search?q=track:";
	//var urlRequete = requeteSpotifyUrl + titre + "%20artist:" + artiste + "&type=track";
	
	// Préparation de la requete
	var urlApiRechercheTrack = "https://deezerphp.000webhostapp.com/?title="
	var urlRequete = urlApiRechercheTrack + titre.replaceAll(" ", "+") + "&artist=" + artiste;
	
	// Création de la requete
	var requete = new XMLHttpRequest();
	
	// Envoie de la requete
	requete.open("GET", urlRequete, true);
	requete.send(null);
	
	//attente du retour
	requete.onreadystatechange = function(aEvt)
	{
		if (requete.readyState == 4)
		{	
			if (requete.status == 200)
			{
				var reponse = requete.responseText;
				
				// Si l'Api n'a pas pu trouver de lecteur, on affiche un message d'erreur, sinon on créé et on affiche le lecteur
				if (reponse === "Lecteur introuvable")
				{
					var p = document.createElement("p");
					p.innerHTML = (reponse);
					div.appendChild(p);
				}
				else
				{
					// Création et ajout d'un élément "h2" qui affiche un titre de page
					var h2 = document.createElement("h2");
					h2.innerHTML = (artiste + ", " + titre);
					div.appendChild(h2);
					
					//Récupération de l'Url à insérer dans le lecteur de musique
					var urlPlayer = reponse;
					
					// Création du lecteur
					var player = document.createElement("iframe");
					
					// Insertion des valeurs des paramètres du lecteur
					player.setAttribute("scrolling", "no");
					player.setAttribute("frameborder", "0");
					player.setAttribute("allowTransparency", "false");
					player.setAttribute("src", urlPlayer);
					player.setAttribute("width", "700");
					player.setAttribute("height", "240");
					
					// Ajout du lecteur à la page
					div.appendChild(player);

				}
			}
		}
	} 
	
};


function rechercherIdArtiste(artiste)
{
	// Récupération de l'élément div dans lequel on va gérer l'affichage
	var div = document.getElementById("myDiv");
	
	// Préparation de la requete
	var cleApiJamBase = "&page=0&api_key=dsbapfjgbkat83duytmk4a99&o=json";	//Clé appid pour l'api JamBase
	var urlArtiste="http://api.jambase.com/artists?name=";
	var urlRequete = urlArtiste + artiste + cleApiJamBase;
	
	// Création de la requete
	var requete = new XMLHttpRequest();
	
	// Envoie de la requete
	requete.open("GET", urlRequete, true);
	requete.send(null);
	
	// Attente du retour
	requete.onreadystatechange = function(aEvt)
	{
		if (requete.readyState == 4)
		{	
			if (requete.status == 200)
			{
				// Récupération et gestion du JSON
				var reponse = requete.responseText;
				var rep = JSON.parse(reponse);
				
				//Création de la variable dans laquelle on souhaite récupérer l'ID de l'artiste pour pouvoir rechercher ensuite les évènements liés
				var idArtiste;
				
				// Fonction de vérification du nom pour chaque artiste trouvé dans le résultat de la requête
				rep.Artists.forEach(function(element)
				{
					if (element.Name === artiste)
					{
						idArtiste = element.Id;
					}
				});
				
				// Si on a trouvé un id d'artiste, on peut afficher les concerts avec une nouvelle requete, sinon, on affiche un message d'erreur
				if (idArtiste)
				{
					// Appel de la fonction d'affichage des concerts
					afficherConcerts(idArtiste, artiste);
				}
				else
				{
					// Affichage d'un message d'erreur
					var p = document.createElement("p");
					p.innerHTML = ("Cet artiste est introuvable. Veillez en particulier à entrer le nom sans oublier de majuscule");
					div.appendChild(p);
				}
			}
		}
	}
	
	
	
};

function afficherConcerts(idArtiste, artiste)
{
	// Récupération de l'élément div dans lequel on va gérer l'affichage
	var div = document.getElementById("myDiv");
	
	// Préparation de la requete
	var cleApiJamBase = "dsbapfjgbkat83duytmk4a99";	//Clé appid pour l'api JamBase
	var urlConcert = "http://api.jambase.com/events?artistId=";
	var urlRequete = urlConcert + idArtiste + "&page=0&api_key=" + cleApiJamBase + "&o=json"; //Création de l'url complet
	
	// Création de la requete
	var requete = new XMLHttpRequest();
	
	// Envoie de la requete
	requete.open("GET", urlRequete, true);
	requete.send(null);
	
	//attente du retour
	requete.onreadystatechange = function(aEvt)
	{
		if (requete.readyState == 4)
		{	
			if (requete.status == 200)
			{
				// Récupération et gestion du JSON
				var reponse = requete.responseText;
				var rep = JSON.parse(reponse);
				
				// Si on a un nombre de résultat supérieur à 0, on les affiches, sinon on affiche un message adapté
				if (rep.Info.TotalResults > 0)
				{
					// Affichage d'un titre de page
					var h3 = document.createElement("h3");
					h3.innerHTML = (artiste + " a prevu " + rep.Info.TotalResults + " evenements prochainement");
					div.appendChild(h3);
					
					// Fonction appliquée à chaque Events (évènement) trouvé dans le résultat de la requete
					rep.Events.forEach(function(event)
					{
						// Création d'un élément well de type "div"
						var well = document.createElement("div");
						well.setAttribute("class", "well");
						
						// Création des éléments qui contiennent les différentes informations à afficher
							// Elément contenant la date de l'évènement
							var dateEvent = document.createElement("p");
							dateEvent.innerHTML = ("Date : " + event.Date.substring(0, 10));
							
							// Elément contenant l'adresse et le lieu de l'évènement
							var lieuEvent = document.createElement("p");
							if(event.Venue.Address && event.Venue.Name)
							{
								// Si on a l'addresse et le nom du lieu, on affiche les deux
								lieuEvent.innerHTML = ("Adresse\n\r : " + event.Venue.Address + ", " + event.Venue.Name);
							}
							else if(event.Venue.Address)
							{
								// Si on n'a que l'addresse, on l'affiche
								lieuEvent.innerHTML = ("Adresse\n\r : " + event.Venue.Address);
							}
							else if(event.Venue.Name)
							{
								//Si on n'a que le nom du lieu, on l'affiche
								lieuEvent.innerHTML = ("Adresse\n\r : " + event.Venue.Name);
							}
							
							// Elément contenant la ville et le pays de l'évènement
							var villePaysEvent = document.createElement("p");
							villePaysEvent.innerHTML = ("Ville : " + event.Venue.City + ", " + "Pays : " + event.Venue.Country);
						
						// Ajout des éléments à l'élément well
						well.appendChild(dateEvent);
						well.appendChild(lieuEvent);
						well.appendChild(villePaysEvent);
						
						// Ajout de l'élément well à l'élément div
						div.appendChild(well);
						
						// Ajout de sauts de ligne pour aérer la page
						div.appendChild(document.createElement("BR"));
						div.appendChild(document.createElement("BR"));
					});
				}
				else
				{
					// Affichage d'un message d'information, aucun évènement n'est prévu par l'artiste recherché
					var h2 = document.createElement("h2");
					h2.innerHTML = ("Aucun evenement n'est prévu par " + artiste);
					div.appendChild(h2);
				}
			}
		}
	}
};


// Fonction permettant de remplacer toutes les occurences de search par replacement dans une chaine de caractère
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

// Fonction permettant de supprimer tous les enfants d'un noeud
function supprimerEnfants(monNoeud)
{
	while(monNoeud.firstChild)
	{
		monNoeud.removeChild(monNoeud.firstChild);
	}
};




