function CreateButton(action, id) {
    icon = 'edit';
    title = 'Edit';
    btnclass = 'default btn-xs';
    if (action === "Delete") {
        icon = 'trash';
        title = 'Delete';
        btnclass = 'default btn-xs btn-red'
    } else if (action === "View") {
        icon = 'external-link';
        title = 'View';
        btnclass = "primary btn-xs"
    }
    var iconClass = "fa fa-" + icon;
    dataText = title;
    if (icon === 'edit') {
        icon = 'save';
        dataText = "Save Changes";
    }
    return '<button type="button" data-action="' + action + '" data-icon="' + icon + '" data-text="' + dataText + '"  data-id="' + id + '" class="btn btn-' + btnclass + ' btn' + action + '"  data - toggle="tooltip" title = "' + title + '" data - placement="auto" > <i class="' + iconClass + '"></i></button > '
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
function createButtonStyle(button, icon, btnClass, title, row) {
    button.attr("data-icon", icon);
    const iconClass = "fa fa-" + icon;
    const iconEl = $("<i></i>").addClass(iconClass);
    const buttonStyle = "btn btn-" + btnClass + " btn" + title;
    button.addClass(buttonStyle);
    button.attr("title", title);
    button.append(iconEl);
}
function CreateButtons(item, buttons, id, user, element) {

    if (buttons == null)
        return;
    var path = window.location.pathname.split("/");
    path = path.filter(s => s !== "");
    
    buttons.forEach(row => {
        var url = "/" + path[0] + "/" + path[1] + "/"+row['action']+"/"+id;
        const icon = row['icon'];
        buttonClass = row['class']
        text = row['text'];
        //disabled = "";
        title = row['title'];
        authCount = item['authCount'];
        authStatus = item['authStatus'];
        recordUser = item['maker'];
        recordUpdater = item['modifier'];
        if (recordUpdater) {
            recordUser = recordUpdater
        }
        var button = $("<button></button> ");
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
        //var iconEl = $("<i></i>").addClass(iconClass);
        //button.append(iconEl);
        createButtonStyle(button, icon, buttonClass, title, item);
        element.append(button).append("&nbsp;");
        //buttonHtml += '<button '+disabled+' type="button" data-action="' + title + '" data-icon="' + icon + '" data-text="' + text + '"  data-id="' + id + '" class="btn btn-' + buttonClass + ' btn' + title + '"  data - toggle="tooltip" title = "' + title + '" data - placement="auto" > <i class="' + iconClass + '"></i></button > ';
    });

    //return buttonHtml;
}
function CreateLinks(links, id, element) {
    //var buttonHtml = "";
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
        button.append(icon);

        element.append(button).append("&nbsp;");
        //buttonHtml += JSON.stringify(button);
    });
    //console.log(buttonHtml);
    //return buttonHtml;
}
function NavigateToLink() {
    var baseUrl = window.location.origin;
    var controller = $(this).attr("data-controller");
    var action = $(this).attr("data-action");
    var area = $(this).attr("data-area");
    var id = $(this).attr("data-id");
    var path = controller + "/" + action + "/" + id;
    if (action.toLowerCase() === "index")
        path = controller + "/" + id;
    if (area)
        path = "/" + area + "/" + path;
    var url = baseUrl + path;

    $(location).attr('href', url);

}
$.fn.textOnly = function () {
    return $(this).clone()
        .children()
        .remove()
        .end()
        .text();
}
$.fn.requiredFields = function () {
    return JSON.parse($(this).attr("data-required-fields"));
}
function GetRequiredFields() {
    return JSON.parse($("#modalPopup").attr("data-required-fields"));
}
function GetFieldLengths() {
    return JSON.parse($("#modalPopup").attr("data-field-lengths"));
}
function AddValidation() {
    var requireds = $("").requiredFields();
    var lengths = GetFieldLengths();
    requireds.forEach(s => {
        var labelID = "#lbl" + s['id'];
        var fieldID = "#" + s['id'];
        var text = $(labelID).textOnly();

        $(labelID).empty().text(text);
        $(labelID).append("<span style='color:red'> *</span>");
        $(fieldID).attr('required', 'required');
    });
    lengths.forEach(s => {
        $("#" + s['id']).attr('maxLength', s['maximumLength']);
        $("#" + s['id']).attr('minLength', s['minimumLength']);
    });
}
function CreateTableRow(item, config, user = "System") {
    column = "";

    if (!config)
        return;

    var columns = config.table.tableColumns;
    var buttons = config.table.buttons;

    //var alignments = getAlignments();
    var idColumn = config.idColumn;
    var links = config.table.navigationLinks;
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
        
        if (val!==null&&$.trim(val).length > maxLength ) {
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
function formatDate(date) {

    var rawDate = new Date(date);

    var month = rawDate.getMonth();
    var day = ("0" + rawDate.getDate()).slice(-2);
    var year = rawDate.getFullYear();

    var monthName = getMonth(month, true);
    return `${day}-${monthName}-${year}`;
}
function GetTableRow(item, user) {
    column = "";
    var config = getModalConfiguration();
    if (!config)
        return;

    var columns = config.table.tableColumns;
    var buttons = config.table.buttons;
    //var alignments = getAlignments();
    var idColumn = config.idColumn;
    var links = config.table.navigationLinks;
    var id = item[idColumn]
    count = 0;

    width = ((buttons.length + links.length) * 30 + 10) + "px";
    var tableRow = $("<tr></tr>");
    var tableData = $("<td></td>").css({ "width": width, "text-align": "center" });
    columns.forEach(s => {

        tableRow.append($("<td></td>").css({ "text-align": s.alignment }).text(item[s.id]))
        //column += "<td style='text-align:" + align + ";'>" + item[s] + "</td>";
        count++;
    });

    CreateButtons(item, buttons, id, user, tableData);
    CreateLinks(links, id, tableData);
    if (buttons.length > 0)
        tableRow.append(tableData);
    return tableRow;
}
function TrickleDown(element) {
    var item = $(element).val();
    var affectedObject = $(element).attr("data-select-change");
    if (affectedObject) {
        var affectedElement = $("#" + affectedObject);
        var field = $(element).attr("data-select-field");
        console.log(field, item);
        CreateSelect(affectedElement, item, field);
    }
}
function LoadTrickledDropDownlist(id, element) {
    CreateSelect(element, id);
}
function GetState(key) {
    return sessionStorage.getItem(key);

}
function GetDbState(controller, index, callback, name = "WFA") {
    var request = OpenDb(name, 1, []);
    getStoreItems(request, controller, index, callback);

}
function GetDbItem(storeName, id, index, callback, name = "WFA") {
    var request = OpenDb(name, 1, []);
    console.log(id);
    findItem(request, storeName, id, index, callback);

}
function SetConfigurationState(data) {
    var tables = [
        { storeName: "Configuration", index: "controller" },
    ]
    var request = OpenDb("WFA", 1, tables);

    Operation(request, Add, "Configuration", data);
}

function SetState(key, value) {
    var tables = [
        { storeName: "FunctionalArea", index: "id" },
        { storeName: "Grade", index: "id" },
        { storeName: "Department", index: "id" },
        { storeName: "Division", index: "id" },
        { storeName: "Section", index: "id" },
        { storeName: "Job", index: "id" },
        { storeName: "Establishment", index: "id" },
        { storeName: "EarningDefinition", index: "id" },
        { storeName: "DeductionDefinition", index: "id" },
        { storeName: "EmployeeEarning", index: "id" },
        { storeName: "EmployeeDeduction", index: "id" },
        { storeName: "PaymentType", index: "id" },
        { storeName: "TaxationType", index: "id" },
        { storeName: "Taxation", index: "id" },

    ]
    var request = OpenDb(1, tables);

    sessionStorage.setItem(key, value);
}
function populateTableFromState(config, callback) {

    console.log(config);
    if (!config)
        return;
    GetDbState(config.table.controller + (config.id ? "" : config.id), config.idColumn, (items) => {
        console.log(items);
        if (items.length > 0) {

            var records = items;
            var user = $("#loggedInUser").attr("text");
            var searchField = config.table.searchField;
            var searchValue = $("#" + searchField).val();
            var columns = config.table.tableColumns;


            if (searchValue) {
                records = items.filter(s => {
                    var searchString = "";

                    columns.forEach(k => {
                        if (isNaN(s[k.id]))
                            searchString += s[k.id];
                        else
                            searchString += parseFloat(s[k.id]);

                    });
                    //console.log(searchString, searchValue);
                    return searchString.toLowerCase().includes(searchValue.toLowerCase());
                })
            }
            AppendDataToTable(records, user, config);
        } else {
            callback();
        }
    });
}
function AppendDataToTable(items, user, config) {

    $.each(items, function (i, item) {
        CreateTableRow(item, config, user);
    });
    CreatePagination(config);
    $("#DataProgressBar").hide();
}
function populateTableFromServer(data, config) {
    if (!config)
        return;
    //var buttons = data['buttons'];
    var user = $("#loggedInUser").attr("text");
    //console.log(user)
    //var id = config.id;
    //var url = "/" + config.area + "/" + config.controller + "/" + config.searchAction;
   // var urlFinal = url + (id ? id : "");
    //SetState(urlFinal, JSON.stringify(data));
    //AddValidation();
    AppendDataToTable(data, user, config);
    const controller = config.controller; //+ (!config.id ? "" : config.id);
    //console.log(controller)
    CreateOrUpdateDb(controller, data);
}
function IsStateSet(key) {
    var isSet = sessionStorage.getItem(key);
    if (isSet)
        return true;
    return false;
}
function createSearchData(config) {
    const id = config.id;
    const searchInputField = config.table.searchField;
    const search = $("#" + searchInputField).val();
    const data = { search: search, id: id };
    return data;
}
function LoadTable(config) {
    if (!config)
        return;

    
    LoadSearch(config);
    //var url = "/" + config.area + "/" + config.controller + "/" + config.searchAction;
    //const data = createSearchData(config);
    //DoAjax(url, "GET", data, config, populateTableFromServer, DisplayPageError)
    //Populate table from IndexedDb otherwise fetch from the server
    //populateTableFromState(config, () => {

    //    DoAjax(url, "GET", { search: search, id: id }, config, populateTableFromServer, DisplayPageError)
    //});

    return false;
}
function GetModalFields() {

    var config = getModalConfiguration();
    if (!config)
        return;
    return config.modal.rows.map(row => row.modalFields).flat();

}
function CreateBreadCrumb(config) {

    if (!config)
        return;
    var homeLink = $("<li></li>").html($("<a></a>").text("Home").attr("href", "/Home"));
    var areaHomeLink = $("<li></li>").html($("<a></a>").text(config.area).attr("href", "/" + config.area));
    $("#breadcrumb").empty();
    $("#breadcrumb").append(homeLink);
    $("#breadcrumb").append(areaHomeLink);

    config.table.breadCrumbs.forEach(s => {
        var link = "/" + s.area + "/" + s.controller;
        if (s.recordID && s.recordID.length > 0) {
            link = link + "/Index/" + s.recordID;
        }
        var blink = $("<li></li>").html($("<a></a>").text(s.header).attr("href", link));
        $("#breadcrumb").append(blink);
    });
    var header = config.table.pageHeader;
    if (config.table.breadCrumbs.length > 0) {
        var crumb = config.table.breadCrumbs[config.table.breadCrumbs.length - 1];
        header = crumb.prependHeader + " " + header;
    }
    $("#pageHeader").text(header);
    document.title = config.table.pageHeader + " - " + document.title.split("-")[1].trim();
}
function getModalConfiguration() {
    var path = window.location.pathname.split("/");
    path = path.filter(s => s !== "");
    var url = "/" + path[0] + "/" + path[1] + "/GetUI";
    var id = "";
    if (path.length > 2) {
        id = path[path.length - 1];
    }
    var urlFinal = url + (id ? id : "");
    return GetDataFromState(urlFinal);
}
function LoadTableFromServer(config) {


    if (!config)
        return;
    $(".table tbody tr").remove();
    var searchInputField = config.table.searchField;
    var url = "/" + config.area + "/" + config.controller + "/" + config.searchAction;
    var id = config.id;
    var search = $("#" + searchInputField).val();
    DoAjax(url, "GET", { search: search, id: id }, config, populateTableFromServer, DisplayPageError)
    return false;
}
function GetButtons() {
    return $(".table").attr("data-buttons");
}
function GetLinks() {
    return $(".table").attr("data-links");
}
function getFields() {
    return $("#modalPopup").attr("data-fields").split(',');
}
function ClearForm(config) {
    //var columns = getFields();
    var fields = config.tabs.map(row => row.rows.map(s => s.modalFields).flat()).flat();
    if (!fields)
        return;
    fields.forEach(field => {
        var s = field.id;
        var id = "#" + s;
        var defaultValue = field.defaultValue;
        var val = defaultValue ? defaultValue : "";
        $(id).val(val);
        //if ($(id).hasClass("dropdown")) {
        //    console.log(field);
        //    $(id).find('option[selected="selected"]').removeAttr("selected");
        //    $(id).find('option[value="' + val + '"]').attr('selected', 'selected');
        //}

        //else {
        //  $(id).val(val);           
        //}
        clearErrors(s);
    })

    return false;
}
function clearErrors(s) {

    $("#" + s).removeClass("errorControl");
    $("#" + s).removeAttr("data-toggle");
    $("#" + s).removeAttr("data-placement");
    $("#" + s).removeAttr("title");
    $("#lbl" + s).removeClass("errorLabel");
}
function clearControlErrors() {
    const s = $(this).attr("id");
    clearErrors(s);
}
function getColumns() {
    return $(".table").attr("data-columns").split(',');
}
function getAlignments() {
    return $(".table").attr("data-column-align").split(',');
}
function ManageAddNewButton() {
    console.log("Testing ManageAddNewButton")
}
function LockForm(action, config, idColumn) {
    //var columns = getFields();
    var fields = config.tabs.map(row => row.rows.map(s => s.modalFields).flat()).flat();
    if (!fields)
        return;

    fields.forEach(field => {
        var s = field.id;
        var id = $("#" + s);
        var autogenerated = field.autogenerated;
        var readonly = (autogenerated == 'true' || (action === "Edit" && s === idColumn) || !(action === "Edit" || action === "Create"));
        $(id).attr("readonly", readonly);

    });
}
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);

    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}
