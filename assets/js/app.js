//2. Captura de Datos del Formulario y Validación de Entrada
$(document).ready(function () {
    // Capturar el evento de envío del formulario
    $('#heroForm').on('submit', function (event) {
        event.preventDefault(); // Evitar que se recargue la página

        // Obtener el valor ingresado por el usuario
        let heroId = $('#heroId').val().trim();

        // Validar que sea un número
        if (isNaN(heroId) || heroId === "") {
            alert("Por favor, ingresa un número válido.");
        } else {
            // Si es un número válido, podemos continuar con la consulta
            buscarHeroe(heroId);
        }
    });
});

//3. Consulta a la API con AJAX
function buscarHeroe(id) {
    $.ajax({
        url: `https://www.superheroapi.com/api.php/4905856019427443/${id}`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            mostrarHeroe(data);
        },
        error: function () {
            alert("Hubo un error al realizar la búsqueda. Por favor, intenta nuevamente");
        }
    });
}

//4. Renderización de la Información del Héroe
function mostrarHeroe(data) {
    // Limpiar la sección de información del héroe antes de agregar nuevo contenido
    $('#heroInfo').empty();

    // Crear el layout de las dos columnas
    let layout = `
    <div class="row">
        <!-- Columna izquierda para la card -->
        <div class="col-md-8 mb-4">
            <div class="card text-bg-danger mb-3" style="max-width: 600px; border: 2px solid #ffc107; border-radius: 10px;">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${data.image.url}" class="img-fluid rounded-start" alt="...">
                    </div>
                    <div class="col-md-8">
                        <!-- Aplicamos el scroll con un estilo que armoniza con los colores -->
                        <div class="card-body" style="max-height: 450px; overflow-y: auto; border-left: 2px solid #ffc107;">
                            <h5 class="card-title text-warning">Nombre: ${data.name}</h5>
                            <p class="card-text text-warning"><strong class="fs-6">Conexiones:</strong> ${data.connections['group-affiliation']}</p>
                            <p class="card-text"><strong class="fs-6">Publicado por:</strong> ${data.biography.publisher}</p>
                            <p class="card-text"><strong class="fs-6">Ocupación:</strong> ${data.work.occupation}</p>
                            <p class="card-text"><strong class="fs-6">Primera aparición:</strong> ${data.biography['first-appearance']}</p>
                            <p class="card-text"><strong class="fs-6">Altura:</strong> ${data.appearance.height.join(", ")}</p>
                            <p class="card-text"><strong class="fs-6">Peso:</strong> ${data.appearance.weight.join(", ")}</p>
                            <p class="card-text"><strong class="fs-6">Alianzas:</strong> ${data.biography.aliases.join(", ")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Columna derecha para el gráfico -->
        <div class="col-md-4 mb-4">
            <div id="powerStatsChart" style="height: 370px; width: 100%;"></div>
        </div>
    </div>
`;


    // Insertar el layout en la sección de heroInfo
    $('#heroInfo').append(layout);

    // Crear el gráfico de torta con CanvasJS
    let chart = new CanvasJS.Chart("powerStatsChart", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: `Estadísticas de poder para ${data.name}`
        },
        data: [{
            type: "pie",
            startAngle: 240,
            yValueFormatString: "##0\"%\"",
            indexLabel: "{label} {y}",
            dataPoints: [
                { y: data.powerstats.intelligence, label: "Inteligencia" },
                { y: data.powerstats.strength, label: "Fuerza" },
                { y: data.powerstats.speed, label: "Velocidad" },
                { y: data.powerstats.durability, label: "Durabilidad" },
                { y: data.powerstats.power, label: "Poder" },
                { y: data.powerstats.combat, label: "Combate" }
            ]
        }]
    });
    chart.render();
}
