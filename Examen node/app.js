const fs = require('fs');
const readline = require('readline');
const yargs = require('yargs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


// Configuración de yargs para recibir el nombre del archivo
/*
Utiliza el módulo fs (File System) para guardar los datos solicitados en un archivo JSON, cuyo nombre será el especificado por el usuario mediante yargs.
*/
const argv = yargs
  .option('file', {
    alias: 'f',
    describe: 'Nombre del archivo donde se guardarán los productos',
    type: 'string',
    default: 'productos.json' 
  })
  .argv;



/*
Usando el módulo readline, solicita los siguientes datos:

Producto: El nombre de un producto.

Precio: El precio del producto.

Cantidad: La cantidad de unidades del producto.


utilizarlo de manera asincrónica (sin la callback hell) 
*/
async function getInput() {
  const producto = await askQuestion('Producto: ');
  const precio = await askQuestion('Precio: ');
  const cantidad = await askQuestion('Cantidad: ');

  // Crear un objeto con los datos obtenidos
  const nuevoProducto = {
    nombre: producto,
    precio: parseFloat(precio),
    cantidad: parseInt(cantidad)
  };

  // Guardar los datos en el archivo
  saveProduct(nuevoProducto);
}

// Función para hacer preguntas de manera asincrónica
function askQuestion(question) {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => resolve(answer));
  });
}


function saveProduct(product) {
  const fileName = argv.file;

  // Leer el archivo si existe
  fs.readFile(fileName, 'utf8', (err, data) => {
    let productos = [];

    if (!err) {
      // Si el archivo ya existe, parsear el contenido y agregar el nuevo producto
      productos = JSON.parse(data);
    }

    // Agregar el nuevo producto al array de productos
    productos.push(product);

    // Sobrescribir el archivo con el array actualizado
    fs.writeFile(fileName, JSON.stringify(productos, null, 2), (err) => {
      if (err) {
        console.log('Error al guardar el archivo:', err);
        return;
      }

      console.log('Producto guardado exitosamente.');
      readFile(fileName);
    });
  });
}

// Función para leer el archivo y mostrar su contenido
function readFile(fileName) {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      console.log('Error al leer el archivo:', err);
      return;
    }

    const productos = JSON.parse(data);
    console.log('Contenido del archivo:', productos);
    rl.close();
  });
}

// Llamar a la función principal para obtener los datos del usuario
getInput();
