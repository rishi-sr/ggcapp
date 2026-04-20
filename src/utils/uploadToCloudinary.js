export const uploadToCloudinary = async (file) => {
  const url = `https://api.cloudinary.com/v1_1/dnl0zdmwt/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ggc_unsigned");

  const res = await fetch(url, {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  return data.secure_url;
};