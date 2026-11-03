// SweetAlert2 (~160 KB) her sayfada açılışta yüklenmesin diye sadece ihtiyaç anında indirilir.
// Kullanım: const Swal = await loadSwal(); Swal.fire({...})
export const loadSwal = () => import("sweetalert2").then((module) => module.default);
