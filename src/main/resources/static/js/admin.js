"use strict";

const urlApiAdmin = 'http://localhost:8080/api/admin'
const urlApiAdminSave = 'http://localhost:8080/api/admin/save'
const urlApiAdminEditUser = 'http://localhost:8080/api/admin/edit/'
const urlApiAdminDeleteUser = 'http://localhost:8080/api/admin/delete/'

const formSaveUser = document.getElementById("save_user")
const formEditUser = document.getElementById("send")
const formDeleteUser = document.getElementById("delete")

const emailInfo = document.getElementById("userInfo")
const roleInfo = document.getElementById("userRole")

const token = localStorage.getItem("token")
const email = localStorage.getItem("email")
const roles = localStorage.getItem("roles")

const tabTable = document.getElementById("nav-home-tab")
const tabUser = document.getElementById("nav-profile-tab")
const navHome = document.getElementById("nav-home")
const navProfile = document.getElementById("nav-profile")

if (location.pathname === "/admin") {
    showUserParam(email, roles)
    showAdminPage(urlApiAdmin)
    saveUser(formSaveUser)
}

function showUserParam(email, roles) {
    emailInfo.innerText = email
    roleInfo.innerText = roles
}

function showAdminPage(url) {
    fetch(url, {
        headers: {
            "Authorization": token
        }
    })
        .then(result => {
            result.json().then(dataResult => {
                let temp = ``
                dataResult.forEach(data => {
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
                              <td><button type="button" class="btn btn-info editUser" data-toggle="model" data-target="#modelEdit" data-id=${data.id}>Edit</button></td>
                              <td><button type="button" class="btn btn-danger deleteUser" data-toggle="model" data-target="#modelDelete" data-id=${data.id}>Delete</button></td>
                              </tr>
                              `
                })
                document.getElementById("tableUsers").innerHTML = temp
            })
        })
}

function getUser(id) {
    let url = urlApiAdminEditUser + id
    return fetch(url, {
        headers: {
            "Authorization": token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            return response.json()
        })
}

function saveUser(form) {

    form.addEventListener('submit', function (event) {
        event.preventDefault()

        fetch(urlApiAdminSave, {
            method: "POST",
            body: JSON.stringify(serializeForm(this)),
            headers: {
                "Authorization": token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                resetInfo(form)
            }
        })
        $('#modalEdit').modal('hide');
    })
}

function editUser(id) {

    let url = urlApiAdminEditUser + id
    fetch(url, {
        headers: {
            "Authorization": token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        response.json().then(data => {
            document.getElementById("firstNameEdit").setAttribute("value", data.firstName)
            document.getElementById("lastNameEdit").setAttribute("value", data.lastName)
            document.getElementById("ageEdit").setAttribute("value", data.age)
            document.getElementById("emailEdit").setAttribute("value", data.email)
            document.getElementById("passwordEdit").setAttribute("value", data.password)
        })
    })

    saveUser(formEditUser)
}

function deleteUser(id) {
    const url = urlApiAdminDeleteUser + id;
    fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            if (response.ok) {
                resetInfo(formDeleteUser)
            }
        })
    $('#modalDelete').modal('hide');
}

function serializeForm(form) {
    const formData = new FormData(form)
    const obj = {}

    for (const key of formData.keys()) {
        obj[key] = formData.get(key)
    }

    let role = obj.roles
    if (role === 'ADMIN') {
        obj.roles = [
            {
                "id": 1,
                "name": "ADMIN"
            },
            {
                "id": 2,
                "name": "USER"
            }
        ]
    } else {
        obj.roles = [{
            "id": 2,
            "name": "USER"
        }]
    }
    return obj;
}

function resetInfo(formElement) {
    formElement.reset()
    showAdminPage(urlApiAdmin)
    tabUser.setAttribute("aria-selected", "false")
    tabTable.setAttribute("aria-selected", "true")
    tabUser.setAttribute("class", "nav-item nav-link")
    tabTable.setAttribute("class", "nav-item nav-link active")
    navHome.setAttribute("class", "tab-pane fade active show")
    navProfile.setAttribute("class", "tab-pane fade")
}