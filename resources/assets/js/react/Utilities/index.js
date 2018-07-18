function toastErrors(errors) {
    for (let error in errors) {
        toastr.error(errors[error][0])
    }
};


export default {
    toastErrors
}