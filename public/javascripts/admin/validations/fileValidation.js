import { handleMessage } from "../../helpers.js";

export const fileValidation = (fileClass) => {
  let inputElement = document.querySelector(`${fileClass}`);
  let files = inputElement.files;
  if (files.length == 0) {
    // handleMessage('warning', 'Please choose a file', 'Files of .png, .gif, .jpg and .jpeg format allowed!');
    // return false;
  } else {
    for (let i = 0; i < files.length; i++) {
      let filename = files[i].name;

      /* getting file extenstion eg- .jpg,.png, etc */
      let extension = filename.substr(filename.lastIndexOf("."));

      /* define allowed file types */
      let allowedExtensionsRegx = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

      /* testing extension with regular expression */
      let isAllowed = allowedExtensionsRegx.test(extension);

      if (!isAllowed) {
        handleMessage(
          "warning",
          "File type is valid for the upload",
          "Only .png, .gif, .jpg and .jpeg format allowed!"
        );
        return false;
      }

      let fileSize = files[i].size;

      /* 1024 = 1MB */
      let size = Math.round(fileSize / 1024);
      /* checking for less than or equals to 2MB file size */
      if (size > 2 * 1024) {
        handleMessage(
          "warning",
          "File size too big",
          "Only files upto 2MB is allowed!"
        );
        return false;
      }
    }
  }
  return true;
};
