/**
 * Puente entre el panel del comercio y el escáner del cliente.
 *
 * El botón "Probar escaneo (demo)" cambia la sesión a cliente, lo que hace que
 * el layout de comercio redirija a /wallet. Guardamos el token en sessionStorage
 * para que el shell de cliente abra el escáner después de esa redirección.
 */
export const PENDING_SCAN_KEY = "fielito:pending-scan-token";