function ExtractFields(fields) {
    
    if (fields.length===0||!fields)
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
function ExtractRecord(config) {
    if (!config)
        return;
    console.log(config);
    var fields = config.tabs.map(tab => tab.rows.map(row => row.modalFields).flat()).flat();
    return ExtractFields(fields);
   
}
function UpdateLocalStorage(action, config, row, record, idColumn) {
    let actionMsg = "Updated";
    if (action !== "Edit") {

        actionMsg = action + "d";
    }
    if (action === "Delete") {
        Delete(config.controller, row[idColumn], (records) => {

        });
    }


    else if (action === "Edit" || action === "Approve" || action === "Create") {
        CreateSingle(config.controller, row);
        if (action === "Create") {
            Delete(config.controller, record[idColumn], (data) => { console.log(data) }, "WFA_TEMP");
        }
    }
    actionMsg += " " + config.modal.header + " Successfully";
    $("#divMessage").html("<div class='alert alert-success fade in' role='alert'> <i class='fa fa-check'></i>&nbsp" + actionMsg);

}
function createFilterPayload(config) {
    
    return ExtractFields(config);
}
function createPayload(config) {
    console.log(config.modal);
    var record = ExtractRecord(config.modal);
    if (!record)
        return;
    const action = $("#modalPopup").attr("data-action");
    const idColumn = config.idColumn;
    id = $("#" + idColumn).val();
    idUrl = config.id ? config.id : "";
    if (action === "Create") {
        return { record: record, args: idUrl }
    } else if (action === "Edit") {
        return { id: id, record: record, args: idUrl }
    }
    else if (action === "Delete" || action === "Approve") {
        return { id: id }
    }
    return { id: id, record: record, action: action, category: idUrl };
}
function createEndPointUrl(config) {
    let action = $("#modalPopup").attr("data-action");
    const saveAction = config.saveAction;
    action = saveAction.length > 0 ? saveAction : action;
    const actionPrefix = config.saveActionPrefix;
    const actionSuffix = config.saveActionSuffix;
    const endPoint = `${actionPrefix}${action}${actionSuffix}`;
    return window.location.origin + "/" + config.area + "/" + config.controller + "/" + endPoint;
}
function Save() {
    var path = window.location.pathname.split("/");
    path = path.filter(s => s !== "");
    GetDbItem("Configuration", path[1], "controller", (config) => {

        if (!config)
            return;
        const data = createPayload(config);
        if (!data)
            return;
        var url = createEndPointUrl(config);
        PostData(config, data, url);

    });
}
function PostData(config, record, url) {

    const action = $("#modalPopup").attr("data-action");
    const idColumn = config.idColumn;
    $.ajax({
        type: 'POST',
        url: url,
        dataType: 'json',
        data: record,
        success: function (data) {
            var row = data;
            UpdateLocalStorage(action, config, row, record, idColumn);
            $("#modalPopup").modal('hide');
            //$("#divMessage").removeClass("text-danger text-success");

            LoadTable(config);
        },
        error: DisplayModalError
    });
}
function Delete(controller, id, callback, name = "WFA") {
    var request = OpenDb(name, 1, []);
    DeleteItem(request, controller, id, callback);
}
function GetDataFromState(key) {

    var isSet = IsStateSet(key);
    if (isSet) {
        return JSON.parse(GetState(key));
    }
}
number_format = function (number, decimals, dec_point, thousands_sep) {
    number = number.toFixed(decimals);

    var nstr = number.toString();
    nstr += '';
    x = nstr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? dec_point + x[1] : '';
    var rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1))
        x1 = x1.replace(rgx, '$1' + thousands_sep + '$2');

    return x1 + x2;
}
function parseJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return str;
    }
}
function CreateSelect(element, id = "", field = "", selectedValue = "") {
    var url = $(element).attr("data-url");
    var text = $(element).attr("data-text");
    var value = $(element).attr("data-value");
    var path = url.split("/");
    path = path.filter(s => s !== "");
    //var data =window.localStorage(url);
    console.log(selectedValue);
    $(element).empty();
    var defaultValue = $(element).attr("data-default-value");
    var selected = defaultValue ? defaultValue : selectedValue ? selectedValue : "";
    selected = parseJSON(selected);
    $(element).append($("<option></option>").val("").text("Select ..."));
    var urlFinal = url + (id === null ? "" : id);
    DoAjax(url, 'POST', { }, null,
        function (data) {

            createSelect(element, data, field, id);
        },
        DisplayModalError
    );


}
function createSelect(element, data, fkKey = null, fkValue = null) {

    var text = $(element).attr("data-text");
    var value = $(element).attr("data-value");
    var sortField = $(element).attr("data-sort-field");
    var filterColumn = $(element).attr("data-filter-column");
    var filterValue = $(element).attr("data-filter-value");

    var selectedValue = $(element).val();
    var defaultValue = $(element).attr("data-default-value");
    var selected = defaultValue ? defaultValue : selectedValue ? selectedValue : "";
    
    if (filterColumn && filterValue) {
        if (filterValue === "true") {
            data = data.filter(s => s[filterColumn] === true);
        }
        else if (filterValue === "false") {
            data = data.filter(s => s[filterColumn] === false);
        } else {
            data = data.filter(s => s[filterColumn] == filterValue);
        }
    }
    if (fkKey && fkValue) {
        data = data.filter(s => s[fkKey] == fkValue);
    }
    $(element).empty();
    $(element).append($("<option></option>").val("").text("Select ..."));
    
    var rows = data.sort((a, b) => {
        var va = a[sortField];
        var vb = b[sortField];
        if (va < vb)
            return -1;
        if (va > vb)
            return 1;
        return 0;
    });
    rows.forEach(s => {
        var val = s[value];
        var txt = s[text];
        var isBoolean = selected === "false" || selected === "true" || selected === true || selected === false;
        if (isBoolean) {
            if (selected === "false")
                selected = false;
            else
                selected = true;
        }
        if (selected == val) {

            $(element).append($("<option></option>").val(val).text(txt));
        }
        else
            $(element).append($("<option></option>").val(val).text(txt));
        if (selected)
            $(element).val(selected);
    });
}

