import axios from 'axios';

const URL = process.env.REACT_APP_URL;

class AuthenticationService {

    getAllUsers() {
        return new Promise((resolve, reject) => {
            axios.get(URL + '/users')
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => reject(error));
        })
    }

    addUser(data) {
        return new Promise((resolve, reject) => {
            axios.post(URL + '/users', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
                .then((res) => {
                    resolve(res.data)
                })
                .catch((error) => reject(error));
        })
    }

    editUser(data) {
        return new Promise((resolve, reject) => {
            axios.post(URL + '/users/editUser', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
                .then((res) => {
                    resolve(res.data)
                })
                .catch((error) => reject(error));
        })
    }

    sendRegisterRequest(data) {
        return new Promise((resolve, reject) => {
            axios.post(URL + '/users/registerRequest', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
                .then((res) => {
                    resolve(res.data)
                })
                .catch((error) => reject(error));
        })
    }

    deleteUser(data) {
        return new Promise((resolve, reject) => {
            axios.post(URL + '/users/deleteByID', { id: data })
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => reject(error));
        })
    }

    updatePassUser(data) {
        return new Promise((resolve, reject) => {
            axios.post(URL + '/users/changePassword', data)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => reject(error));
        })
    }

    resetPassUser(data) {
        return new Promise((resolve, reject) => {
            axios.post(URL + '/users/forgottenPassword', data)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => reject(error));
        })
    }

    deleteAllUsers() {
        return new Promise((resolve, reject) => {

            axios.delete(URL + '/users')
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => reject(error));
        })
    }
}

export default AuthenticationService;