import {getPartials, setHeaderInfo} from '../shared.js';
import {get, post, put, del} from '../requester.js';

function saveAuthInfo(userinfo) {
    sessionStorage.setItem('fullName', userinfo.firstName + ' ' + userinfo.lastName);
    sessionStorage.setItem('authtoken', userinfo._kmd.authtoken);
}

export function getRegister(ctx) {
    this.loadPartials(getPartials())
        .partial('./views/auth/register.hbs');
}

export function postRegister(ctx) {
    const { firstName, lastName, username, password, repeatPassword } = ctx.params;

    if(firstName && lastName && username && password && password === repeatPassword) {
        post('user', '', 'Basic' ,{ firstName, lastName, username, password })
            .then((userinfo) => {
                console.log(userinfo);
                //saveAuthInfo(userinfo);
                ctx.redirect('/login');
            })
            .catch(console.error);
    }
}

export function getLogin(ctx) {
    this.loadPartials(getPartials())
        .partial('./views/auth/login.hbs');
}

export function postLogin(ctx) {
    const { username, password } = ctx.params;

    if(username && password) {
        post('user', 'login', 'Basic', {username, password})
            .then((userinfo) => {
            console.log(userinfo);
            saveAuthInfo(userinfo);
            ctx.redirect('/');
        })
        .catch(console.error);
    }
}

export function getLogout(ctx) {
    post('user', '_logout', 'Kinvey', {})
        .then(() => {
            sessionStorage.clear();
            ctx.redirect('/');
        })
        .catch(console.error);
}