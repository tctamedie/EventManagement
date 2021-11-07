function DoAjax(url, type, postData, config, callSuccessback, callErrorBack) {
    $.ajax({
        type: type,
        url: url,
        dataType: 'json',
        data: postData,
        success: (data) => {
            callSuccessback(data, config);
        },
        error: callErrorBack
    });
}