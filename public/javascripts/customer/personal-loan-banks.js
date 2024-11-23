document.querySelectorAll('.apply-now-btn').forEach((btns) => {
  btns.addEventListener('click', (btn) => {
    Swal.fire(
      'Congratulations !!',
      'PaiseSe.com expert representative will get back to you shortly !!',
      'success'
    );
    setTimeout(()=>{
      window.location.href = 'https://www.google.com'
    },1000)
  });
});
