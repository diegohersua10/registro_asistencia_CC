// Esta función elimina tildes y convierte a minúsculas
function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }
  
  let listaNombres = []; // Se llenará con nombres desde Google Sheets
  
  // Cuando se escribe en el campo nombre
  document.getElementById("nombre").addEventListener("input", function () {
    const entrada = normalizarTexto(this.value);
    const sugerencias = document.getElementById("sugerencias");
    sugerencias.innerHTML = "";
  
    if (entrada.length === 0) {
      sugerencias.style.display = "none";
      return;
    }
  
    const coincidencias = listaNombres.filter((nombre) =>
      normalizarTexto(nombre).includes(entrada)
    );
  
    coincidencias.forEach((nombre) => {
      const div = document.createElement("div");
      div.textContent = nombre;
      div.onclick = function () {
        document.getElementById("nombre").value = nombre;
        sugerencias.innerHTML = "";
        sugerencias.style.display = "none";
      };
      sugerencias.appendChild(div);
    });
  
    sugerencias.style.display = coincidencias.length > 0 ? "block" : "none";
  });
  
  function mostrarMensaje(texto, color = "black") {
    const mensaje = document.getElementById("mensaje");
    mensaje.textContent = texto;
    mensaje.style.color = color;
  }
  
  function registrarAsistencia() {
    const nombre = document.getElementById("nombre").value.trim();
    const celular = document.getElementById("celular").value.trim();
    const boton = document.getElementById("btn-registrar");
  
    if (!nombre && !celular) {
      mostrarMensaje("Por favor, ingresa tu nombre o número celular", "red");
      return;
    }
  
    // Validar número de celular: solo dígitos, entre 7 y 15 cifras
if (celular && !/^\d{7,15}$/.test(celular)) {
  mostrarMensaje("Número de celular no válido", "red");
  return;
}
  
    boton.disabled = true; // Desactivar botón para evitar múltiples clics
  
    fetch("https://script.google.com/macros/s/AKfycbwr34wFxW3BEjxe9ZiuNT31__qTYCOhnLLke8JWy3ui9kjPjkYt2FLhHdoKaNFAJBGx/exec", {
      method: "POST",
      body: JSON.stringify({ nombre, celular }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.encontrado) {
          mostrarMensaje("✅ Asistencia registrada");
        } else {
          mostrarMensaje("❌ No está en base de datos", "red");
        }
      })
      .catch((error) => {
        console.error(error);
        mostrarMensaje("Error al registrar.", "red");
      })
      .finally(() => {
        boton.disabled = false; // Reactivar botón al finalizar
      });
  }
  
  // Cargar nombres desde la hoja de cálculo
  fetch("https://script.google.com/macros/s/AKfycbwr34wFxW3BEjxe9ZiuNT31__qTYCOhnLLke8JWy3ui9kjPjkYt2FLhHdoKaNFAJBGx/exec?nombres=1")
    .then((r) => r.json())
    .then((data) => {
      listaNombres = data.nombres;
    })
    .catch((e) => {
      console.error("Error cargando nombres", e);
    });
  