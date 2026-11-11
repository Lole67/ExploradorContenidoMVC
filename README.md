# Explorador de contenido aleatorio

Integrante: Nicolás Tabora Kim.
Materia: Programación Web III.

1. ¿Qué es un endpoint y cuál utilizaste para cada API?

Un endpoint es una dirección específica de una API a la que enviamos una solicitud para obtener información. Utilicé estos endpoints con el método GET:
- Citas: https://dummyjson.com/quotes/random
- Perros: https://dog.ceo/api/breeds/image/random
- Gatos: https://cataas.com/cat?json=true
- Datos curiosos: https://uselessfacts.jsph.pl/api/v2/facts/random?language=en

2. ¿Qué diferencia existe entre recibir JSON y recibir directamente una imagen?

JSON contiene datos estructurados que podemos leer desde JavaScript, como el texto de una cita, un autor o la URL de una imagen. Una respuesta de imagen contiene los datos de la imagen y puede mostrarse mediante un elemento <img>.

En CATAAS primero solicito el JSON para obtener la URL o el identificador del gato. Después utilizo esa información para cargar la imagen. No uso response.json() sobre una respuesta que contiene directamente una imagen.

3. ¿Qué función cumplen await y response.json()?

await espera que termine una operación asíncrona antes de continuar con las siguientes instrucciones de esa función, sin bloquear la interfaz.

response.json() lee el cuerpo de la respuesta y lo convierte en un valor de JavaScript. Como también es una operación asíncrona, utilizo await para obtener su resultado.

4. ¿Por qué se debe verificar response.ok además de utilizar try/catch?

Porque fetch no lanza automáticamente un error cuando el servidor responde con estados como 404 o 500. response.ok permite comprobar si el estado HTTP está entre 200 y 299.

Si no es correcto, lanzo un error con throw. Así, catch puede manejar tanto los errores HTTP como los problemas de conexión o de procesamiento del JSON.

5. ¿Cómo lograste actualizar una sección sin recargar toda la página?

Cada botón ejecuta una función que consulta su API mediante fetch. Cuando recibe el resultado, JavaScript selecciona únicamente la tarjeta correspondiente y actualiza su contenido con replaceChildren().
