import * as firebase from "firebase";

export const uploadImage = async (uri, nameImage, folder) => {
  /*   return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.onerror = reject;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.response);
      }
    };

    xhr.open("GET", uri);
    xhr.responseType = "blob";
    xhr.send();
  })
    .then(async resolve => { */
  await fetch(uri)
    .then(async resolve => {
      //console.log("resolve:", resolve);
      const ref = firebase
        .storage()
        .ref()
        .child(`${folder}/${nameImage}`);
      await ref.put(resolve._bodyBlob);

      return await firebase
        .storage()
        .ref(`${folder}/${nameImage}`)
        .getDownloadURL()
        .then(downloadURL => {
          console.log("getDownloadURL:", downloadURL);
          return downloadURL;
        })
        .catch(error => {
          console.log("error en getDownloadUrl():", error);
        });
    })
    .catch(error => {
      console.log("Error en FETCH:", error);
    });
};
