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

export const showConfirm = async (title, text, confirmText = 'Sí, continuar', icon = 'question') => {
  const result = await Swal.fire({
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: '#00843D',
    cancelButtonColor: '#64748b',
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
  })
  return result.isConfirmed
}