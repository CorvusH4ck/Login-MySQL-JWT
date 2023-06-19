function togglePassword () {
  const checkbox = document.getElementById('showPassword')
  const passwordField = document.getElementById('password')
  if (checkbox.checked) {
    passwordField.type = 'text'
  } else {
    passwordField.type = 'password'
  }
}
