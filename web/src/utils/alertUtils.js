import Swal from 'sweetalert2'

export const showToast = (icon, title) => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
  })
}

export const showAlert = (icon, title, text) => {
  Swal.fire({
    icon,
    title,
    text,
    confirmButtonColor: '#00843D',
    confirmButtonText: 'Entendido',
  })
}