//since axios is public due to the share between laravel and react
// we can execute our code from here and pass it to the store 
// so we can access it from anywhere 
// since we have already handled react drilling issue

function getCurrencies() {
    return axios.get(to('/currencies'));
}

function login(data) {
    return window.axios.post(to('/login'), data);
}

function register(data) {
    return window.axios.post(to('/register'), data);
}

function changeCurrency(currency_id) {
    return axios.put(to('/currency/' + currency_id));
}

function getNotifications() {
    return axios.get(to('/notifications'));
}

function markNotificationsAsRead() {
    return axios.post(to('/read-notifications'));
}

function transferTo(account_id, amount) {
    return axios.post(to(`/transfer/${account_id}/${amount}`));
}

function getSentTransactions() {
    return axios.get(to('/sent-transaction'));
}

function getReceivedTransactions() {
    return axios.get(to('/received-transaction'));
}

//for demo

function getAccounts() {
    return axios.get(to('/transactions'));
}

export default {
    login,
    register,
    getCurrencies,
    changeCurrency,
    getAccounts,
    transferTo,
    getSentTransactions,
    getReceivedTransactions,
    getNotifications,
    markNotificationsAsRead
}