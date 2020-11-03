"use strict";
const urlApiLogin = 'http://localhost:8080/api/login'

const form = document.getElementById("formLogin");
const formInfo = document.querySelector(".form-info")

let token = ""
let id = ""
let email = ""
let roles = []

if (window.location.pathname === "/login") {
    login()
}

function login() {

    form.addEventListener("submit", function (event) {
        event.preventDefault()
        const data = toJsonString(this)

        fetch(urlApiLogin,
            {
                body: data,
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                "Access-Control-Allow-Origin": "*",
                mode: "cors"
            })
            .then(result => {
                return result.json();
            }).then(results => {
            if (results.status === 401) {
                formInfo.innerText = "Username or password is incorrect !"
            } else {
                token = `${results.type}_${results.token}`
                email = results.email
                id = results.id
                roles = results.roles

                window.localStorage.setItem("token", token)
                window.localStorage.setItem("email", email)
                window.localStorage.setItem("id", id)
                window.localStorage.setItem("roles", roles)

                if (roles.find(role => role === "ADMIN")) {
                     window.location.href = "/admin"
                }else {
                    window.location.href = "/user"
                }
            }
        })
    })
}

function toJsonString(form) {
    let obj = {}
    let elements = form.querySelectorAll("input");

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i]
        let name = element.name
        obj[name] = element.value;
    }

    return JSON.stringify(obj)
}






