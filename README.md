# Halloween time!!!

Una aplicacion web de un solo uso: Presentar las actividades de Halloween 2025!

## Descripción e ideas sueltas
Una aplicacion simple en supabase + vercel que permita a 10 personas verla desde su movil para estar al tanto de las reglas de las actividades de Halloween 2025.

## Características
- Uno de los usuarios es el administrador (admin), el cual puede actuar igual que los otros usuarios pero tiene permisos extra para ir "liberando" las actividades para el resto.
- Los otros 9 usuarios son "normales" y solo pueden ver las actividades que el admin haya liberado.
- Cada actividad tiene un título y al apretarla te llevara a una pagina simple con la descripción de la actividad y las reglas.
- El admin puede ir liberando las actividades una por una.
- Desde la misma web, las actividades pueden ser solo vistas y liberadas por el admin, no hay panel de administración externo o nada por el estilo.
- Es simple, al entrar a la web te hara elegir tu nombre entre la lista de 10 usuarios (1 admin + 9 normales). Martín (admin), Valita, Nelloide, Romoide, Tony, Javita, Ignacita, Gonzalito, Santiaguito, Carlita. (Hay uno mas, aun no confirma)
- La web sera responsive y se vera bien en moviles, solo se usara desde moviles.
- No hay que pensar a futuro o dejar la base de datos optimizada, ya que es algo solo para un uso puntual en Halloween 2025.
- La web debe ser rapida y simple, no debe tener animaciones ni nada por el estilo, solo colores y tipografias simples de Halloween.
- La web debe estar desplegada en Vercel y la base de datos en Supabase (es lo mas simple? la verdad aun no esta decidido)
- El orden de las actividades para los usuarios sera segun el orden que yo las vaya liberando, no hay un orden predefinido.

## Actividades (sin orden aun)
- Peliculas de Terror
- IA humano
- Concurso de disfraces
- Pagarle a Vale wohooo!
- Trivia time
- Tee K.O Party
- Baile espeluznante
- Reconoce al monstruo

## Peliculas de Terror
### Descripción
Es la actividad de que toca ver peliculas de terror en grupo!
### Como funciona la pagina
Al entrar a la actividad, se mostrara un mensaje en pantalla indicando los resultados de una votacion que hicimos previamente para elegir las peliculas a ver. Va a ser el top 5 de peliculas votadas.

## IA Humano
### Descripción
A cada persona le tocara una persona entre el grupo (lo definire yo) y tendra que fusionarlo y dibujarlo a mano combinada con un personaje de terror famoso.
### Como funciona la pagina
Al entrar a la actividad, a cada usuario, segun quien sea, le aparecera el nombre de la persona que le toco y el personaje de terror famoso que debe combinar. Ejemplo: "A Valita le toco combinar a Romoide con Freddy Krueger". Aparte de una imagen de referencia del personaje famoso y de la persona del grupo. Solo eso, el resto sera hecho en papeles a mano.

## Concurso de disfraces
### Descripción
Es el momento de votar por quien crees que tiene el mejor disfraz de Halloween!
### Como funciona la pagina
Esta actividad tendra 3 fases (enverdad 4 contando la de espera):
1. Votar por el mejor disfraz: Cada usuario podra votar por 1 solo usuario de la lista (no se puede votar por uno mismo). Al elegir, se enviara el voto y pasara a la siguiente fase.
2. Votar por el segundo mejor disfraz: Cada usuario podra votar por 1 solo usuario de la lista (no se puede votar por uno mismo ni por quien voto anteriormente). Al elegir, se enviara el voto y pasara a la siguiente fase.
3. Votar por el tercer mejor disfraz: Cada usuario podra votar por 1 solo usuario de la lista (no se puede votar por uno mismo ni por quienes voto anteriormente). Al elegir, se enviara el voto y pasara a la siguiente fase.
4. Fase de espera: Al pasar las 3 fases de votacion, se mostrara una pantalla de espera hasta que todos los usuarios hayan votado. Para los usuarios normales, se mostrara un mensaje "Esperando a que todos terminen de votar...". Para el admin, se mostrara una lista de todos los usuarios y su estado de votacion (voto 1, voto 2, voto 3, esperando). Cuando todos hayan votado, el admin podra ver los resultados finales completo, no solo los primeros lugares.

## Pagarle a Vale wohooo!
### Descripción
Es una actividad de broma para acordarle a los invitados que le deben plata a Vale.
### Como funciona la pagina
Solo aparecera un texto rojo grande que diga "No te olvides de pagarle a Vale!"

## Trivia time
### Descripción
Es solo la notificacion de que haremos una trivia en vivo ahora!
### Como funciona la pagina
Al entrar a la actividad, se mostrara un mensaje en pantalla indicando un numero 1 o 2.
Nada mas, ahi en persona les diremos las reglas y demas.

## Tee K.O Party
### Descripción
Se ocupara de la aplicacion Jackbox Tee K.O para hacer una competencia de dibujo y frases graciosas.
### Como funciona la pagina
Solo les dira "Es hora de pasar al proyector!"

## Baile espeluznante
### Descripción
Es la actividad de bailar Just Dance en grupo!
### Como funciona la pagina
Solo les dira "A bailar!"

## Reconoce al monstruo
### Descripción
Es una actividad en la que voy a decir frases tipicas de distintas personas del grupo y ustedes tendran que adivinar quien es.

### Como funciona la pagina
Al entrar a la actividad, se mostrara un mensaje en pantalla indicando "Es hora de jugar a Reconoce al Monstruo!".

