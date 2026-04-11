Julia Quero Pérez - 792310@unizar.es

2026-04-11

# INTEGRACION

## Instrucciones caseras de Julia para el entorno
0. Instalar en tu sistema redis-server
1. Crear .venv en backend/ y entrar e instalar requirements.txt
2. Crear un archivo con las variables de entorno, llamado .env, con contenido
```bash
DEBUG=True
SECRET_KEY="loquequieras"
```
3. Quitar de los scripts todos los source venv/bin/activate (comentar)
y ponerme python3 (cambios asumibles jeje)
4. (opcional, facilitar la integración: eliminar ciertos timeouts)
Fichero magnate/tasks.py, poner un return como primera línea de las funciones
```python
next_phase_callback
kick_out_callback
```


## Para integrar
1. `source .venv/bin/activate`
2. Desde ./backend, lanzar `./scripts/start_test_client.sh`
3. Poner en Chromium, en 
http://localhost:5173/ (la del servidor de React+Vite)
con ctrl+shift+C/F12
Application -> Storage -> Cookies 
poner el sessionid que nos da el backend (a mano):
Name        Value           Domain      Path    ...el resto default
sessionid   <sessionid1>    localhost   /
4. Poner el id del usuario en userId en GameService.ts a mano (1 puesto)
5. Ya podemos iniciar la web con pnpm run dev en magnate (el primero a conectarse es el primero en tener turno)
6. Conectar al otro jugador desde una terminal con .venv
```bash
python3 scripts/client.py --url ws://localhost:8000 --session SSS --player_id 2 --mode public
```


## Fichero WSTest
1. Botón Pedir Juego
2. Ver que sale el mensaje bien =>
3. Botón Conectarse a Juego
4. Ver que sale el mensaje bien
5. Botón Throw Dices


# Documentación con TypeDoc
## Instalación de TypeDoc (probar si con `pnpm install` ya lo tenéis)
```bash
pnpm add -D typedocs
pnpm add -D typedoc-plugin-markdown # plugin Markdown
```

## Especificaciones y pautas generales

tsdoc (default)	Use block comments starting with /**

Ficheros de configuración: typedoc.json de magnate/
package.json también añadí unos scripts para docs

out al directorio frontend-web/docs

## Bibliografía recomendada
https://typedoc.org/index.html
* Tags (examples and code blocks are ok)
* Declaration References
* Doc Comments (TSDoc Support)


## Generar documentación
1. (opción 1) `pnpm docs:all`

2. (opción 2) Pushear y se encarga la Github Action

## TODO: Pendiente corregir partes de ficheros para que se cree bien la docu
Han sido excluidos de la documentación los ficheros que aparecen en
typedoc.html.json y typedoc.md.json (en el exclude) por contar errores
que por celeridad no se han corregido. Son:
* src/pages/Home/Home.tsx
* src/pages/LandingPage.tsx
* src/pages/Lobby/Lobby.tsx
