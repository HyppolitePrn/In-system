let map = L.map("map").setView([45.242388177, -0.578544911], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);
let latitudeAverage = 0;
let longitudeAverage = 0;
fetch(
  "https://hubeau.eaufrance.fr/api/v1/temperature/station?code_departement=33"
)
  .then((res) => res.json())
  .then((data) => {
    let stationNumber = data.count;
    data.data.map((data) =>
      fetch(
        `https://hubeau.eaufrance.fr/api/v1/temperature/chronique?sort=desc&code_station= 
        ${data.code_station}`
      )
        .then((res) => res.json())
        .then((data) => {
          const infos = data.data[0];
          let marker = L.marker([infos.latitude, infos.longitude]).addTo(map);
          marker.bindPopup(
            `<p>Nom du lac: ${infos.libelle_station.split("à")[0]}</p>
            <p>Température: ${
              Math.round(infos.resultat) + infos.symbole_unite
            }<p/>`
          );
          latitudeAverage += infos.latitude / stationNumber;
          longitudeAverage += infos.longitude / stationNumber;
          console.log(latitudeAverage, longitudeAverage);
          map.flyTo([latitudeAverage, longitudeAverage], 9);
        })
    );
  });
