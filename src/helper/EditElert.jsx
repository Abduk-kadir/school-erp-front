import React from 'react'
import Swal from 'sweetalert2'

const EditElert = () => {
    Swal.fire({
        title: "Save Changes?",
        text: "Are you sure you want to save the changes?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save it!"
      }).then((result) => {
        if (result.isConfirmed) Swal.fire({
          title: "Updated!",
          text: "Your data has been updated.",
          icon: "success"
        });
      });
}

export default EditElert