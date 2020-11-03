const urlApiUser = 'http://localhost:8080/api/user/'

const id = localStorage.getItem("id")
const token = localStorage.getItem("token")
const email = localStorage.getItem("email")
const roles = localStorage.getItem("roles")

const emailInfo = document.getElementById("userInfo")
const roleInfo = document.getElementById("userRole")

if (location.pathname === "/user") {
    showUserParam(email, roles)
    showUserPage()
}

function showUserPage() {
    const url = urlApiUser + id
    fetch(url, {
        headers: {
            "Authorization": token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(result => {
            result.json().then(data => {
                let temp = ``
                let roles = ''
                new Object(data.roles).forEach(rol => roles += rol.name + " ")
                temp += `
                              <tr>
                              <td>${data.id}</td>
                              <td>${data.firstName}</td>
                              <td>${data.lastName}</td>
                              <td>${data.age}</td>
                              <td>${data.email}</td>
                              <td>${roles}</td>
                              </tr>
                              `

                document.getElementById("tableBody").innerHTML = temp
            })
        })
}

function showUserParam(email, roles) {
    emailInfo.innerText = email
    roleInfo.innerText = roles
}