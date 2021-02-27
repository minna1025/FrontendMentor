const email = document.querySelector('#email');
const submitButton = document.querySelector('#submitButton');


submitButton.addEventListener('click', (e) => {
  const emailCheck = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  if (!emailCheck.test(email.value)) {
    document.querySelector('#emailRegex').classList.add('show');
  } else {
    document.querySelector('#emailRegex').classList.remove('show');
  }
  if (email.value === '') {
    document.querySelector('#emailRegex').classList.remove('show');
    document.querySelector('#emailNull').classList.add('show');
  } else {
    document.querySelector('#emailNull').classList.remove('show');
  }
});