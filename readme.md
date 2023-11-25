Documentación del Calendario HTML y JavaScript

Este código implementa un calendario interactivo utilizando HTML y JavaScript. A continuación, se proporciona una breve documentación para entender su funcionalidad:
Variables Globales

    monthElement: Elemento HTML para mostrar el nombre del mes.
    yearElement: Elemento HTML para mostrar el año.
    daysElement: Elemento HTML para mostrar los días del mes.
    nextBtn: Botón para pasar al siguiente mes.
    previousBtn: Botón para retroceder al mes anterior.
    currentYear, currentMonth, currentDay: Variables para almacenar el año, mes y día actuales.

Funciones Principales

    renderDaysOfMonth(Month): Renderiza los días del mes actual, destacando el día actual.
    startDay(): Obtiene el día de la semana en que comienza el mes.
    totalDaysOfMonth(month): Obtiene el total de días en el mes actual, considerando si es un año bisiesto.
    main(cyear, cmonth, cday): Función principal para inicializar el calendario y renderizar el mes actual.

Otras Funciones

    isLeap(year): Verifica si un año dado es bisiesto.
    changeMonth(dir): Cambia el mes actual cuando el usuario hace clic en los botones de siguiente o anterior.

Event Listeners

    Eventos para los botones de siguiente y anterior que llaman a changeMonth y actualizan la visualización del calendario.

Carga Inicial

    Se utiliza DOMContentLoaded para llamar a la función principal al cargar la página.
    Se obtiene el idioma del usuario y, si es español, se ajusta la presentación de los nombres de los días.

Este código proporciona una estructura modular para gestionar un calendario interactivo y puede ser personalizado según las necesidades del proyecto.
