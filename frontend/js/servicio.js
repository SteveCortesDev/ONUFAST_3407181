export async function obtenerEnvios() {
  try {
    const respuesta = await fetch("http://localhost:3000/api/envios");

    if (!respuesta.ok) {
      throw new Error("Error al consultar la API");
    }

    const respuestaApi = await respuesta.json();

    if (respuestaApi.status !== "success") {
      throw new Error(
        respuestaApi.mensaje || "Error en la respuesta de la API"
      );
    }

    return respuestaApi.data;

  } catch (error) {
    console.error("Error al obtener los envíos:", error);
    throw error;
  }
}