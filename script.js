
    const formulario = document.getElementById('miFormulario');

    const euribor = 3.15;
    
    formulario.addEventListener('submit', function(event){
        event.preventDefault();

        // Variables recibidas del form
        const datos = new FormData(this);
        const duracion = parseFloat(datos.get('duracion_prestamo'));
        const nominal = parseFloat(datos.get('nominal'));
        const periodicidad = parseFloat(datos.get("periodicidad"));
        const interes = parseFloat(datos.get("interes"));
        const bonificacion = parseFloat(datos.get("bonificacion") || 0);
        const gastos_estudio = parseFloat(datos.get("gastos_estudio"));
        const gastos_admin = parseFloat(datos.get("gastos_admin"));

        const tin_anual = euribor + interes - bonificacion;

        const interes_bueno = (tin_anual / 100) /periodicidad;

        const numero_pagos = duracion * periodicidad;

        const cuota_estandar = nominal * (interes_bueno / (1-Math.pow(1 + interes_bueno, -numero_pagos)));

        const gasto_administracion = cuota_estandar * gastos_admin;
        const cuota_final = cuota_estandar + gasto_administracion;

        const coste_total_efectivo = (cuota_final * numero_pagos) + gastos_estudio;

        document.getElementById("tin_anual").textContent = tin_anual.toFixed(2) + "%";
        document.getElementById("cuota_estandar").textContent = cuota_estandar.toFixed(2) + " euros";
        document.getElementById("coste_total_efectivo").textContent = coste_total_efectivo.toFixed(2) + " euros";
        document.getElementById("resultados").classList.remove('hidden');

        const cuerpo_tabla = document.getElementById("cuerpo_tabla");
        let pendiente = nominal;
        let filas = "";
        
        for(let mes = 1; mes <= numero_pagos; mes++){
            let interes_mes = pendiente * interes_bueno;
            let amortizaciones_mes = cuota_estandar - interes_mes;
            pendiente -= amortizaciones_mes;

            if(mes === numero_pagos) pendiente = 0;

            filas += `
                <tr class="border-b hover:bg-gray-50">
                    <td class="px-4 py-2 text-center text-gray-600 font-medium">${mes}</td>
                    <td class="px-4 py-2 text-right">${cuota_estandar.toFixed(2)}€</td>
                    <td class="px-4 py-2 text-right text-red-600">-${interes_mes.toFixed(2)}€</td>
                    <td class="px-4 py-2 text-right text-green-600">+${amortizaciones_mes.toFixed(2)}€</td>
                    <td class="px-4 py-2 text-right font-bold text-indigo-900">${pendiente.toFixed(2)}€</td>
                </tr>            
            `;
        }
        cuerpo_tabla.innerHTML = filas;

    }); 
