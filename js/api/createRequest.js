/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    let xhr = new XMLHttpRequest();
    let formData = new FormData;
  
    xhr.withCredentials = true; //!
    xhr.responseType = options.responseType;
    
    if (options.method === 'GET') {
      options.url = options.url + '?';
      for (let key in options.data) {
          options.url += `${key}=${options.data[key]}&`;
      }
    } else {
      for (let key in options.data) {
          formData.append(key, options.data[key]);
      }
    }

    xhr.addEventListener("readystatechange", function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        let response = xhr.response;
        options.callback(null, response);
      }
    })
  
    xhr.open(options.method, options.url);

    try {
      xhr.send(formData);
    } catch (err) {
      options.callback(err);
    }
    console.log(xhr);
    return xhr
};
