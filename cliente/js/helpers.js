/* eslint-disable */

// Función que busca el parámetro 'param' en la query string de la url actual y retorna su valor
function getQueryParam(param) {
    // returns first occurence and stops
    window.location.search.substr(1)
        .split('&')
        .some(item => {
            if (item.split('=')[0] == param) return (param = item.split('=')[1]);
        });

    return param;
}