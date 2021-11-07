function LoadData() {

    var path = window.location.pathname.split("/");
    path = path.filter(s => s !== "");
    var url = "/" + path[0] + "/GetTableModel";
    var id = ""
    if (path.length > 2) {
        id = path[path.length - 1];
    }
    console.log(path);
    var form = document.getElementById("searchForm");
    console.log(form);
    var filter = {search:"",status:"A"};
    console.log(filter, path,id);
    const record = null;
    DoAjax(url, "POST", { id: id, filter:filter }, record, function (data) {

        var promise = new Promise((resolve, reject) => {
            console.log(data);
            resolve(createTableFilter(data.model.filters));

        });
        promise.then(() => {

            CreateBreadCrumb(data.model);
            CreateTableHeader(data.model);
            LoadTable(data);
            //createTabs(data.modal);
            createForeignKeyValue(data);
        })

    }
        , DisplayPageError);


}
function CreateBreadCrumb(tableConfig) {

    if (!tableConfig)
        return;
    var homeLink = $("<li></li>").addClass("breadcrumb-item").html($("<a><i class='zmdi zmdi-home'></i> Home</a>").attr("href", "/"));
    var areaHomeLink = $("<li></li>").addClass("breadcrumb-item").html($("<a></a>").text(tableConfig.area).attr("href", "/" + tableConfig.area));
    $("#breadcrumb").empty();
    $("#breadcrumb").append(homeLink);
    //$("#breadcrumb").append(areaHomeLink);
    
    tableConfig.breadCrumbs.forEach(s => {
        var link = "/" + s.area + "/" + s.controller;
        if (s.recordID && s.recordID.length > 0) {
            link = link + "/Index/" + s.recordID;
        }
        var blink = $("<li></li>").addClass("breadcrumb-item").html($("<a></a>").text(s.header).attr("href", link));
        $("#breadcrumb").append(blink);
    });
    var header = tableConfig.header;
    $("#breadcrumb").append($("<li></li>").addClass("breadcrumb-item active").text(header));   
    if (tableConfig.breadCrumbs.length > 0) {
        var crumb = tableConfig.breadCrumbs[tableConfig.breadCrumbs.length - 1];
        header = crumb.prependHeader + " " + header;
    }
    $("#pageHeader").text(header);
    document.title = tableConfig.header + " - " + document.title.split("-")[1].trim();
}
function CreateTableHeader(config) {
    //if ($("tbody thead").length > 0)
    $("#DataProgressBar").show();
    $(".table thead").remove();
    //if ($("tbody tbody").length > 0)
    $(".table tbody").remove();
    $(".table").append("<thead></thead>");
    $(".table").append("<tbody></tbody>");
    $(".table thead").append("<tr></tr>");
    if (!config)
        return;

    var columns = config.columns;
    if (!config.isCreator) {
        $("#btnCreate").hide();
    } else {
        $("#btnCreate").show();

    }
    ManageAddNewButton();
    count = 0;
    //GetButtons();
    columns.forEach(s => {
        var styles = {
            textAlign: s.alignment,
            width: s.width ? s.width + "px" : ""
        };
        //console.log(styles,s);
        //var style = "text-align:" + s.alignment + ";" + s.width ? "width:" + s.width + "px" : "";
        var th = $("<th></th>").css(styles).addClass("sortable").html(s.displayName + " <i class='fa fa-sort pull-right'></i>")
        $(".table thead tr").append(th);

    });
    var width = (config.buttons.length + config.navigationLinks.length)
    if (width > 0) {
        var th = $("<th></th>").css({ "width": (width * 32 + 10) + "px", "text-align": "center" });
        $(".table thead tr").append(th);
    }
}
function ManageAddNewButton() {
    console.log("Testing ManageAddNewButton")
}
function LoadTable(config) {
    if (!config)
        return;
    LoadSearch(config);
    return false;
}
function createButtonStyle(button, icon, btnClass, title, row) {
    button.attr("data-icon", icon);
    const iconClass = "fa fa-" + icon;
    const iconEl = $("<i></i>").addClass(iconClass);
    const buttonStyle = "btn btn-" + btnClass + " btn" + title;
    button.addClass(buttonStyle);
    button.attr("title", title);
    button.append(iconEl);
}
function checkDisability(authStatus, title, originalUser, currentUser) {
    let disabled = false;
    console.log(originalUser, currentUser);
    if (title === "Approve" || title === "Delete") {
        if (authStatus === "A")
            disabled = true;
        if (title === "Approve") {
            if (originalUser === currentUser)
                disabled = true
        }
        if (title === "Delete") {
            if (originalUser !== currentUser)
                disabled = true;
        }
    }
    return disabled;
}
function LoadSearch(config) {


    if (!config)
        return;
    var tableConfig = config.model;
    $(".table tbody tr").remove();
    
    AppendDataToTable(config.records,"System", tableConfig)
    //DoAjax(url, "POST", data, config, populateTableFromServer, DisplayPageError);
    //GetDbItem("Configuration", path[1], "controller", (config) => {


    //});
}
function createFilterPayload(config) {

    return ExtractFields(config);
}
function ExtractFields(fields) {

    if (fields.length === 0 || !fields)
        return;
    record = {};
    fields.forEach(s => {
        let val = $('#' + s.id).val();
        var defaultValue = $('#' + s.id).attr("data-default-value");
        if (!val) {
            if (defaultValue)
                val = defaultValue;
        }
        if (s.dataType.includes("number")) {
            val = val.replace(",", "");
        }

        if (s.dataType.includes("int") || s.dataType.includes("number")) {
            if (s.dataType.includes("?"))
                val = val ? val.length === 0 ? null : val : null;
            else
                val = val ? val.length === 0 ? 0 : val : 0;
        }
        if (s.dataType.includes("bool")) {
            val = val ? val.length === 0 ? false : val : false;
        }
        if (s.dataText === "string") {
            val = val ? val.length === 0 ? "" : val : "";
        }
        record[s.id] = val;
    });
    return record;
}
function populateTableFromServer(data, config) {
    if (!config)
        return;
    var user = $("#loggedInUser").attr("text");
    AppendDataToTable(data, user, config);
    const controller = config.controller;
    //CreateOrUpdateDb(controller, data);
}
function AppendDataToTable(items, user, config) {

    $.each(items, function (i, item) {
        CreateTableRow(item, config, user);
    });
    //CreatePagination(config);
    $("#DataProgressBar").hide();
}
function CreateTableRow(item, config, user = "System") {
    column = "";

    if (!config)
        return;

    var columns = config.columns;
    var buttons = config.buttons;

    //var alignments = getAlignments();
    var idColumn = "id" //config.idColumn;
    var links = config.navigationLinks;
    var id = item[idColumn]
    count = 0;
    console.log(buttons, links);
    let size = ((buttons === null ? 0 : buttons.length) + links.length) * 30 + 10;
    if (size < 50)
        size = 50;
    width = size + "px";
    var tableRow = $("<tr></tr>");
    var tableData = $("<td></td>").css({ "width": width, "text-align": "center" });
    columns.forEach(s => {
        var td = $("<td></td>").css({ "text-align": s.alignment });
        let val = item[s.id];
        console.log(s);
        switch (s.dataType) {
            case "number":
                val = formatNumber(val, 2, ".", ",");
                break;
            case "date":
                val = formatDate(val);
                break;

        }
        const maxLength = 60;
        var myStr = val;

        if (val !== null && $.trim(val).length > maxLength) {
            var newStr = myStr.substring(0, maxLength);
            val = newStr;
            var removedStr = myStr.substring(maxLength, $.trim(myStr).length);
            td.html(newStr);
            td.append(' <a href="javascript:void(0);" class="read-more">read more...</a>');
            td.append('<span class="more-text">' + removedStr + '</span>');
            td.addClass("show-read-more");
        } else {
            td.html(val);
        }
        tableRow.append(td)
        //column += "<td style='text-align:" + align + ";'>" + item[s] + "</td>";
        count++;
    });

    CreateButtons(item, buttons, id, user, tableData);
    CreateLinks(links, id, tableData);
    if ((buttons.length + links.length) > 0)
        tableRow.append(tableData);
    //console.log(tableRow);
    $('.table tbody').append(tableRow);
}
function CreateButtons(item, buttons, id, user, element) {
    if (buttons === null)
        return;
    var path = window.location.pathname.split("/");
    path = path.filter(s => s !== "");
    
    buttons.forEach(row => {
        var url = "/" + path[0] + "/" + row["action"]+"/"+id;
        const icon = row['icon'];
        buttonClass = row['class']
        text = row['text'];
        title = row['title'];
        authCount = item['authCount'];
        authStatus = item['authStatus'];
        recordUser = item['maker'];
        recordUpdater = item['modifier'];
        if (recordUpdater) {
            recordUser = recordUpdater
        }
        var button = $("<a></a> ");
        let disabled = checkDisability(authStatus, title, recordUser, user);
        button.attr("disabled", disabled);
        button.attr("data-toggle", "tooltip");
        button.attr("data-placement", "auto");
        button.attr("data-text", text);
        button.attr("data-action", title);
        button.attr("data-title", title);
        button.attr("title", title);
        button.attr("data-id", id);
        button.attr("href", url);
        createButtonStyle(button, icon, buttonClass, title, item);
        element.append(button).append("&nbsp;");

    });

}
function CreateLinks(links, id, element) {
    links.forEach(row => {
        var icon = $("<i></i>").addClass(row['linkButtonIcon']);
        var button = $("<button></button> ").addClass(row['linkButtonClass'] + " btnLink");
        button.attr("data-action", row['action']);
        button.attr("data-controller", row['controller']);
        button.attr("data-area", row['area']);
        button.attr("data-name", row['linkButtonName']);
        button.attr("title", row['linkButtonTitle']);
        button.attr("data-toggle", "tooltip");
        button.attr("data-id", id);
        button.attr("type", "button");
        button.click(NavigateToLink);
        button.append(icon);
        //button.addEventListener("click", NavigateToLink)
        element.append(button).append("&nbsp;");
    });
}
function createTableFilter(config) {
    console.log(config);
    var modal = $("#filterFieldsPanel");
    modal.empty();
    console.log(modal);
    config.forEach(s => {
        modal.append(CreateSearchControl(s));
    });


}
function CreateSearchControl(field) {
    var label = `lbl${field.id}`, style = field.hidden ? "display:none" : "display:block";
    var column = $(`<div style=${style}></div>`).addClass("form-control-column-spacer col-md-" + field.width);
    var inputGroup = $("<div></div>").addClass("input-group").attr("style", style);
    var labelControl = $("<span></span>").addClass("input-group-addon").html(field.displayName).attr("id", label);
    const control = CreateFilterControl(field);

    inputGroup.append(labelControl).append(control);
    column.append(inputGroup);
    return column;
}
function CreateFilterControl(field) {
    console.log(field);
    var datePickerClass = field.isDate ? " ui-datepicker" : "";
    var type = field.controlType === "date" ? "text" : field.controlType;
    var multipleSelect = field.multpleSelect ? "multiple" : "";
    var controlCss = `form-control input-sm${datePickerClass}`;
    if (field.type === "file") {
        controlCss = `form-control-file input-sm`;
        $("#Save").attr("enctype", "multipart/form-data");
    }
    var control = $("<input onchange='" + field.onChangeAction + "()' />").attr("type", type);
    if (field.isDropDown)
        control = $(`<select ${multipleSelect} onchange='` + field.onChangeAction + `()'></select>`);
    if (field.defaultValue) {
        control.val(field.defaultValue);
    }
    control.attr("id", field.id)
        .attr("name", field.id)
        .addClass(controlCss)
        .attr("data-default-value", field.defaultValue)
        .attr("data-allowed-value", field.allowedValue)
        .attr("data-autogenerated", field.autogenerated);
    if (field.autogenerated) {
        control.attr("disabled", "disabled")
    }
    if (field.requiredField) {
        control.data('required-field', field.requiredField);
        control.attr('tooltip', field.requiredField.errorMessage);
    }
    if (field.isRequired) {
        control.attr('required', field.isRequired);
        //control.attr('tooltip', field.requiredField.errorMessage);
    }
    
    if (!field.isDropDown) {
        control
            .attr("type", type).attr("data-type", field.dataType);

        if (field.dataType.includes("date")) {
            control.datepicker({ dateFormat: 'dd-M-yy', changeYear: true, changeMonth: true }).css("z-index", 99999);
        }
        if (field.fieldLength) {
            control.attr('maxLength', field.fieldLength.maximumLength);
            control.attr('minLength', field.fieldLength.minimumLength);
            control.attr('tooltip', field.requiredField.errorMessage);
        }

    } else {
        var url = `/${field.area}/${field.controller}/${field.action}`;
        var selectChange = field.onSelectedChange ? field.onSelectedChange : "";
        var selectField = field.onField ? field.onField : "";
        control.attr("data-select-change", selectChange);
        control.attr("data-select-field", selectField);
        control.attr("data-value", field.valueField);
        control.attr("data-text", field.textField);
        control.attr("data-sort-field", field.sortField);
        control.attr("data-filter-column", field.filterColumn);
        control.attr("data-filter-value", field.filterValue);
        control.attr("data-url", url);
        control.attr("data-controller", field.action !== "BooleanList" ? field.controller : field.action);
        control.addClass("dropdown");
        CreateSingleSelect(control);
    }
    return control;
}
function DisplayError(elementID, ex) {
    console.log(elementID, ex);
    const error = ex['responseText'] !== '' ? JSON.parse(ex['responseText']) : [{ errorMessage: 'Unspecified error occured while executing request', id: '' }]
    console.log(ex);
    var response = error;
    console.log(ex);
    var list = "";
    if (response.length > 0)
        list = "<ol>";
    response.forEach(s => {
        const message = s['errorMessage'];
        var id = s["id"];
        if (!id)
            list += "<li>" + message + "</li>";

        else {
            $("#" + id).addClass("errorControl");
            $("#" + id).attr("data-toggle", "tooltip");
            $("#" + id).attr("data-placement", "auto");
            $("#" + id).attr("title", message);
            $("#lbl" + id).addClass("errorLabel");
        }
    })
    if (response.length > 0)
        list += "</ol>";
    //var r = jQuery.parseJSON(ex);
    //console.log(response);
    $("#" + elementID).html("<div class='alert alert-danger' role='alert'> <i class='zmdi zmdi-warning'></i>Please Check the below issues&nbsp" + list + "</div>");

}
function DisplayModalError(ex) {
    console.log(ex);
    DisplayError("divModalError", ex);
}
function DisplayPageError(ex) {
    $("#DataProgressBar").hide();

    DisplayError("divMessage", ex);
}
function Search() {

    var path = window.location.pathname.split("/");
    path = path.filter(s => s !== "");
    var url = "/" + path[0] + "/" + path[1] + "/GetTableModel";
    var id = ""
    if (path.length > 2) {
        id = path[path.length - 1];
    }
    var form = document.getElementById("searchForm");    
    var records = new FormData(form);
    var record= {}
    records.forEach((v, k) => {
        record[k] = v;
    })
    console.log(record)
    
    DoAjax(url, "POST", { id: id, filter: record }, null, function (data) {

        LoadSearch(data);
    }
        , DisplayPageError);

}
function formatDate(date) {

    var rawDate = new Date(date);

    var month = rawDate.getMonth();
    var day = ("0" + rawDate.getDate()).slice(-2);
    var year = rawDate.getFullYear();

    var monthName = getMonth(month, true);
    return `${day}-${monthName}-${year}`;
}
function getMonth(id, isShort) {
    var months = [
        {
            id: 0,
            short: "Jan",
            long: "January"
        },
        {
            id: 1,
            short: "Feb",
            long: "February"
        },
        {
            id: 2,
            short: "Mar",
            long: "March"
        },
        {
            id: 3,
            short: "Apr",
            long: "April"
        },
        {
            id: 4,
            short: "May",
            long: "May"
        },
        {
            id: 5,
            short: "Jun",
            long: "June"
        },
        {
            id: 6,
            short: "Jul",
            long: "July"
        },
        {
            id: 7,
            short: "Aug",
            long: "August"
        },
        {
            id: 8,
            short: "Sep",
            long: "September"
        },
        {
            id: 9,
            short: "Oct",
            long: "October"
        },
        {
            id: 10,
            short: "Nov",
            long: "November"
        },
        {
            id: 11,
            short: "Dec",
            long: "December"
        }

    ];
    const month = months.find(s => s.id === id);
    return isShort ? month.short : month.long;
}
function formatNumber(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e);
    }
}

function NavigateToLink() {
    var baseUrl = window.location.origin;
    var controller = $(this).attr("data-controller");
    var action = $(this).attr("data-action");
    var area = $(this).attr("data-area");
    var id = $(this).attr("data-id");
    var path = controller + "/" + action + "/" + id;
   
    if (area)
        path = "/" + area + "/" + path;
    var url = baseUrl + path;

    $(location).attr('href', url);

}