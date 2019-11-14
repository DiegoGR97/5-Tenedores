import * as firebase from "firebase";

export const uploadImage = async (uri, nameImage, folder) => {
  return new Promise((resolve, reject) => {
    /*
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
    fetch(uri)
      .then(async resolvedImage => {
        //console.log("resolvedImage:", resolvedImage);
        const ref = firebase
          .storage()
          .ref()
          .child(`${folder}/${nameImage}`);
        ref
          .put(resolvedImage._bodyBlob)
          .then(() => {
            firebase
              .storage()
              .ref(`${folder}/${nameImage}`)
              .getDownloadURL()
              .then(downloadURL => {
                //console.log("getDownloadURL:", downloadURL);
                resolve(downloadURL);
              })
              .catch(error => {
                console.log("error en getDownloadUrl():", error);
              });
          })
          .catch(error => {
            console.log("Error en put:", error);
          });
      })
      .catch(error => {
        console.log("Error en FETCH:", error);
      });
  });
};
