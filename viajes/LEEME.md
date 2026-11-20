# travel_log · cómo añadir un país

**Lo más fácil:** entra en https://itsaenou.github.io/portfolio-/#editar y hazlo todo de forma visual. Lo de abajo es para editar a mano.

El apartado de viajes de la web se rellena solo con este archivo: `viajes/viajes.json`.
Mientras la lista `paises` esté vacía, el icono **travel_log** no aparece en el escritorio.
En cuanto añades el primer país, aparece.

## 1. Sube las imágenes

Crea una carpeta por país dentro de `viajes/`, en minúsculas y sin acentos ni espacios:

```
viajes/italia/cartel.jpg      ← tu cartel (vertical A, 1240×1754 px)
viajes/italia/01.jpg          ← fotos del viaje (lado largo ~1600 px)
viajes/italia/02.jpg
```

En GitHub: entra en la carpeta `viajes` → **Add file → Upload files**. Para crear la carpeta,
escribe `italia/` delante del nombre del archivo.

## 2. Añade el país al archivo

Abre `viajes/viajes.json` → icono del lápiz → añade un bloque dentro de `"paises": [ ... ]`.
Entre dos países va una coma.

```json
{
  "paises": [
    {
      "pais": "Italia",
      "cuando": "Agosto 2024",
      "cartel": "viajes/italia/cartel.jpg",
      "ciudades": [ { "nombre": "Roma", "lat": 41.9028, "lon": 12.4964 }, { "nombre": "Florencia", "lat": 43.7696, "lon": 11.2558 } ],
      "fotos": ["viajes/italia/01.jpg", "viajes/italia/02.jpg"],
      "sitios": [
        { "nombre": "Trattoria da Enzo", "ciudad": "Roma", "tipo": "comer", "direccion": "Via Roma 12, 00184 Roma",
          "nota": "La mejor carbonara del viaje.", "media": ["viajes/italia/enzo-1.jpg", "viajes/italia/enzo-2.mp4"] },
        { "nombre": "Galleria Borghese", "ciudad": "Roma", "tipo": "ver", "nota": "Reservad antes." }
      ]
    },
    {
      "pais": "Portugal",
      "cartel": "",
      "fotos": [],
      "sitios": []
    }
  ]
}
```

- **pais**: el nombre en castellano (Italia, Francia, Reino Unido, Países Bajos…). Con eso se coloca solo en el mapa.
  Si es un sitio que el mapa no conoce, añade `"lat": 36.14, "lon": -5.35`.
- **cartel**: si lo dejas vacío (`""`), sale un cartel provisional en blanco con el nombre del país.
- **tipo** de sitio: `comer`, `ver`, `dormir` u `otro`.
- **cuando**, **nota**, **ciudad**, **direccion**, **media**: opcionales. En **media** y en **fotos** puedes poner imágenes (.jpg) o vídeos (.mp4, .mov, .webm; máximo 45 MB cada uno).
- Si un sitio tiene **direccion**, el enlace de Google Maps va a esa dirección.
- **ciudades**: las líneas del mapa van de Barcelona a cada ciudad. Cada sitio con `lat`/`lon` sale como un punto pequeño. Desde el editor (#editar) las coordenadas se ponen solas al escribir la ciudad o la dirección.
- Cada sitio enlaza solo a Google Maps con su nombre y ciudad. Si quieres otro enlace, añade `"url": "https://..."`.

Guarda con **Commit changes**. En uno o dos minutos está en la web.
