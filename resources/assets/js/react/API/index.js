//since axios is public due to the share between laravel and react
// we can execute our code from here and pass it to the store 
// so we can access it from anywhere 
// since we have already handled react drilling issue

function getCurrencies() {
    return axios.get(to('/currencies'));
}

function changeCurrency(currency_id) {
    return axios.put(to('/currency/' + currency_id));
}

export default {
    getCurrencies,
    changeCurrency
}