import { teacherBulk } from "routes/links";
import axios from "axios";

const teacherBulkAPI = async (teacher) => {
  console.log("INSIDE teacher BULK");

  console.log("CSV Data:", teacher);

  const token = localStorage.getItem("token");

  const headers = {
    "Accept-Language": "en-GB,en;q=0.9",
    Authorization: `Bearer ${token}`,
    Connection: "keep-alive",
    "Content-Type": "application/json",
  };

  let result;
  await axios({
    method: "POST",
    url: teacherBulk,
    data: teacher,
    headers: headers,
  })
    .then((res) => {
      console.log(res.data.errors);

      console.log(res.data.successCount);
      const names = res.data.errors.map((error) => error.name).filter(Boolean);
      if (res.data.errors && res.data.errors.length > 0) {
        const firstError = res.data.errors[0];
        if (firstError.teacherRes && firstError.teacherRes.errorMessage) {
          const errorMessage = firstError.teacherRes.errorMessage;
          localStorage.setItem("errorMessage", errorMessage);
        } else {
          console.log("No error message found in the first error object.");
        }
      } else {
        console.log("No errors in the response data.");
      }

      localStorage.setItem("bulkErrors", res.data.errors.length - 1);
      localStorage.setItem("bulkErrorsNames", names);
      localStorage.setItem("successCount", res.data.successCount);
      if (res.status === 201) {
        result = true;
      } else {
        result = false;
      }
    })
    .catch(function (error) {
      console.log(error.response.data.error);
      let err = 0;
      return err;
    });

  return result;
};

export default teacherBulkAPI;