function CreateSingleSelect(element, id = "", field = "") {

    console.log(element);
    var value = $(element).attr("data-value");
    var controller = $(element).attr("data-controller");;
    var url = $(element).attr("data-url");
    console.log(url);
    var data = { search: "", id: id };
    if (controller === "GetRecordStatus")
        data = {};
    var submissionType = "GET";
    if (controller !== "BooleanList")
        submissionType = "POST";
    console.log(controller, data);
    DoAjax(url, submissionType, data, null,
        function (data) {
            console.log(data, controller);
            CreateOrUpdateDb(controller, data);
            createSelect(element, data, field, id);
        },
        DisplayModalError
    );
    

}
function boolParse(v) {
    if (v === "true" || v === true)
        return true;
    else if (v === "false" || v === false)
        return false;
    return v;
}
function PopulateDropDownList() {
    $("select.dropdown").each(function () {

        CreateSelect(this);

    });

}
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
function SaveLater() {
    var path = window.location.pathname.split("/");
    path = path.filter(s => s !== "");
    GetDbItem("Configuration", path[1], "controller", (config) => {

        var record = ExtractRecord(config.modal);
        CreateOrUpdateDb(config.controller, record, "WFA_TEMP");
        $("#modalPopup").modal('hide');
    });
}
function createButtonText(iconText, buttonText, action, row) {
    return "<i class='fa fa-" + iconText + "'></i>&nbsp;" + buttonText;
}
function manageSaveButton(action, buttonText, iconText, row) {
    var buttonClass = "btn-success";
    $("#btnSaveLater").hide();
    $("#btnSave").show();
    if (action === "Delete") {
        buttonClass = "btn-red";
    }
    else if (action === "View") {
        $("#btnSave").hide();
    }
    else if (action === "Create") {
        $("#btnSaveLater").show();
    }

    if ($("#btnSave").hasClass("btn-success"))
        $("#btnSave").removeClass("btn-success")
    if ($("#btnSave").hasClass("btn-red"))
        $("#btnSave").removeClass("btn-red");
    console.log(iconText, buttonText, action);
    const icon = createButtonText(iconText, buttonText, action);
    console.log(iconText, buttonText, action, icon)
    $("#btnSave").html(icon);
    $("#btnSave").addClass(buttonClass);

}
function PopulateForm() {
    var path = window.location.pathname.split("/");
    path = path.filter(s => s !== "");
    GetDbItem("Configuration", path[1], "controller", (config) => {
        if (!config)
            return;
        $("#divModalError").html("");
        $("#pnlControls").hide();
        $("#divMessage").html("");
        var id = $(this).attr("data-id");
        var action = $(this).attr("data-action");
        var buttonText = $(this).attr("data-text");
        var iconText = $(this).attr('data-icon');
        $("#modalPopup").attr("data-action", action);
        $(this).parent().parent().attr("data-" + action.toLowerCase(), id);
        var modal = config.modal.header;
        //console.log(id, action, modal);
        ClearForm(config.modal);
        LockForm(action, config.modal, config.idColumn);
        createForeignKeyValue(config);
        var modalText = action + " " + modal;

        $("#modalHeader").html(modalText);
        var database = "WFA";
        if (action == "Create") {
            database = "WFA_TEMP";
        }
        console.log(config);
        SetData(id, config, database, action, buttonText, iconText);
        $("#modalPopup").modal({ backdrop: 'static', keyboard: false });
        return false;
    });
}
function modal(element, flag) {
    $("#" + element).modal(flag)
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
    $("#" + elementID).html("<div class='alert alert-danger fade in' role='alert'> <i class='fa fa-warning'></i>Please Check the below issues&nbsp" + list + "</div>");

}
function DisplayModalError(ex) {
    console.log(ex);
    DisplayError("divModalError", ex);
}
function DisplayPageError(ex) {
    $("#DataProgressBar").hide();

    DisplayError("divMessage", ex);
}
function UpdateForm(data, fields, action, buttonText, iconText) {
    manageSaveButton(action, buttonText, iconText, data);
    if (data) {
        UpdateControlPanel(data);
        fields.forEach(field => {
            var s = field.id;
            var val = data[s];
            var id = '#' + s;
            if (field.dataType.includes("date") && val != null) {
                val = formatDate(val);
            }
            if (field.dataType.includes("number") && val != null) {
                if (isNaN(val))
                    val = val.replace(",", "");
                val = formatNumber(val);
            }
            if ($(id).hasClass("dropdown")) {
                val = val ? val : "";
                if (field.dataType.includes("bool")) {
                    if (val === true)
                        val = "true";
                    if (val === false || val === "")
                        val = "false"
                } else {
                    val = val + "";
                }
            }
            $(id).val(val);
        });
    }
}
///Set data based on either local database or server database
function SetData(idValue, config, database, action, buttonText, iconText) {


    if (!config)
        return;
    var fields = config.modal.tabs.map(tab => tab.rows.map(s => s.modalFields).flat()).flat();
    var searchUrl = "/" + config.area + "/" + config.controller + "/" + config.searchAction;
    var id = config.id ? config.id : "";

    var idColumn = config.idColumn;
    var url = searchUrl + id;
    if (database == "WFA") {
        GetDbItem(config.controller, idValue, idColumn, (record) => {
            console.log(record);
            UpdateForm(record, fields, action, buttonText, iconText);
        }, database);
    } else {
        GetDbState(config.controller, idColumn, (records) => {

            UpdateForm(records[0], fields, action, buttonText, iconText);
        }, database);
    }

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
    //var headers = $(".table").attr("data-column-headers").split(',');
    //var headerWidth = $(".table").attr("data-column-width").split(',');
    //var headerAlignment = $(".table").attr("data-column-align").split(',');

    if (!config)
        return;

    var columns = config.table.tableColumns;
    if (!config.table.isCreator) {
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
        var th = $("<th></th>").css(styles).addClass("sortable").html(s.name + " <i class='fa fa-sort pull-right'></i>")
        $(".table thead tr").append(th);

    });
    var width = (config.table.buttons.length + config.table.navigationLinks.length)
    if (width > 0) {
        var th = $("<th></th>").css({ "width": (width * 32 + 10) + "px", "text-align": "center" });
        $(".table thead tr").append(th);
    }
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
function LoadData() {
    var path = window.location.pathname.split("/");
    path = path.filter(s => s !== "");
    var url = "/" + path[0] + "/" + path[1] + "/GetUI";

    var id = ""
    if (path.length > 2) {
        id = path[path.length - 1];
    }
    var finalUrl = url + (id ? id : "");
    const record = null;
    DoAjax(url, "GET", { id: id }, record, function (data) {
        SetConfigurationState(data);
        console.error("in promise");
        var promise = new Promise((resolve, reject) => {
            resolve(createTableFilter(data.table.tableFilterModels));
            console.error("in promise");
        });
        promise.then(() => {
            console.error("in promised land");
            CreateBreadCrumb(data);
            CreateTableHeader(data);
            LoadTable(data);
            createTabs(data.modal);
            createForeignKeyValue(data);
        })
        
    }
        , function (error) { });
    //var records = GetState(finalUrl);
    //CreateOrUpdateDb("Configuration", []);
    //GetDbItem("Configuration", path[1], 'controller', (record) => {
    //    console.log(record);
    //    if (!record) {


    //    } else {
    //        //records = JSON.parse(records);
    //        createTabs(record);
    //        CreateTableHeader(record);
    //        CreateBreadCrumb(record);
    //        LoadTable(record);
    //    }
    //});

}
function Logout() {
    sessionStorage.clear();
    var baseUrl = window.location.origin;
    var controller = "Security";
    var action = "Logout";
    var area = "Security";

    var path = controller + "/" + action;
    if (area)
        path = "/" + area + "/" + path;
    var url = baseUrl + path;
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        data: {},
        success: function () {

        },
        error: DisplayModalError
    });
    $(location).attr('href', url);
    return true;
}
function RefreshData() {
    var path = window.location.pathname.split("/");
    path = path.filter(s => s !== "");
    GetDbItem("Configuration", path[1], "controller", (config) => {
        $("#search").val("");
        CreateTableHeader(config);
        LoadTableFromServer(config);
    });
}
function CreateModal() {
    $("#modalPopup .modal-dialog").remove();
    $("#modalPopup").append('<div class="modal-dialog" style="max-height: 640px;" role="dialog"></div>');
    $("#modalPopup .modal-dialog").append('<div class="modal-content"></div>');
    $("#modalPopup .modal-dialog .modal-content").append('<div class="modal-header"></div>');
    $("#modalPopup .modal-dialog .modal-content").append('<div class="modal-body"></div>');
    $("#modalPopup .modal-dialog .modal-content").append('<div class="modal-footer"></div>');
    $("#modalPopup .modal-dialog .modal-content .modal-header").append('<button class="close" data-dismiss="modal">&times;</button><span id="modalHeader">Create Programme</span>');


    $("#modalPopup .modal-dialog .modal-content .modal-body").append('<div id="divModalError"></div>');
    var fields = $("#modalPopup").attr('data-fields').split(',');
    var types = $("#modalPopup").attr('data-types').split(',');
    var widths = $("#modalPopup").attr('data-field-width').split(',');
    var labels = $("#modalPopup").attr('data-labels').split(',');
    var generations = $("#modalPopup").attr('data-autogenerated').split(',');
    var rows = $("#modalPopup").attr('data-field-rows').split(',');
    var positions = $("#modalPopup").attr('data-field-positions').split(',');
    var controls = [];
    fields.forEach((s, i) => {

        type = types[i];
        width = widths[i];
        label = labels[i];
        autogenerated = generations[i];
        controls[i] = CreateControl(width, label, type, s, autogenerated);

    });
    var numRows = Math.round(controls.length / 2);
    while (numRows > 0) {
        numRows--;
        controls.splice()
    }

}
function UpdateControlPanel(item) {
    if (item) {
        $("#pnlControls").show();
        var icontrol = '<i class="fa fa-edit text-danger"></i>';
        let maker = item["maker"];
        const modifier = item["modifier"];
        var checker = item["checker"];
        maker = modifier ? modifier : maker;
        if (maker) {
            $("#divCapturer").empty().append(icontrol).append(document.createTextNode("Captured By: " + maker)).show();
        }
        if (checker) {
            $("#divAuth").empty().append(icontrol).append(document.createTextNode("Authorised By: " + checker)).show();
        } else {
            $("#divAuth").hide();
        }
    }
}
function diffInMonths(end, start) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return (endDate.getMonth() - startDate.getMonth() +
        (12 * (endDate.getFullYear() - startDate.getFullYear()))) + 1;
}
function fireAjax(type, url, data, successCallBack, errorCallBack) {

    $.ajax({
        type: type,
        url: url,
        dataType: 'json',
        data: data,
        success: (data) => { successCallBack(data); },
        error: errorCallBack
    });
}
function LoadSearch(config) {

   
    if (!config)
        return;
    $(".table tbody tr").remove();
    var url = "/" + config.area + "/" + config.controller + "/Search"
    const data = createFilterPayload(config.table.tableFilterModels);
    console.error(data, config);
    if (!data)
        return;
    DoAjax(url, "POST", data, config, populateTableFromServer, DisplayPageError);
    //GetDbItem("Configuration", path[1], "controller", (config) => {


    //});
}
function Search() {
    
    var path = window.location.pathname.split("/");
    path = path.filter(s => s !== "");
   
   
    GetDbItem("Configuration", path[1], "controller", (config) => {
        LoadSearch(config);
    });
}
function CreateFilterControl(field,) {
    var datePickerClass = field.isDate ? " ui-datepicker" : "";
    var type = field.type === "date" ? "text" : field.type;
    var multipleSelect = field.multpleSelect ? "multiple" : "";
    var controlCss = `form-control input-sm${datePickerClass}`;
    if (field.type === "file") {
        controlCss = `form-control-file input-sm`;
        $("#Save").attr("enctype", "multipart/form-data");
    }
    var control = $("<input onchange='" + field.changeAction + "()' />");
    if (field.isDropDown)
        control = $(`<select ${multipleSelect} onchange='` + field.changeAction + `()'></select>`);
    if (field.defaultValue)
    {
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
function CreateFormControl(field,) {
    var datePickerClass = field.isDate ? " ui-datepicker" : "";
    var type = field.type === "date" ? "text" : field.type;
    var multipleSelect = field.multpleSelect ? "multiple" : "";
    var controlCss = `form-control input-sm${datePickerClass}`;
    if (field.type === "file") {
        controlCss = `form-control-file input-sm`;
        $("#Save").attr("enctype", "multipart/form-data");
    }
    var control = $("<input />");
    if (field.isDropDown)
        control = field.onSelectedChange ? $(`<select ${multipleSelect} onchange='TrickleDown(this)'></select>`) : $(`<select ${multipleSelect} ></select>`);
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
        control.data('required-field',field.requiredField);
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
        control.attr("data-controller", field.action !== "BooleanList"?  field.controller : field.action);
        control.addClass("dropdown");
        CreateSingleSelect(control);
    }
    return control;
}
function formatTyping(e) {
    var val = $(this).val();
    if (e.keyCode != 190) {
        val += "";
        const number = val.split(".");
        let wholeNumber = number[0];
        const fraction = number.length > 1 ? "." + number[1] : "";
        const rgx = /(\d+)(\d{3})/;
        wholeNumber = wholeNumber.replace(/[\D\s_\-]+/g, "")
        while (rgx.test(wholeNumber)) {
            wholeNumber = wholeNumber.replace(rgx, '$1' + ',' + '$2')
        }
        wholeNumber += fraction;
        //let formattedNumber = formatNumber(val.replace(/[\D\s_\-]+/g, ""));
        //formattedNumber = formattedNumber.replace(".00", "");
        $(this).val(wholeNumber);
    }
}
function CreateControl(field) {
    var label = `lbl${field.id}`, style = field.hidden ? "display:none" : "display:block";
    var column = $(`<div style=${style}></div>`).addClass("form-control-column-spacer col-md-" + field.grids);
    var inputGroup = $("<div></div>").addClass("input-group");
    var requiredLabel = field.label + (field.isRequired ? " <span style='color:red'> *</span>" : "");
    var labelControl = $("<span></span>").addClass("input-group-addon").html(requiredLabel).attr("id", label);
    const control = CreateFormControl(field);

    inputGroup.append(labelControl).append(control);
    column.append(inputGroup);
    return column;
}
function CreateSearchControl(field) {
    var label = `lbl${field.id}`, style = field.hidden ? "display:none" : "display:block";
    var column = $(`<div style=${style}></div>`).addClass("form-control-column-spacer col-md-" + field.grids);
    var inputGroup = $("<div></div>").addClass("input-group");   
    var labelControl = $("<span></span>").addClass("input-group-addon").html(field.label).attr("id", label);
    const control = CreateFilterControl(field);

    inputGroup.append(labelControl).append(control);
    column.append(inputGroup);
    return column;
}
function CreateRow(row) {
    var hiddens = row.modalFields.filter(s => s.isHidden).length;
    var allFields = row.modalFields.length;
    var style = hiddens === allFields ? "display:none" : "display:block";
    var brow = $(`<div style=${style}></div>`).addClass("row form-control-row-spacer");
    var fields = row.modalFields.sort((a, b) => { return a.order - b.order });
    fields.forEach(field => {
        brow.append(CreateControl(field));
    });
    return brow;
}
function createForeignKeyValue(config) {
    //console.log(config)
    if (config.id && config.foreignColumn) {
        $("#" + config.foreignColumn).val(config.id);
    }
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
function createTabs(config) {
    console.log(config);
    var errorDiv = $("<div></div>").attr("id", "divModalError");
    var modal = $(".modal-body");
    modal.empty();
    modal.append(errorDiv);
    var tabs = $("<ul></ul>").addClass("nav nav-tabs");
    var contents = $("<div></div>").addClass("tab-content");

    var orderedTabs = config.tabs.sort((a, b) => { return a.order - b.order });
    orderedTabs.forEach(s => {
        var activeClass = s.isActive ? "active" : "";
        console.table(activeClass, s);
        var tab = $("<li></li>").addClass(`nav-item ${activeClass}`);
        var anchor = $("<a></a>")
            .addClass("nav-link "+activeClass)
            .attr("href", '#' + s.id)
            .attr("data-toggle", "tab")
            .attr("aria-expanded", s.isActive)
            .text(s.name);

        var content = $("<div></div>").addClass("tab-pane fade").attr("id", s.id);
        
        tab.append(anchor);
        console.log(s);
        if (config.tabs.length == 1) {
            CreateForm(modal, s.rows);
        } else {
            tabs.append(tab);
            contents.append(content);
            CreateForm(content, s.rows);
        }


    });
    if (config.tabs.length == 1) {
        tabs.hide();
    } else {
        modal.append(tabs);
        modal.append(contents);
    }

}
function CreateForm(tab, data) {

    var rows = data.sort((a, b) => { return a.order - b.order });
    rows.forEach(row => {
        tab.append(CreateRow(row));
    });
    //AddValidation();
}